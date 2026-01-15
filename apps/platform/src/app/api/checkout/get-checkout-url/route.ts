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
    const selectedCourseIds = searchParams.get('selectedCourseIds');
    const coachingOfferingId = searchParams.get('coachingOfferingId');
    const quantity = searchParams.get('quantity');
    const offerings = searchParams.get('offerings'); // Multiple offerings in format "1:3,2:2"
    const withCoaching = searchParams.get('withCoaching');
    const lessonComponentIds = searchParams.get('lessonComponentIds'); // Comma-separated list of lesson component IDs
    const coachUsername = searchParams.get('coachUsername'); // For coaching session purchase - redirect back to coach's calendar

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
    if (selectedCourseIds) metadata.selectedCourseIds = selectedCourseIds;
    if (coachingOfferingId) metadata.coachingOfferingId = coachingOfferingId;
    if (quantity) metadata.quantity = quantity;
    // Multiple offerings take precedence over single offering
    if (offerings) {
        metadata.offerings = offerings;
    }
    if (withCoaching) metadata.withCoaching = withCoaching;
    if (lessonComponentIds) metadata.lessonComponentIds = lessonComponentIds;
    if (coachUsername) metadata.coachUsername = coachUsername;
    // Add coupon code to metadata so backend can track it
    if (couponCode) metadata.couponCode = couponCode;


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
