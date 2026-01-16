import { createCheckoutSession } from '../../../../lib/infrastructure/server/config/payments/stripe.config';
import env from '../../../../lib/infrastructure/server/config/env';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const couponCode = searchParams.get('coupon');
    const customerEmail = searchParams.get('email');

    // Extract line items, currency, and final price
    const lineItemsParam = searchParams.get('lineItems');
    const currency = searchParams.get('currency') || 'chf';
    const finalPriceParam = searchParams.get('finalPrice');

    // Validate line items parameter
    if (!lineItemsParam) {
        return Response.json(
            { error: 'Missing lineItems parameter' },
            { status: 400 }
        );
    }

    let lineItems;
    try {
        lineItems = JSON.parse(lineItemsParam);
        if (!Array.isArray(lineItems) || lineItems.length === 0) {
            throw new Error('lineItems must be a non-empty array');
        }
    } catch (error) {
        return Response.json(
            { error: 'Invalid lineItems parameter' },
            { status: 400 }
        );
    }

    // Validate final price parameter
    if (!finalPriceParam) {
        return Response.json(
            { error: 'Missing finalPrice parameter' },
            { status: 400 }
        );
    }

    const finalPrice = parseFloat(finalPriceParam);
    if (isNaN(finalPrice) || finalPrice < 0) {
        return Response.json(
            { error: 'Invalid finalPrice parameter' },
            { status: 400 }
        );
    }

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
        lineItems,
        currency,
        finalPrice,
        origin,
        customerEmail || undefined,
        Object.keys(metadata).length > 0 ? metadata : undefined
    );


    return Response.json({
        clientSecret: checkoutSession.client_secret,
        sessionId: checkoutSession.id
    });
}
