import { stripe } from '../../../../lib/infrastructure/server/config/payments/stripe.config';
import { backendTrpc } from '../../../../lib/infrastructure/server/trpc/backend-client';
import { NextRequest } from 'next/server';

/**
 * Verify Stripe payment and unlock purchased content
 *
 * Flow:
 * 1. Authenticate user (TODO: add authentication)
 * 2. Verify payment with Stripe
 * 3. Extract metadata and build purchase items
 * 4. Call backend to process purchase
 * 5. Return result
 */
export async function POST(req: NextRequest) {
    try {
        // Parse request
        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return Response.json(
                { error: 'Missing sessionId parameter' },
                { status: 400 }
            );
        }

        // TODO: Get authenticated user
        // For now, using mock user ID
        // In production, use: const session = await getServerSession(); const userId = session?.user?.id;
        const userId = 'mock-user-id';

        if (!userId) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Step 1: Verify payment with Stripe
        console.log('[verify-and-unlock] Retrieving Stripe session:', sessionId);

        let stripeSession: any;
        try {
            stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        } catch (error) {
            console.error('[verify-and-unlock] Failed to retrieve Stripe session:', error);
            return Response.json(
                { error: 'Failed to retrieve payment session' },
                { status: 500 }
            );
        }

        // Step 2: Validate payment status
        if (stripeSession.payment_status !== 'paid') {
            return Response.json(
                {
                    error: 'Payment not completed',
                    status: stripeSession.payment_status,
                },
                { status: 400 }
            );
        }

        // Step 3: Extract metadata
        const metadata = stripeSession.metadata || {};
        const purchaseType = metadata.purchaseType;

        if (!purchaseType) {
            return Response.json(
                { error: 'Invalid session metadata: missing purchase type' },
                { status: 400 }
            );
        }

        console.log('[verify-and-unlock] Processing purchase:', {
            userId,
            purchaseType,
            metadata,
        });

        // Step 4: Build purchase items based on purchase type
        const purchaseItems = buildPurchaseItems(purchaseType, metadata);

        // Step 5: Call backend to process purchase
        const transactionData = {
            stripeSessionId: sessionId,
            amount: stripeSession.amount_total || 0,
            currency: stripeSession.currency || 'chf',
            customerEmail: stripeSession.customer_details?.email || '',
            paymentStatus: stripeSession.payment_status,
            metadata,
        };

        const result = await backendTrpc.processPurchase.mutate({
            userId,
            transactionData,
            purchaseType,
            purchaseItems,
        });

        console.log('[verify-and-unlock] Purchase processed successfully:', result);

        // Step 6: Build response that matches what the UI expects
        const response = {
            success: result.success,
            alreadyProcessed: result.alreadyProcessed,
            transaction: {
                id: result.transactionId,
                amount: transactionData.amount,
                currency: transactionData.currency.toUpperCase(),
            },
            purchaseType,
            purchaseIdentifier: extractPurchaseIdentifier(purchaseType, metadata),
            customerEmail: transactionData.customerEmail,
            purchasedItems: result.enrollments.map(e => ({
                name: `Course ${e.courseId}`,
                description: e.coachingIncluded ? 'With coaching' : 'Course access',
            })),
        };

        return Response.json(response);
    } catch (error: any) {
        console.error('[verify-and-unlock] Error:', error);
        return Response.json(
            {
                error: 'Failed to process purchase',
                message: error.message || 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * Build purchase items array from Stripe metadata
 */
function buildPurchaseItems(purchaseType: string, metadata: Record<string, any>) {
    const items = [];

    switch (purchaseType) {
        case 'StudentCoursePurchase':
            items.push({
                type: 'course' as const,
                courseSlug: metadata.courseSlug,
                withCoaching: false,
            });
            break;

        case 'StudentCoursePurchaseWithCoaching':
            items.push({
                type: 'course' as const,
                courseSlug: metadata.courseSlug,
                withCoaching: true,
            });
            break;

        case 'StudentPackagePurchase':
            items.push({
                type: 'package' as const,
                packageId: parseInt(metadata.packageId),
                selectedCourseIds: metadata.courseIds
                    ? metadata.courseIds.split(',').map((id: string) => parseInt(id))
                    : [],
                withCoaching: false,
            });
            break;

        case 'StudentPackagePurchaseWithCoaching':
            items.push({
                type: 'package' as const,
                packageId: parseInt(metadata.packageId),
                selectedCourseIds: metadata.courseIds
                    ? metadata.courseIds.split(',').map((id: string) => parseInt(id))
                    : [],
                withCoaching: true,
            });
            break;

        case 'StudentCoachingSessionPurchase':
            // Parse coaching offerings
            const offerings = parseCoachingOfferings(
                metadata.offerings || metadata.coachingOfferingId,
                metadata.quantity
            );

            items.push({
                type: 'coaching_sessions' as const,
                offerings,
            });
            break;

        default:
            throw new Error(`Unknown purchase type: ${purchaseType}`);
    }

    return items;
}

/**
 * Parse coaching offerings from metadata
 */
function parseCoachingOfferings(
    offeringsString: string,
    quantityString?: string
): Array<{ coachingOfferingId: number; quantity: number }> {
    // Handle legacy single offering format
    if (!offeringsString.includes(',') && !offeringsString.includes(':')) {
        return [
            {
                coachingOfferingId: parseInt(offeringsString),
                quantity: quantityString ? parseInt(quantityString) : 1,
            },
        ];
    }

    // Parse multiple offerings: "1:3,2:2" means offering 1 qty 3, offering 2 qty 2
    return offeringsString.split(',').map((pair) => {
        const [offeringId, quantity] = pair.split(':');
        return {
            coachingOfferingId: parseInt(offeringId),
            quantity: parseInt(quantity),
        };
    });
}

/**
 * Extract purchase identifier from metadata for UI redirects
 */
function extractPurchaseIdentifier(purchaseType: string, metadata: Record<string, any>) {
    switch (purchaseType) {
        case 'StudentCoursePurchase':
        case 'StudentCoursePurchaseWithCoaching':
            return { courseSlug: metadata.courseSlug };

        case 'StudentPackagePurchase':
        case 'StudentPackagePurchaseWithCoaching':
            return { packageId: parseInt(metadata.packageId) };

        case 'StudentCoachingSessionPurchase':
            return {
                offeringId: parseInt(metadata.coachingOfferingId || metadata.offerings?.split(':')[0] || '0'),
            };

        default:
            return {};
    }
}
