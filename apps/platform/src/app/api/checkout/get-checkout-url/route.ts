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

    // Extract purchase metadata
    const purchaseType = searchParams.get('purchaseType');
    const courseSlug = searchParams.get('courseSlug');
    const packageId = searchParams.get('packageId');
    const courseIds = searchParams.get('courseIds');
    const coachingOfferingId = searchParams.get('coachingOfferingId');
    const quantity = searchParams.get('quantity');
    const withCoaching = searchParams.get('withCoaching');

    // Get the amount in cents (Stripe expects cents)
    const amountParam = searchParams.get('amount');

    // Validate amount parameter
    if (!amountParam) {
        return Response.json(
            { error: 'Missing amount parameter' },
            { status: 400 }
        );
    }

    const amountInCents = parseInt(amountParam, 10);
    if (isNaN(amountInCents) || amountInCents <= 0) {
        return Response.json(
            { error: 'Invalid amount parameter' },
            { status: 400 }
        );
    }

    // Build metadata object
    const metadata: Record<string, string> = {};
    if (purchaseType) metadata.purchaseType = purchaseType;
    if (courseSlug) metadata.courseSlug = courseSlug;
    if (packageId) metadata.packageId = packageId;
    if (courseIds) metadata.courseIds = courseIds;
    if (coachingOfferingId) metadata.coachingOfferingId = coachingOfferingId;
    if (quantity) metadata.quantity = quantity;
    if (withCoaching) metadata.withCoaching = withCoaching;

    const origin = env.NEXT_PUBLIC_APP_URL;
    const checkoutSession = await createCheckoutSession(
        amountInCents,
        origin,
        discountPercentage,
        customerEmail || undefined,
        Object.keys(metadata).length > 0 ? metadata : undefined
    );


    return Response.json({
        clientSecret: checkoutSession.client_secret,
        sessionId: checkoutSession.id
    });
}
