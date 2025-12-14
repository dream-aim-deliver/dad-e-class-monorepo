import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

/**
 * Mock data and helpers for prepare checkout
 */

const VAT_RATE = 0.077; // Swiss VAT 7.7%

// Helper to calculate VAT
function calculateVAT(amount: number): number {
    return Math.round(amount * VAT_RATE);
}

// Helper to apply coupon discount
function applyCouponDiscount(
    amount: number,
    couponCode: string | null | undefined,
): number {
    if (!couponCode) return 0;

    // Extract percentage from coupon code (e.g., "SAVE10" -> 10)
    const match = couponCode.match(/\d+/);
    if (!match) return 0;

    const percentage = parseInt(match[0], 10);
    if (percentage < 0 || percentage > 100) return 0;

    return Math.round((amount * percentage) / 100);
}

// Mock course data
const mockCourses = {
    'intro-to-programming': {
        id: 1,
        title: 'Introduction to Programming',
        basePrice: 10000, // CHF 100.00 in cents
        coachingPrice: 3000, // CHF 30.00 for coaching
    },
    'advanced-javascript': {
        id: 2,
        title: 'Advanced JavaScript',
        basePrice: 15000, // CHF 150.00
        coachingPrice: 5000, // CHF 50.00
    },
};

// Mock package data
const mockPackages = {
    1: {
        id: 1,
        title: 'Web Development Bundle',
        courses: [1, 2],
        basePrice: 22000, // CHF 220.00 (discounted from 250)
        coachingPrice: 7000, // CHF 70.00
    },
};

// Mock coaching offerings
const mockCoachingOfferings = {
    1: {
        id: 1,
        name: '30-Minute Coaching Session',
        duration: 30,
        price: 5000, // CHF 50.00
    },
    2: {
        id: 2,
        name: '60-Minute Coaching Session',
        duration: 60,
        price: 9000, // CHF 90.00
    },
};

// Helper to validate coupon and return error if invalid
function validateCoupon(
    couponCode: string | null | undefined,
): useCaseModels.TPrepareCheckoutErrorResponse | null {
    if (!couponCode) return null;

    // Mock coupon validation
    if (couponCode === 'INVALID') {
        return {
            success: false,
            data: {
                errorType: 'NotFoundError',
                message: 'Coupon code not found',
                operation: 'validate_coupon',
                context: { couponCode },
            },
        };
    }

    if (couponCode === 'EXPIRED') {
        return {
            success: false,
            data: {
                errorType: 'ValidationError',
                message: 'Coupon has expired',
                operation: 'validate_coupon',
                context: { couponCode, expirationDate: '2024-01-01' },
            },
        };
    }

    if (couponCode === 'LIMIT') {
        return {
            success: false,
            data: {
                errorType: 'ValidationError',
                message: 'Coupon usage limit reached',
                operation: 'validate_coupon',
                context: { couponCode, limit: 100, used: 100 },
            },
        };
    }

    // Valid coupons: SAVE10, SAVE20, etc.
    if (!couponCode.match(/^SAVE\d+$/)) {
        return {
            success: false,
            data: {
                errorType: 'ValidationError',
                message: 'Invalid coupon format',
                operation: 'validate_coupon',
                context: { couponCode },
            },
        };
    }

    return null; // Coupon is valid
}

/**
 * tRPC mutation procedure for preparing checkout
 */
