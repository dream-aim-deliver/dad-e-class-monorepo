import Stripe from 'stripe'
import env from "../env"

export const stripe = new Stripe(env.STRIPE_SECRET_KEY)

interface LineItem {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export const createCheckoutSession = async (
    lineItems: LineItem[],
    currency: string,
    finalPrice: number,
    origin: string,
    customerEmail?: string,
    metadata?: Record<string, string>
) => {
    // Backend returns:
    // - Positive line items with ORIGINAL prices (e.g., Course: 50 CHF)
    // - Negative line item for discount (e.g., Discount: -10 CHF)
    // We need to:
    // 1. Filter out negative items (Stripe doesn't accept them)
    // 2. Calculate discount percentage from originalTotal vs finalPrice
    // 3. Create a Stripe coupon and apply it to the session

    const positiveLineItems = lineItems.filter((item) => item.totalPrice > 0);

    // Calculate original total from positive line items (before discount)
    const originalTotal = positiveLineItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Calculate discount percentage from the difference
    let discountPercentage = 0;
    let couponId: string | undefined;

    if (originalTotal > finalPrice && originalTotal > 0) {
        discountPercentage = Math.round(((originalTotal - finalPrice) / originalTotal) * 100);

        // Create a Stripe coupon with the calculated discount percentage
        if (discountPercentage > 0 && discountPercentage <= 100) {
            const coupon = await stripe.coupons.create({
                percent_off: discountPercentage,
                duration: 'once',
                max_redemptions: 1,
                name: `${discountPercentage}% Discount`,
            });
            couponId = coupon.id;
        }
    }

    // Map backend line items to Stripe line items format
    // Use ORIGINAL prices - Stripe will apply the coupon discount
    const stripeLineItems = positiveLineItems.map((item) => ({
        price_data: {
            currency: currency.toLowerCase(),
            product_data: {
                name: item.name,
                description: item.description || undefined,
            },
            // Use original totalPrice (Stripe will apply coupon discount)
            unit_amount: Math.round((item.totalPrice / item.quantity) * 100),
        },
        quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: stripeLineItems,
        mode: 'payment',
        return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        ...(customerEmail && { customer_email: customerEmail }),
        ...(metadata && { metadata }),
        ...(couponId && {
            discounts: [{
                coupon: couponId,
            }],
        }),
    })

    return session
}