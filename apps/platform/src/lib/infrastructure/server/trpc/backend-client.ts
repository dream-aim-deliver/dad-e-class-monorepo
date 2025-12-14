/**
 * Backend tRPC Client - Communicates with CMS-FastAPI
 *
 * This is currently a MOCK implementation that will be replaced with a real
 * tRPC client once cms-fastapi implements the processPurchase endpoint.
 *
 * To swap for production:
 * 1. Replace mockBackendTrpc with createTRPCProxyClient
 * 2. Configure httpBatchLink to cms-fastapi URL
 * 3. Forward authentication headers
 */

import { useCaseModels } from '@maany_shr/e-class-models';

// ============================================================================
// Mock Storage (temporary - will be replaced by cms-fastapi database)
// ============================================================================

interface MockTransaction {
    id: string;
    paymentExternalId: string;
    paymentProvider: string;
    userId: string;
    purchaseType: string;
    amount: number;
    currency: string;
    status: 'paid' | 'processed';
    customerEmail: string;
    processedAt: number;
}

const mockTransactions = new Map<string, MockTransaction>();
const mockUserEnrollments = new Map<string, Set<number>>(); // userId -> Set of courseIds
const mockCoachingCredits = new Map<string, Map<number, number>>(); // userId -> Map<offeringId, count>

// Mock course data
const mockCourses = [
    { id: 1, slug: 'intro-to-programming', title: 'Introduction to Programming' },
    { id: 2, slug: 'advanced-javascript', title: 'Advanced JavaScript' },
];

// Mock package data
const mockPackages = [
    { id: 1, title: 'Web Development Bundle', courseIds: [1, 2] },
];

// Mock coaching offerings (simulating course_coaching_offerings table)
const mockCourseCoachingOfferings = new Map<number, Array<{ offeringId: number; defaultQuantity: number }>>([
    [1, [{ offeringId: 1, defaultQuantity: 5 }]], // Course 1 includes offering 1
    [2, [{ offeringId: 2, defaultQuantity: 5 }]], // Course 2 includes offering 2
]);

// ============================================================================
// Mock Backend Implementation
// ============================================================================

/**
 * Mock implementation of processPurchase
 * This mimics what cms-fastapi will do
 */
