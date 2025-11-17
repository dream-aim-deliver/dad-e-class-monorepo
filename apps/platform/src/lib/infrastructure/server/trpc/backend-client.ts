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

import { z } from 'zod';

// ============================================================================
// Type Definitions (matching cms-fastapi schemas)
// ============================================================================

const CoachingOfferingSchema = z.object({
    coachingOfferingId: z.number(),
    quantity: z.number(),
});

const PurchaseItemSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('course'),
        courseSlug: z.string(),
        withCoaching: z.boolean(),
    }),
    z.object({
        type: z.literal('package'),
        packageId: z.number(),
        selectedCourseIds: z.array(z.number()),
        withCoaching: z.boolean(),
    }),
    z.object({
        type: z.literal('coaching_sessions'),
        offerings: z.array(CoachingOfferingSchema),
    }),
]);

const TransactionDataSchema = z.object({
    stripeSessionId: z.string(),
    amount: z.number(),
    currency: z.string(),
    customerEmail: z.string(),
    paymentStatus: z.string(),
    metadata: z.record(z.any()),
});

const ProcessPurchaseRequestSchema = z.object({
    userId: z.string(),
    transactionData: TransactionDataSchema,
    purchaseType: z.string(),
    purchaseItems: z.array(PurchaseItemSchema),
});

const EnrollmentResultSchema = z.object({
    courseId: z.number(),
    enrollmentId: z.string(),
    coachingIncluded: z.boolean(),
});

const CoachingSessionResultSchema = z.object({
    offeringId: z.number(),
    quantity: z.number(),
    totalAvailable: z.number(),
});

const ProcessPurchaseSuccessSchema = z.object({
    success: z.literal(true),
    alreadyProcessed: z.boolean(),
    transactionId: z.string(),
    enrollments: z.array(EnrollmentResultSchema),
    coachingSessions: z.array(CoachingSessionResultSchema),
});

type ProcessPurchaseRequest = z.infer<typeof ProcessPurchaseRequestSchema>;
type ProcessPurchaseSuccess = z.infer<typeof ProcessPurchaseSuccessSchema>;

// ============================================================================
// Mock Storage (temporary - will be replaced by cms-fastapi database)
// ============================================================================

interface MockTransaction {
    id: string;
    stripeSessionId: string;
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
async function mockProcessPurchase(input: ProcessPurchaseRequest): Promise<ProcessPurchaseSuccess> {
    const { userId, transactionData, purchaseType, purchaseItems } = input;

    // Phase 1: Check idempotency
    const existingTx = mockTransactions.get(transactionData.stripeSessionId);
    if (existingTx && existingTx.status === 'processed') {
        console.log('[mockProcessPurchase] Transaction already processed:', transactionData.stripeSessionId);

        // Build response from existing data
        const enrollments = Array.from(mockUserEnrollments.get(userId) || []).map(courseId => ({
            courseId,
            enrollmentId: `enroll-${userId}-${courseId}`,
            coachingIncluded: false, // Would need to track this
        }));

        const coachingSessions = Array.from(mockCoachingCredits.get(userId) || new Map()).map(([offeringId, count]) => ({
            offeringId,
            quantity: 0, // Can't determine what was added in this specific transaction
            totalAvailable: count,
        }));

        return {
            success: true,
            alreadyProcessed: true,
            transactionId: existingTx.id,
            enrollments,
            coachingSessions,
        };
    }

    // Phase 2: Create transaction
    const transaction: MockTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        stripeSessionId: transactionData.stripeSessionId,
        userId,
        purchaseType,
        amount: transactionData.amount,
        currency: transactionData.currency,
        status: 'paid',
        customerEmail: transactionData.customerEmail,
        processedAt: Date.now(),
    };

    mockTransactions.set(transactionData.stripeSessionId, transaction);

    // Phase 3: Process purchase items
    const enrollments: Array<{ courseId: number; enrollmentId: string; coachingIncluded: boolean }> = [];
    const coachingSessions: Array<{ offeringId: number; quantity: number; totalAvailable: number }> = [];

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
                enrollmentId: `enroll-${userId}-${course.id}`,
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

                    coachingSessions.push({
                        offeringId,
                        quantity: defaultQuantity,
                        totalAvailable: currentCount + defaultQuantity,
                    });

                    console.log(`[mockProcessPurchase] Added ${defaultQuantity} coaching sessions (offering ${offeringId}) for user ${userId}`);
                }
            }
        } else if (item.type === 'package') {
            // Enroll in selected courses from package
            const pkg = mockPackages.find(p => p.id === item.packageId);
            if (!pkg) {
                throw new Error(`Package not found: ${item.packageId}`);
            }

            const courseIdsToEnroll = item.selectedCourseIds.length > 0
                ? item.selectedCourseIds
                : pkg.courseIds;

            for (const courseId of courseIdsToEnroll) {
                const userEnrollments = mockUserEnrollments.get(userId) || new Set<number>();
                userEnrollments.add(courseId);
                mockUserEnrollments.set(userId, userEnrollments);

                enrollments.push({
                    courseId,
                    enrollmentId: `enroll-${userId}-${courseId}`,
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

                        coachingSessions.push({
                            offeringId,
                            quantity: defaultQuantity,
                            totalAvailable: currentCount + defaultQuantity,
                        });

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

                coachingSessions.push({
                    offeringId: offering.coachingOfferingId,
                    quantity: offering.quantity,
                    totalAvailable: currentCount + offering.quantity,
                });

                console.log(`[mockProcessPurchase] Added ${offering.quantity} coaching sessions (offering ${offering.coachingOfferingId}) for user ${userId}`);
            }
        }
    }

    // Phase 4: Update transaction status
    transaction.status = 'processed';

    // Phase 5: Return success
    return {
        success: true,
        alreadyProcessed: false,
        transactionId: transaction.id,
        enrollments,
        coachingSessions,
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
        mutate: async (input: ProcessPurchaseRequest): Promise<ProcessPurchaseSuccess> => {
            // Validate input
            const validatedInput = ProcessPurchaseRequestSchema.parse(input);

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
