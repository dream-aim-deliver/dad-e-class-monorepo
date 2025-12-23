import 'server-only';
import { stripe } from '../../../../lib/infrastructure/server/config/payments/stripe.config';
import { NextRequest } from 'next/server';
import nextAuth from '../../../../lib/infrastructure/server/config/auth/next-auth.config';
import { useCaseModels } from '@maany_shr/e-class-models';
import { TAppRouter } from '@dream-aim-deliver/e-class-cms-rest';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { getLocale } from 'next-intl/server';
import { getTRPCUrl } from '../../../../lib/infrastructure/common/utils/get-cms-query-client';
import env from '../../../../lib/infrastructure/server/config/env';

/**
 * Creates headers for backend tRPC requests with authentication and localization
 */
async function createBackendHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    // Get session from NextAuth
    try {
        const session = await nextAuth.auth();
        if (session?.user?.idToken) {
            headers['Authorization'] = `Bearer ${session.user.idToken}`;
        }
        // Add session ID header (defaults to "public" if no session)
        headers['x-eclass-session-id'] = session?.user?.sessionId || 'public';
    } catch (error) {
        // Still set session ID to "public" on error
        headers['x-eclass-session-id'] = 'public';
    }

    // Add locale header
    try {
        const locale = await getLocale();
        if (locale) {
            headers['Accept-Language'] = locale;
        }
    } catch (error) {
        // Locale header optional, continue without it
    }

    // Add platform header
    try {
        const platformSlug = env.NEXT_PUBLIC_E_CLASS_RUNTIME;
        if (platformSlug) {
            headers['x-eclass-runtime'] = platformSlug;
        }
    } catch (error) {
        // Platform header optional, continue without it
    }

    return headers;
}

/**
 * Real backend tRPC client for processing purchases
 * Connects directly to CMS REST backend
 */
const backendTrpc = createTRPCProxyClient<TAppRouter>({
    links: [
        httpBatchLink({
            transformer: superjson,
            url: getTRPCUrl(),
            async headers() {
                return await createBackendHeaders();
            },
        }),
    ],
});

