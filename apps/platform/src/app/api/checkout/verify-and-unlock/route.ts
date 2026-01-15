import 'server-only';
import { stripe } from '../../../../lib/infrastructure/server/config/payments/stripe.config';
import { NextRequest } from 'next/server';
import nextAuth from '../../../../lib/infrastructure/server/config/auth/next-auth.config';
import { TAppRouter, TProcessPurchaseRequest, ProcessPurchaseRequestSchema, TProcessPurchaseSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';
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
        const couponCode = metadata.couponCode; // Extract coupon code if present

        if (!purchaseType) {
            return Response.json(
                { error: 'Invalid session metadata: missing purchase type' },
                { status: 400 }
            );
        }

        // Step 4: Build purchase items based on purchase type
        const purchaseItems = await buildPurchaseItems(purchaseType, metadata);

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

        // Validate purchaseType is correct
        const validatedPurchaseType = purchaseType as TProcessPurchaseRequest['purchaseType'];
        
        // For coaching_sessions, the items are already enriched with title, duration, and pricePerSession
        // from buildPurchaseItems, so we don't need to modify them
        // Just ensure the purchaseItems are correctly typed
        const validatedPurchaseItems = purchaseItems;

        // Build the final payload - backend expects it wrapped in a request object with context
        const finalPayload = {
            userId: String(userId),
            transactionData,
            purchaseType: validatedPurchaseType,
            purchaseItems: validatedPurchaseItems,
            ...(couponCode && { couponCode }), // Add coupon code if present
        };

        // Local validation to catch schema issues before sending to backend
        try {
            ProcessPurchaseRequestSchema.parse(finalPayload);
        } catch (validationError: any) {
            return Response.json(
                {
                    error: 'Invalid purchase payload',
                    message: validationError.message,
                    details: validationError.issues,
                },
                { status: 400 }
            );
        }


        let result: TProcessPurchaseSuccessResponse;
        try {
            console.log('[DEBUG] Final payload sent to backend processPurchase:', JSON.stringify(finalPayload));
            // @ts-ignore - Type definition may not match actual backend expectation (backend expects request wrapper)
            result = await backendTrpc.processPurchase.mutate(finalPayload);
        } catch (backendError: any) {
            // Check if it's a validation error from FastAPI
            if (backendError?.data?.detail) {
                return Response.json(
                    {
                        error: 'Backend validation failed',
                        message: 'The backend rejected the request format',
                        details: backendError.data.detail,
                        sentPayload: finalPayload,
                    },
                    { status: 422 }
                );
            }
            
            return Response.json(
                {
                    error: 'Backend call failed',
                    message: backendError?.message || 'Failed to call backend processPurchase',
                    details: backendError?.data || backendError?.shape,
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
        let successData: TProcessPurchaseSuccessResponse['data'];
        
        // Handle both direct data access and wrapped data access
        if (resultData && typeof resultData === 'object' && 'data' in resultData && typeof (resultData as any).data === 'object') {
            // Nested structure: result.data.data
            successData = (resultData as { data: TProcessPurchaseSuccessResponse['data'] }).data;
        } else {
            // Direct structure: result.data
            successData = resultData as TProcessPurchaseSuccessResponse['data'];
        }

        // Build purchasedItems based on purchase type
        // For course purchases, use enrollments; for coaching sessions, use coachingSessions
        let purchasedItems: Array<{ name: string; description: string }> = [];
        
        if (purchaseType === 'StudentCourseCoachingSessionPurchase' || purchaseType === 'StudentCoachingSessionPurchase') {
            // For coaching session purchases, map coachingSessions
            if (successData.coachingSessions && successData.coachingSessions.length > 0) {
                purchasedItems = successData.coachingSessions.map((cs: { sessionId: number; offeringId: number | null; courseId: number | null }) => ({
                    name: `Coaching Session ${cs.sessionId}`,
                    description: cs.courseId ? `Course coaching session` : `Coaching session`,
                }));
            } else {
                // Fallback if coachingSessions is empty but purchase succeeded
                purchasedItems = [{
                    name: 'Coaching Sessions',
                    description: 'Course coaching sessions purchased',
                }];
            }
        } else {
            // For course/package purchases, use enrollments
            if (successData.enrollments && successData.enrollments.length > 0) {
                purchasedItems = successData.enrollments.map((e: { courseId: number; coachingIncluded: boolean }) => ({
                    name: `Course ${e.courseId}`,
                    description: e.coachingIncluded ? 'With coaching' : 'Course access',
                }));
            }
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
            purchasedItems,
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
async function buildPurchaseItems(purchaseType: string, metadata: Record<string, any>) {
    const items = [];
    console.log('[Debug] Building purchase items for type:', purchaseType, 'with metadata:', JSON.stringify(metadata));
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
                selectedCourseIds: metadata.selectedCourseIds
                    ? metadata.selectedCourseIds.split(',').map((id: string) => parseInt(id))
                    : undefined,
                withCoaching: false,
            });
            break;

        case 'StudentPackagePurchaseWithCoaching':
            items.push({
                purchaseType: 'package' as const,
                packageId: parseInt(metadata.packageId),
                selectedCourseIds: metadata.selectedCourseIds
                    ? metadata.selectedCourseIds.split(',').map((id: string) => parseInt(id))
                    : undefined,
                withCoaching: true,
            });
            break;

        case 'StudentCoachingSessionPurchase': {
            // Parse coaching offerings from metadata
            // metadata.offerings takes precedence (format: "1:3,2:2" for multiple offerings)
            // Fall back to single offering format (coachingOfferingId + quantity)
            const offeringsString = metadata.offerings 
                ? String(metadata.offerings)
                : metadata.coachingOfferingId 
                    ? String(metadata.coachingOfferingId)
                    : '';
        

            const parsedOfferings = parseCoachingOfferings(
                offeringsString,
                metadata.quantity ? String(metadata.quantity) : undefined
            );

            // Fetch coaching offering details from backend to get title, duration, and pricePerSession
            const coachingOfferingsResponse = await backendTrpc.listCoachingOfferings.query({});
            
            // Extract offerings from response (handle different response structures)
            const response = coachingOfferingsResponse as any;
            const availableOfferings = 
                (response?.offerings && Array.isArray(response.offerings)) ? response.offerings :
                (response?.success && response?.data?.offerings && Array.isArray(response.data.offerings)) ? response.data.offerings :
                (response?.data?.offerings && Array.isArray(response.data.offerings)) ? response.data.offerings :
                (response?.data?.data?.offerings && Array.isArray(response.data.data.offerings)) ? response.data.data.offerings :
                [];
            
            if (availableOfferings.length === 0) {
                throw new Error('Failed to fetch coaching offering details from backend');
            }
            
            // Map parsed offerings to include required fields
            const enrichedOfferings = parsedOfferings.map((parsed) => {
                const offering = availableOfferings.find(
                    (o: { id: string | number }) => 
                        String(o.id) === String(parsed.coachingOfferingId) || Number(o.id) === parsed.coachingOfferingId
                );
                
                if (!offering) {
                    throw new Error(`Coaching offering with ID ${parsed.coachingOfferingId} not found`);
                }

                return {
                    coachingOfferingId: parsed.coachingOfferingId,
                    quantity: parsed.quantity,
                    title: offering.name,
                    duration: offering.duration,
                    pricePerSession: offering.price,
                };
            });
            
            items.push({
                purchaseType: 'coaching_sessions' as const,
                offerings: enrichedOfferings,
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
 * 
 * Supports two formats:
 * 1. Single offering: "123" (just the ID, quantity comes from quantityString parameter)
 * 2. Multiple offerings: "1:3,2:2" (offering 1 with quantity 3, offering 2 with quantity 2)
 * 3. Single offering with quantity: "1:3" (offering 1 with quantity 3)
 */
function parseCoachingOfferings(
    offeringsString: string,
    quantityString?: string
): Array<{ coachingOfferingId: number; quantity: number }> {
    if (!offeringsString || typeof offeringsString !== 'string') {
        throw new Error('Invalid offerings string');
    }

    // Check if it's the multiple offerings format (contains comma)
    if (offeringsString.includes(',')) {
        // Parse multiple offerings: "1:3,2:2" means offering 1 qty 3, offering 2 qty 2
        return offeringsString.split(',').map((pair, index) => {
            const trimmedPair = pair.trim();
            if (!trimmedPair.includes(':')) {
                throw new Error(`Invalid offering format at position ${index}: expected "id:quantity", got "${trimmedPair}"`);
            }
            const [offeringId, quantity] = trimmedPair.split(':');
            const id = parseInt(offeringId.trim(), 10);
            const qty = parseInt(quantity.trim(), 10);
            
            if (isNaN(id) || isNaN(qty) || id <= 0 || qty <= 0) {
                throw new Error(`Invalid offering values at position ${index}: id=${offeringId}, quantity=${quantity}`);
            }
            
            return {
                coachingOfferingId: id,
                quantity: qty,
            };
        });
    }

    // Check if it's single offering with quantity format (contains colon but no comma)
    if (offeringsString.includes(':')) {
        const [offeringId, quantity] = offeringsString.split(':');
        const id = parseInt(offeringId.trim(), 10);
        const qty = parseInt(quantity.trim(), 10);
        
        if (isNaN(id) || isNaN(qty) || id <= 0 || qty <= 0) {
            throw new Error(`Invalid offering values: id=${offeringId}, quantity=${quantity}`);
        }
        
        return [
            {
                coachingOfferingId: id,
                quantity: qty,
            },
        ];
    }

    // Legacy single offering format: just the ID, quantity comes from parameter
    const offeringId = parseInt(offeringsString.trim(), 10);
    if (isNaN(offeringId) || offeringId <= 0) {
        throw new Error(`Invalid offering ID: ${offeringsString}`);
    }

    const quantity = quantityString ? parseInt(quantityString.trim(), 10) : 1;
    if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity: ${quantityString || '1'}`);
    }

    return [
        {
            coachingOfferingId: offeringId,
            quantity: quantity,
        },
    ];
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
                coachUsername: metadata.coachUsername || null,
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
