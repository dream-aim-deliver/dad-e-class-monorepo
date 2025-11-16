import { z } from 'zod';
import { t } from '../trpc-setup';
import { TRPCError } from '@trpc/server';

/**
 * Mock storage for transactions, enrollments, and coaching credits
 * In production, this would be replaced with actual database queries
 */

export interface MockTransaction {
    id: string;
    sessionId: string;
    userId: string;
    purchaseType: string;
    items: Array<{
        name: string;
        description: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    amount: number;
    currency: string;
    status: 'pending' | 'complete' | 'failed';
    metadata: Record<string, any>;
    processedAt: number;
    customerEmail: string;
}

// Module-level storage (persists during app runtime)
const mockTransactions = new Map<string, MockTransaction>();
const mockUserEnrollments = new Map<string, Set<number>>(); // userId -> Set of courseIds
const mockCoachingCredits = new Map<string, number>(); // userId -> number of credits

// Mock course data (should match prepare-checkout.ts)
const mockCourses = [
    { id: 1, slug: 'intro-to-programming', title: 'Introduction to Programming' },
    { id: 2, slug: 'advanced-javascript', title: 'Advanced JavaScript' },
];

// Mock package data
const mockPackages = [
    { id: 1, title: 'Web Development Bundle', courseIds: [1, 2] },
];

/**
 * Verify payment with Stripe and unlock purchase
 */
export const verifyAndUnlockPurchase = t.procedure
    .input(
        z.object({
            sessionId: z.string(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        const { sessionId } = input;

        // Step 1: Check if already processed (idempotency)
        if (mockTransactions.has(sessionId)) {
            const existing = mockTransactions.get(sessionId)!;
            console.log('[verifyAndUnlockPurchase] Session already processed:', sessionId);

            return {
                success: true,
                alreadyProcessed: true,
                transaction: existing,
                purchaseType: existing.purchaseType,
                purchaseIdentifier: existing.metadata,
                purchasedItems: existing.items,
                customerEmail: existing.customerEmail,
            };
        }

        // Step 2: Verify payment with Stripe API
        console.log('[verifyAndUnlockPurchase] Verifying session with Stripe:', sessionId);

        let stripeSession: any;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/checkout/session-status?session_id=${sessionId}`,
            );

            if (!response.ok) {
                throw new Error(`Stripe API returned ${response.status}`);
            }

            stripeSession = await response.json();
        } catch (error) {
            console.error('[verifyAndUnlockPurchase] Failed to fetch Stripe session:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to verify payment with Stripe',
            });
        }

        // Step 3: Validate payment status
        if (stripeSession.payment_status !== 'paid') {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Payment not completed. Status: ${stripeSession.payment_status}`,
            });
        }

        // Step 4: Extract and validate metadata
        const metadata = stripeSession.metadata || {};
        const purchaseType = metadata.purchaseType;

        if (!purchaseType) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Invalid session metadata: missing purchase type',
            });
        }

        // Step 5: Get user ID (mock for now - in production would come from ctx.session)
        const userId = 'mock-user-id';

        // Step 6: Create transaction record
        const transaction: MockTransaction = {
            id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sessionId,
            userId,
            purchaseType,
            items: [], // Would be reconstructed from metadata
            amount: stripeSession.amount_total || 0,
            currency: stripeSession.currency || 'chf',
            status: 'complete',
            metadata,
            processedAt: Date.now(),
            customerEmail: stripeSession.customer_email || '',
        };

        mockTransactions.set(sessionId, transaction);
        console.log('[verifyAndUnlockPurchase] Transaction recorded:', transaction.id);

        // Step 7: Unlock purchase based on type
        const enrollments = mockUserEnrollments.get(userId) || new Set<number>();
        let purchaseIdentifier: any = {};
        const withCoaching = metadata.withCoaching === 'true';

        switch (purchaseType) {
            case 'StudentCoursePurchase':
            case 'StudentCoursePurchaseWithCoaching': {
                const courseSlug = metadata.courseSlug;
                const course = mockCourses.find((c) => c.slug === courseSlug);

                if (course) {
                    enrollments.add(course.id);
                    purchaseIdentifier = { courseSlug };
                    console.log(`[verifyAndUnlockPurchase] Enrolled user ${userId} in course ${course.id}`);

                    // Add coaching credits if withCoaching
                    if (withCoaching) {
                        const credits = mockCoachingCredits.get(userId) || 0;
                        mockCoachingCredits.set(userId, credits + 5); // Mock: 5 sessions per course
                        console.log(`[verifyAndUnlockPurchase] Added 5 coaching credits to user ${userId}`);
                    }
                } else {
                    console.warn(`[verifyAndUnlockPurchase] Course not found: ${courseSlug}`);
                }
                break;
            }

            case 'StudentPackagePurchase':
            case 'StudentPackagePurchaseWithCoaching': {
                const packageId = parseInt(metadata.packageId);
                const pkg = mockPackages.find((p) => p.id === packageId);

                if (pkg) {
                    // Enroll in specific courses if courseIds provided, otherwise all package courses
                    const courseIdsToEnroll = metadata.courseIds
                        ? metadata.courseIds.split(',').map((id: string) => parseInt(id))
                        : pkg.courseIds;

                    courseIdsToEnroll.forEach((id: number) => {
                        enrollments.add(id);
                        console.log(`[verifyAndUnlockPurchase] Enrolled user ${userId} in course ${id} (from package)`);
                    });

                    purchaseIdentifier = { packageId };

                    // Add coaching credits if withCoaching
                    if (withCoaching) {
                        const credits = mockCoachingCredits.get(userId) || 0;
                        const sessionsToAdd = courseIdsToEnroll.length * 5; // 5 sessions per course
                        mockCoachingCredits.set(userId, credits + sessionsToAdd);
                        console.log(`[verifyAndUnlockPurchase] Added ${sessionsToAdd} coaching credits to user ${userId}`);
                    }
                } else {
                    console.warn(`[verifyAndUnlockPurchase] Package not found: ${packageId}`);
                }
                break;
            }

            case 'StudentCoachingSessionPurchase': {
                const quantity = parseInt(metadata.quantity || '1');
                const credits = mockCoachingCredits.get(userId) || 0;
                mockCoachingCredits.set(userId, credits + quantity);
                purchaseIdentifier = {
                    offeringId: parseInt(metadata.coachingOfferingId || '0')
                };
                console.log(`[verifyAndUnlockPurchase] Added ${quantity} coaching credits to user ${userId}`);
                break;
            }

            default:
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: `Unknown purchase type: ${purchaseType}`,
                });
        }

        // Save updated enrollments
        mockUserEnrollments.set(userId, enrollments);

        // Step 8: Return success response
        console.log('[verifyAndUnlockPurchase] Purchase unlocked successfully');

        return {
            success: true,
            alreadyProcessed: false,
            transaction,
            purchaseType,
            purchaseIdentifier,
            purchasedItems: transaction.items,
            customerEmail: transaction.customerEmail,
        };
    });

/**
 * Helper to check if user has access to a course (for integration with getCourseAccess)
 */
export function hasUserEnrollment(userId: string, courseId: number): boolean {
    const enrollments = mockUserEnrollments.get(userId);
    return enrollments ? enrollments.has(courseId) : false;
}

/**
 * Helper to get user's coaching credits
 */
export function getUserCoachingCredits(userId: string): number {
    return mockCoachingCredits.get(userId) || 0;
}

/**
 * Export storage for debugging/testing
 */
export const __mockStorage = {
    transactions: mockTransactions,
    enrollments: mockUserEnrollments,
    coachingCredits: mockCoachingCredits,
};