export const prepareCheckout = t.procedure
    .input(useCaseModels.PrepareCheckoutRequestSchema)
    .mutation(async (opts): Promise<useCaseModels.TPrepareCheckoutUseCaseResponse> => {
        const input = opts.input;
        const { type, couponCode } = input;

        // Validate coupon if provided
        const couponError = validateCoupon(couponCode);
        if (couponError) {
            return couponError;
        }

        const lineItems: useCaseModels.TInvoiceLineItem[] = [];
        let subtotal = 0;

        // Generate line items based on purchase type
        switch (type) {
            case 'StudentCoursePurchase': {
                const slug = input.courseSlug || 'intro-to-programming';
                const course =
                    mockCourses[slug as keyof typeof mockCourses] ||
                    mockCourses['intro-to-programming'];

                lineItems.push({
                    name: course.title,
                    description: 'Online course access',
                    unitPrice: course.basePrice,
                    quantity: 1,
                    totalPrice: course.basePrice,
                    currency: 'CHF',
                });

                subtotal = course.basePrice;
                break;
            }

            case 'StudentCoursePurchaseWithCoaching': {
                const slug = input.courseSlug || 'intro-to-programming';
                const course =
                    mockCourses[slug as keyof typeof mockCourses] ||
                    mockCourses['intro-to-programming'];

                lineItems.push({
                    name: course.title,
                    description: 'Online course access',
                    unitPrice: course.basePrice,
                    quantity: 1,
                    totalPrice: course.basePrice,
                    currency: 'CHF',
                });

                lineItems.push({
                    name: `${course.title} - Coaching Sessions`,
                    description: 'Personalized coaching sessions',
                    unitPrice: course.coachingPrice,
                    quantity: 1,
                    totalPrice: course.coachingPrice,
                    currency: 'CHF',
                });

                subtotal = course.basePrice + course.coachingPrice;
                break;
            }

            case 'StudentPackagePurchase': {
                const pkgId = input.packageId || 1;
                const pkg =
                    mockPackages[pkgId as keyof typeof mockPackages] ||
                    mockPackages[1];

                lineItems.push({
                    name: pkg.title,
                    description: `Package with ${pkg.courses.length} courses`,
                    unitPrice: pkg.basePrice,
                    quantity: 1,
                    totalPrice: pkg.basePrice,
                    currency: 'CHF',
                });

                subtotal = pkg.basePrice;
                break;
            }

            case 'StudentPackagePurchaseWithCoaching': {
                const pkgId = input.packageId || 1;
                const pkg =
                    mockPackages[pkgId as keyof typeof mockPackages] ||
                    mockPackages[1];

                lineItems.push({
                    name: pkg.title,
                    description: `Package with ${pkg.courses.length} courses`,
                    unitPrice: pkg.basePrice,
                    quantity: 1,
                    totalPrice: pkg.basePrice,
                    currency: 'CHF',
                });

                lineItems.push({
                    name: `${pkg.title} - Coaching Sessions`,
                    description: 'Coaching sessions for all courses',
                    unitPrice: pkg.coachingPrice,
                    quantity: 1,
                    totalPrice: pkg.coachingPrice,
                    currency: 'CHF',
                });

                subtotal = pkg.basePrice + pkg.coachingPrice;
                break;
            }

            case 'StudentCoachingSessionPurchase': {
                const offerId = input.coachingOfferingId || 1;
                const qty = input.quantity || 1;
                const offering =
                    mockCoachingOfferings[
                        offerId as keyof typeof mockCoachingOfferings
                    ] || mockCoachingOfferings[1];

                lineItems.push({
                    name: offering.name,
                    description: `${offering.duration}-minute coaching session`,
                    unitPrice: offering.price,
                    quantity: qty,
                    totalPrice: offering.price * qty,
                    currency: 'CHF',
                });

                subtotal = offering.price * qty;
                break;
            }

            case 'StudentCourseCoachingSessionPurchase': {
                const courseSlug = input.courseSlug;
                const componentIds = input.lessonComponentIds;
                // Mock pricing: 50 CHF per lesson component coaching
                const pricePerComponent = 5000;

                lineItems.push({
                    name: `Course Coaching - ${courseSlug}`,
                    description: `Coaching for ${componentIds.length} lesson component(s)`,
                    unitPrice: pricePerComponent,
                    quantity: componentIds.length,
                    totalPrice: pricePerComponent * componentIds.length,
                    currency: 'CHF',
                });

                subtotal = pricePerComponent * componentIds.length;
                break;
            }

            default:
                return {
                    success: false,
                    data: {
                        errorType: 'ValidationError',
                        message: 'Invalid purchase type',
                        operation: 'prepare_checkout',
                        context: { type },
                    },
                };
        }

        // Apply coupon discount
        let discount = 0;
        if (couponCode) {
            discount = applyCouponDiscount(subtotal, couponCode);
            if (discount > 0) {
                lineItems.push({
                    name: `Discount (${couponCode})`,
                    description: 'Coupon discount',
                    unitPrice: -discount,
                    quantity: 1,
                    totalPrice: -discount,
                    currency: 'CHF',
                });
            }
        }

        const subtotalAfterDiscount = subtotal - discount;

        // Add VAT
        const vat = calculateVAT(subtotalAfterDiscount);
        lineItems.push({
            name: 'VAT 7.7%',
            description: 'Swiss Value Added Tax',
            unitPrice: vat,
            quantity: 1,
            totalPrice: vat,
            currency: 'CHF',
        });

        const finalPrice = subtotalAfterDiscount + vat;

        // Return success response matching PrepareCheckoutSuccessDataSchema
        return {
            success: true,
            data: {
                lineItems: lineItems,
                currency: 'CHF',
                finalPrice: finalPrice,
                couponCode: couponCode,
            },
        };
    });
