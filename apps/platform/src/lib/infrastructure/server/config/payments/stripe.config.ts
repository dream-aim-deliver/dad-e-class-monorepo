import Stripe from 'stripe'
import env from "../env"

export const stripe = new Stripe(env.STRIPE_SECRET_KEY)


export const createCheckoutSession = async (
    amount: number,
    origin: string,
    discountPercentage = 0,
    customerEmail?: string,
    metadata?: Record<string, string>
) => {
    // Generate product name based on purchase type
    const getProductName = (): string => {
        const purchaseType = metadata?.purchaseType;
        switch (purchaseType) {
            case 'StudentCoursePurchase':
                return 'Course Purchase';
            case 'StudentCoursePurchaseWithCoaching':
                return 'Course Purchase with Coaching';
            case 'StudentPackagePurchase':
                return 'Package Purchase';
            case 'StudentPackagePurchaseWithCoaching':
                return 'Package Purchase with Coaching';
            case 'StudentCoachingSessionPurchase':
                return 'Coaching Session Purchase';
            case 'StudentCourseCoachingSessionPurchase':
                return 'Course Coaching Session Purchase';
            default:
                return 'Purchase';
        }
    };

    // Amount is in cents and already includes VAT (as per use case model: "VAT included in base prices")
    const lineItems = [
        {
            price_data: {
                currency: 'chf',
                product_data: {
                    name: getProductName(),
                },
                unit_amount: amount,
            },
            quantity: 1,
        },
    ]

    // Create a coupon dynamically if discount is provided
    let couponId: string | undefined
    if (discountPercentage > 0 && discountPercentage <= 100) {
        const coupon = await stripe.coupons.create({
            percent_off: discountPercentage,
            duration: 'once',
            max_redemptions: 1,
            name: `${discountPercentage}% Discount`,
        })
        couponId = coupon.id
    }

    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        ...(customerEmail && { customer_email: customerEmail }),
        ...(metadata && { metadata }),
        ...(couponId && {
            discounts: [
                {
                    coupon: couponId,
                },
            ],
        }),
    })

    return session
}