/**
 * Verify Stripe payment and unlock purchased content
 *
 * Flow:
 * 1. Authenticate user
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

        // Get authenticated user from NextAuth session
        const session = await nextAuth.auth();
        const userId = session?.user?.id;

        if (!userId) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Step 1: Verify payment with Stripe
        let stripeSession: any;
        try {
            stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['payment_intent'],
            });
        } catch (error) {
            return Response.json(
                { error: 'Failed to retrieve payment session' },
                { status: 500 }
            );
        }

        // Step 2: Validate payment status
        // Check both checkout session status and payment intent status
        // payment_intent can be a string (ID) or an object (if expanded)
        let paymentIntentId: string | null = null;
        let paymentIntentStatus = 'unknown';
        
        if (stripeSession.payment_intent) {
            if (typeof stripeSession.payment_intent === 'string') {
                // Not expanded - it's just the ID
                paymentIntentId = stripeSession.payment_intent;
            } else if (typeof stripeSession.payment_intent === 'object' && stripeSession.payment_intent !== null) {
                // Expanded - extract the ID and status from the object
                paymentIntentId = (stripeSession.payment_intent as any).id;
                paymentIntentStatus = (stripeSession.payment_intent as any).status || 'unknown';
            }
            
            // If we have an ID but no status, retrieve it
            if (paymentIntentId && paymentIntentStatus === 'unknown') {
                try {
                    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                    paymentIntentStatus = paymentIntent.status;
                } catch (error) {
                    // Payment intent retrieval failed, will use checkout session status
                }
            }
        }

        if (stripeSession.payment_status !== 'paid') {
            return Response.json(
                {
                    error: 'Payment not completed',
                    status: stripeSession.payment_status,
                    paymentIntentStatus,
                },
                { status: 400 }
            );
        }

        // Payment intent status verified - backend will do final validation

        // Step 3: Extract metadata
        const metadata = stripeSession.metadata || {};
        const purchaseType = metadata.purchaseType;

        if (!purchaseType) {
            return Response.json(
                { error: 'Invalid session metadata: missing purchase type' },
                { status: 400 }
            );
        }

        // Step 4: Build purchase items based on purchase type
        const purchaseItems = buildPurchaseItems(purchaseType, metadata);

        // Step 5: Call backend to process purchase
        // Backend expects payment intent status "succeeded" rather than checkout session status "paid"
        // Map checkout session status to payment intent status if needed
        const finalPaymentStatus = paymentIntentStatus && paymentIntentStatus !== 'unknown' 
            ? paymentIntentStatus 
            : stripeSession.payment_status === 'paid' ? 'succeeded' : stripeSession.payment_status;

        // Ensure paymentExternalId is a string (use payment intent ID if available, otherwise session ID)
        const paymentExternalIdString = paymentIntentId || sessionId;
        
        if (!paymentExternalIdString || typeof paymentExternalIdString !== 'string') {
            return Response.json(
                {
                    error: 'Invalid payment external ID',
                    details: 'Could not determine payment intent ID or session ID',
                },
                { status: 400 }
            );
        }

        const transactionData = {
            paymentExternalId: paymentExternalIdString,
            paymentProvider: 'stripe',
            amount: stripeSession.amount_total || 0,
            currency: stripeSession.currency || 'chf',
            customerEmail: stripeSession.customer_details?.email || '',
            paymentStatus: finalPaymentStatus,
            metadata,
        };

        let result;
        try {
            result = await backendTrpc.processPurchase.mutate({
                userId,
                transactionData,
                purchaseType,
                purchaseItems,
            });
        } catch (backendError: any) {
            return Response.json(
                {
                    error: 'Backend call failed',
                    message: backendError?.message || 'Failed to call backend processPurchase',
                },
                { status: 500 }
            );
        }

        // Step 6: Validate and build response that matches what the UI expects
        // The backend returns a TProcessPurchaseUseCaseResponse (discriminated union)
        if (!result || result.success !== true) {
            let errorMessage = 'Unknown error from backend';
            if (result && 'data' in result && typeof result.data === 'object' && result.data !== null) {
                const data = result.data as any;
                if ('message' in data && typeof data.message === 'string') {
                    errorMessage = data.message;
                } else if ('errorType' in data && typeof data.errorType === 'string') {
                    errorMessage = `Error type: ${data.errorType}`;
                }
            }
            
            return Response.json(
                {
                    error: 'Purchase processing failed',
                    message: errorMessage,
                },
                { status: 400 }
            );
        }

        // When result.success === true, result.data contains the success data directly
        // The tRPC client may wrap responses, so we need to handle the structure carefully
        const resultData = result.data as unknown;
        let successData: useCaseModels.TProcessPurchaseSuccessResponse['data'];
        
        // Handle both direct data access and wrapped data access
        if (resultData && typeof resultData === 'object' && 'data' in resultData && typeof (resultData as any).data === 'object') {
            // Nested structure: result.data.data
            successData = (resultData as { data: useCaseModels.TProcessPurchaseSuccessResponse['data'] }).data;
        } else {
            // Direct structure: result.data
            successData = resultData as useCaseModels.TProcessPurchaseSuccessResponse['data'];
        }

        const response = {
            success: true,
            alreadyProcessed: successData.alreadyProcessed,
            transaction: {
                id: successData.transactionId,
                amount: transactionData.amount,
                currency: transactionData.currency.toUpperCase(),
            },
            purchaseType,
            purchaseIdentifier: extractPurchaseIdentifier(purchaseType, metadata),
            customerEmail: transactionData.customerEmail,
            purchasedItems: successData.enrollments.map((e: { courseId: number; coachingIncluded: boolean }) => ({
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
                purchaseType: 'course' as const,
                courseSlug: metadata.courseSlug,
                withCoaching: false,
            });
            break;

        case 'StudentCoursePurchaseWithCoaching':
            items.push({
                purchaseType: 'course' as const,
                courseSlug: metadata.courseSlug,
                withCoaching: true,
            });
            break;

        case 'StudentPackagePurchase':
            items.push({
                purchaseType: 'package' as const,
                packageId: parseInt(metadata.packageId),
                selectedCourseIds: metadata.courseIds
                    ? metadata.courseIds.split(',').map((id: string) => parseInt(id))
                    : [],
                withCoaching: false,
            });
            break;

        case 'StudentPackagePurchaseWithCoaching':
            items.push({
                purchaseType: 'package' as const,
                packageId: parseInt(metadata.packageId),
                selectedCourseIds: metadata.courseIds
                    ? metadata.courseIds.split(',').map((id: string) => parseInt(id))
                    : [],
                withCoaching: true,
            });
            break;

        case 'StudentCoachingSessionPurchase': {
            // Parse coaching offerings
            const offerings = parseCoachingOfferings(
                metadata.offerings || metadata.coachingOfferingId,
                metadata.quantity
            );

            items.push({
                purchaseType: 'coaching_sessions' as const,
                offerings,
            });
            break;
        }

        case 'StudentCourseCoachingSessionPurchase':
            // Course-specific coaching sessions for lesson components
            items.push({
                purchaseType: 'course_coaching_sessions' as const,
                courseSlug: metadata.courseSlug,
                lessonComponentIds: metadata.lessonComponentIds
                    ? metadata.lessonComponentIds.split(',')
                    : [],
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

        case 'StudentCourseCoachingSessionPurchase':
            return {
                courseSlug: metadata.courseSlug,
                lessonComponentIds: metadata.lessonComponentIds?.split(',') || [],
            };

        default:
            return {};
    }
}
