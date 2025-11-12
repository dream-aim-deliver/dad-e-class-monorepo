import Stripe from 'stripe'
import env from "../env"

export const stripe = new Stripe(env.STRIPE_SECRET_KEY)


export const createCheckoutSession = async (
    amount: number,
    origin: string,
    discountPercentage: number = 0
) => {
    const lineItems = [
        {
            price_data: {
                currency: 'chf',
                product_data: {
                    name: 'Coaching Session',
                },
                unit_amount: amount,
            },
            quantity: 1,
        },
        {
            price_data: {
                currency: 'chf',
                product_data: {
                    name: 'Coaching Session - VAT 7.7%',
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