async function mockProcessPurchase(input: useCaseModels.TProcessPurchaseRequest): Promise<useCaseModels.TProcessPurchaseSuccessResponse> {
    const { userId, transactionData, purchaseType, purchaseItems } = input;

    // Phase 1: Check idempotency
    const existingTx = mockTransactions.get(transactionData.paymentExternalId);
    if (existingTx && existingTx.status === 'processed') {
        console.log('[mockProcessPurchase] Transaction already processed:', transactionData.paymentExternalId);

        // Build response from existing data
        const enrollments = Array.from(mockUserEnrollments.get(userId) || []).map((courseId) => ({
            courseId,
            coachingIncluded: false, // Would need to track this
        }));

        const coachingSessions = Array.from(mockCoachingCredits.get(userId) || new Map()).map(([offeringId], idx) => ({
            offeringId: offeringId,
            sessionId: idx + 1, // Mock session ID
            courseId: null, // Not tracking course linkage in mock
        }));

        return {
            success: true,
            data: {
                success: true,
                alreadyProcessed: true,
                transactionId: existingTx.id,
                enrollments,
                coachingSessions,
            },
        };
    }

    // Phase 2: Create transaction
    const transaction: MockTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentExternalId: transactionData.paymentExternalId,
        paymentProvider: transactionData.paymentProvider,
        userId,
        purchaseType,
        amount: transactionData.amount,
        currency: transactionData.currency,
        status: 'paid',
        customerEmail: transactionData.customerEmail,
        processedAt: Date.now(),
    };

    mockTransactions.set(transactionData.paymentExternalId, transaction);

    // Phase 3: Process purchase items
    const enrollments: Array<{ courseId: number; coachingIncluded: boolean }> = [];
    const coachingSessions: Array<{ offeringId: number | null; sessionId: number; courseId: number | null }> = [];

    let sessionIdCounter = 1;

    for (const item of purchaseItems) {
        if (item.type === 'course') {
            // Enroll in course
            const course = mockCourses.find(c => c.slug === item.courseSlug);
            if (!course) {
                throw new Error(`Course not found: ${item.courseSlug}`);
            }

            const userEnrollments = mockUserEnrollments.get(userId) || new Set<number>();
            userEnrollments.add(course.id);
            mockUserEnrollments.set(userId, userEnrollments);

            enrollments.push({
                courseId: course.id,
                coachingIncluded: item.withCoaching,
            });

            console.log(`[mockProcessPurchase] Enrolled user ${userId} in course ${course.id}`);

            // Add coaching if included
            if (item.withCoaching) {
                const courseOfferings = mockCourseCoachingOfferings.get(course.id) || [];
                for (const { offeringId, defaultQuantity } of courseOfferings) {
                    const userCredits = mockCoachingCredits.get(userId) || new Map<number, number>();
                    const currentCount = userCredits.get(offeringId) || 0;
                    userCredits.set(offeringId, currentCount + defaultQuantity);
                    mockCoachingCredits.set(userId, userCredits);

                    // Create individual session records
                    for (let i = 0; i < defaultQuantity; i++) {
                        coachingSessions.push({
                            offeringId: offeringId,
                            sessionId: sessionIdCounter++,
                            courseId: course.id,
                        });
                    }

                    console.log(`[mockProcessPurchase] Added ${defaultQuantity} coaching sessions (offering ${offeringId}) for user ${userId}`);
                }
            }
        } else if (item.type === 'package') {
            // Enroll in selected courses from package
            const pkg = mockPackages.find(p => p.id === item.packageId);
            if (!pkg) {
                throw new Error(`Package not found: ${item.packageId}`);
            }

            const courseIdsToEnroll = item.selectedCourseIds && item.selectedCourseIds.length > 0
                ? item.selectedCourseIds
                : pkg.courseIds;

            for (const courseId of courseIdsToEnroll) {
                const userEnrollments = mockUserEnrollments.get(userId) || new Set<number>();
                userEnrollments.add(courseId);
                mockUserEnrollments.set(userId, userEnrollments);

                enrollments.push({
                    courseId,
                    coachingIncluded: item.withCoaching,
                });

                console.log(`[mockProcessPurchase] Enrolled user ${userId} in course ${courseId} (from package)`);

                // Add coaching if included
                if (item.withCoaching) {
                    const courseOfferings = mockCourseCoachingOfferings.get(courseId) || [];
                    for (const { offeringId, defaultQuantity } of courseOfferings) {
                        const userCredits = mockCoachingCredits.get(userId) || new Map<number, number>();
                        const currentCount = userCredits.get(offeringId) || 0;
                        userCredits.set(offeringId, currentCount + defaultQuantity);
                        mockCoachingCredits.set(userId, userCredits);

                        // Create individual session records
                        for (let i = 0; i < defaultQuantity; i++) {
                            coachingSessions.push({
                                offeringId: offeringId,
                                sessionId: sessionIdCounter++,
                                courseId: courseId,
                            });
                        }

                        console.log(`[mockProcessPurchase] Added ${defaultQuantity} coaching sessions (offering ${offeringId}) for user ${userId}`);
                    }
                }
            }
        } else if (item.type === 'coaching_sessions') {
            // Add standalone coaching sessions
            for (const offering of item.offerings) {
                const userCredits = mockCoachingCredits.get(userId) || new Map<number, number>();
                const currentCount = userCredits.get(offering.coachingOfferingId) || 0;
                userCredits.set(offering.coachingOfferingId, currentCount + offering.quantity);
                mockCoachingCredits.set(userId, userCredits);

                // Create individual session records
                for (let i = 0; i < offering.quantity; i++) {
                    coachingSessions.push({
                        offeringId: offering.coachingOfferingId,
                        sessionId: sessionIdCounter++,
                        courseId: null, // Standalone sessions not linked to a course
                    });
                }

                console.log(`[mockProcessPurchase] Added ${offering.quantity} coaching sessions (offering ${offering.coachingOfferingId}) for user ${userId}`);
            }
        } else if (item.type === 'course_coaching_sessions') {
            // Course-specific coaching sessions for lesson components
            const course = mockCourses.find(c => c.slug === item.courseSlug);
            if (!course) {
                throw new Error(`Course not found: ${item.courseSlug}`);
            }

            // Mock: Create a coaching session for each lesson component
            for (const _componentId of item.lessonComponentIds) {
                coachingSessions.push({
                    offeringId: null, // Component-based coaching doesn't use offerings
                    sessionId: sessionIdCounter++,
                    courseId: course.id,
                });
            }

            console.log(`[mockProcessPurchase] Added ${item.lessonComponentIds.length} component coaching sessions for course ${item.courseSlug}`);
        }
    }

    // Phase 4: Update transaction status
    transaction.status = 'processed';

    // Phase 5: Return success
    return {
        success: true,
        data: {
            success: true,
            alreadyProcessed: false,
            transactionId: transaction.id,
            enrollments,
            coachingSessions,
        },
    };
}

// ============================================================================
// Mock Backend tRPC Client
// ============================================================================

/**
 * Mock backend tRPC client
 *
 * TO REPLACE WITH REAL CLIENT:
 *
 * import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
 * import type { AppRouter } from 'cms-fastapi-generated-types';
 *
 * export const backendTrpc = createTRPCProxyClient<AppRouter>({
 *   links: [
 *     httpBatchLink({
 *       url: process.env.CMS_FASTAPI_URL + '/trpc',
 *       headers: async () => {
 *         const session = await getServerSession();
 *         return {
 *           authorization: session?.accessToken ? `Bearer ${session.accessToken}` : '',
 *         };
 *       },
 *     }),
 *   ],
 * });
 */
export const backendTrpc = {
    processPurchase: {
        mutate: async (input: useCaseModels.TProcessPurchaseRequest): Promise<useCaseModels.TProcessPurchaseSuccessResponse> => {
            // Validate input
            const validatedInput = useCaseModels.ProcessPurchaseRequestSchema.parse(input);

            // Call mock implementation
            return mockProcessPurchase(validatedInput);
        },
    },
};

// Export for testing/debugging
export const __mockStorage = {
    transactions: mockTransactions,
    enrollments: mockUserEnrollments,
    coachingCredits: mockCoachingCredits,
};
