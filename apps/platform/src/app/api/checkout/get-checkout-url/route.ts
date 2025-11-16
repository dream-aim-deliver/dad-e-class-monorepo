import { createCheckoutSession } from '../../../../lib/infrastructure/server/config/payments/stripe.config';
import env from '../../../../lib/infrastructure/server/config/env';

function extractDiscountFromCoupon(coupon: string): number {
    // Extract number from coupon code (e.g., "XXX5" -> 5, "XXX10" -> 10)
    const match = coupon.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const couponCode = searchParams.get('coupon');
    const customerEmail = searchParams.get('email');
    const discountPercentage = couponCode ? extractDiscountFromCoupon(couponCode) : 0;

    const origin = env.NEXT_PUBLIC_APP_URL;
    const checkoutSession = await createCheckoutSession(
        1000,
        origin,
        discountPercentage,
        customerEmail || undefined
    );

    // Save the session ID and other details to your database
    console.log('Created checkout session:', checkoutSession.id, 'with discount:', discountPercentage + '%', 'for email:', customerEmail || 'none');

    return Response.json({
        clientSecret: checkoutSession.client_secret,
        sessionId: checkoutSession.id
    });
}
