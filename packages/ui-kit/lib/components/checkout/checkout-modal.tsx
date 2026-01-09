'use client';

import React, { useState, useMemo } from 'react';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogBody } from '../dialog';
import { Button } from '../button';
import { InputField } from '../input-field';
import { IconPayments, IconClose, IconCheck } from '../icons';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface TransactionDraft {
    lineItems: Array<{
        name: string;
        description: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    currency: string;
    couponCode?: string | null;
    finalPrice: number;
    originalPrice?: number; // Price before coupon discount (for Stripe)
}

/**
 * Result type for coupon validation callback.
 * Parent components translate error types to user-friendly messages using useCheckoutErrors.
 */
export type CouponValidationResult = {
    success: true;
    data: TransactionDraft;
} | {
    success: false;
    errorMessage: string;  // Already translated by parent component
};

export interface CheckoutModalProps extends isLocalAware {
    isOpen: boolean;
    onClose: () => void;
    transactionDraft: TransactionDraft;
    onPaymentComplete?: (sessionId: string) => void;
    stripePublishableKey: string;
    customerEmail?: string;
    purchaseType: string;
    purchaseIdentifier: {
        courseSlug?: string;
        packageId?: number;
        courseIds?: number[]; // For packages - which courses were selected
        coachingOfferingId?: number;
        quantity?: number;
        withCoaching?: boolean; // For courses and packages - was coaching included
        lessonComponentIds?: string[]; // For StudentCourseCoachingSessionPurchase
        coachUsername?: string; // For coaching session purchase - redirect back to coach's calendar
    };
    /**
     * Optional callback to validate coupon with backend.
     * Returns updated transaction draft with discounted line items on success.
     * Returns error object with errorType on failure.
     */
    onApplyCoupon?: (couponCode: string) => Promise<CouponValidationResult>;
}

type ModalState = 'summary' | 'payment';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    transactionDraft,
    onPaymentComplete,
    stripePublishableKey,
    customerEmail,
    purchaseType,
    purchaseIdentifier,
    locale,
    onApplyCoupon,
}) => {
    const dictionary = getDictionary(locale);
    const [modalState, setModalState] = useState<ModalState>('summary');
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(
        transactionDraft.couponCode || null,
    );
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [showCouponSuccess, setShowCouponSuccess] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [hasBlurred, setHasBlurred] = useState(false);
    // Track current transaction draft (updated when coupon is applied)
    const [currentTransactionDraft, setCurrentTransactionDraft] = useState<TransactionDraft>(transactionDraft);

    const stripePromise = useMemo(
        () => loadStripe(stripePublishableKey),
        [stripePublishableKey],
    );

    // Extract discount percentage from coupon code (e.g., "XXX10" -> 10)
    // Used as fallback when onApplyCoupon callback is not provided
    const extractDiscountFromCoupon = (coupon: string): number => {
        const match = coupon.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };


    // Calculate discount amount (only used for fallback mock implementation)
    const discountAmount = useMemo(() => {
        if (!appliedCoupon || discountPercentage === 0) return 0;
        const subtotalValue = currentTransactionDraft.lineItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0,
        );
        return Math.round((subtotalValue * discountPercentage) / 100);
    }, [appliedCoupon, discountPercentage, currentTransactionDraft.lineItems]);

    // Calculate totals
    const subtotal = useMemo(() => {
        return currentTransactionDraft.lineItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0,
        );
    }, [currentTransactionDraft.lineItems]);

    // When using onApplyCoupon, the finalPrice from backend already includes discount
    // When using fallback mock, calculate manually
    const total = useMemo(() => {
        if (onApplyCoupon && appliedCoupon) {
            // Backend returned discounted finalPrice
            return currentTransactionDraft.finalPrice;
        }
        // Fallback: manual calculation
        return subtotal - discountAmount;
    }, [subtotal, discountAmount, onApplyCoupon, appliedCoupon, currentTransactionDraft.finalPrice]);

    // Validate coupon format on blur
    const validateCouponFormat = (coupon: string): boolean => {
        if (!coupon.trim()) return false;
        // Must contain at least one number
        return /\d/.test(coupon);
    };

    const handleCouponBlur = () => {
        setHasBlurred(true);
        if (couponInput && !validateCouponFormat(couponInput)) {
            setCouponError(dictionary.components.checkoutModal.invalidCoupon);
        } else {
            setCouponError(null);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;

        // Only validate format when using fallback (no onApplyCoupon callback)
        if (!onApplyCoupon && !validateCouponFormat(couponInput)) {
            setCouponError(dictionary.components.checkoutModal.invalidCoupon);
            return;
        }

        setIsValidatingCoupon(true);
        setCouponError(null);

        try {
            // If callback provided, use real backend validation
            if (onApplyCoupon) {
                const result = await onApplyCoupon(couponInput);

                if (result.success) {
                    // Update transaction draft with new discounted line items
                    // Preserve the original price (before discount) for Stripe
                    const updatedDraft = {
                        ...result.data,
                        originalPrice: transactionDraft.finalPrice, // Original price before coupon
                    };
                    setCurrentTransactionDraft(updatedDraft);
                    setAppliedCoupon(couponInput);
                    setShowCouponSuccess(true);
                    setCouponInput('');
                    setHasBlurred(false);

                    // Hide success message after 3 seconds
                    setTimeout(() => setShowCouponSuccess(false), 3000);
                } else {
                    // Parent already translated the error using centralized error handling
                    setCouponError(result.errorMessage);
                }
            } else {
                // Fallback: extract discount percentage from coupon code
                const percentage = extractDiscountFromCoupon(couponInput);

                if (percentage === 0) {
                    throw new Error('Invalid coupon');
                }

                setAppliedCoupon(couponInput);
                setDiscountPercentage(percentage);
                setShowCouponSuccess(true);
                setCouponInput('');
                setHasBlurred(false);

                // Hide success message after 3 seconds
                setTimeout(() => setShowCouponSuccess(false), 3000);
            }
        } catch (error) {
            setCouponError(dictionary.components.checkoutModal.couponError);
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCurrentTransactionDraft(transactionDraft); // Reset to original
        setAppliedCoupon(null);
        setDiscountPercentage(0);
        setShowCouponSuccess(false);
        setCouponError(null);
    };

    const handleProceedToPayment = async () => {
        setIsLoadingPayment(true);

        try {
            // Build query parameters
            const params = new URLSearchParams();
            // Pass the ORIGINAL price (before discount) to Stripe
            // Stripe will apply the coupon discount, so we must NOT send the already-discounted price
            const priceToSend = currentTransactionDraft.originalPrice ?? currentTransactionDraft.finalPrice;
            params.append('amount', (priceToSend * 100).toString());
            if (appliedCoupon) {
                params.append('coupon', appliedCoupon);
            }
            if (customerEmail) {
                params.append('email', customerEmail);
            }

            // Add purchase metadata
            params.append('purchaseType', purchaseType);
            if (purchaseIdentifier.courseSlug) {
                params.append('courseSlug', purchaseIdentifier.courseSlug);
            }
            if (purchaseIdentifier.packageId) {
                params.append('packageId', purchaseIdentifier.packageId.toString());
            }
            if (purchaseIdentifier.courseIds && purchaseIdentifier.courseIds.length > 0) {
                params.append('courseIds', purchaseIdentifier.courseIds.join(','));
            }
            if (purchaseIdentifier.coachingOfferingId) {
                params.append('coachingOfferingId', purchaseIdentifier.coachingOfferingId.toString());
            }
            if (purchaseIdentifier.quantity) {
                params.append('quantity', purchaseIdentifier.quantity.toString());
            }
            // Handle multiple offerings (format: "1:3,2:2")
            if ((purchaseIdentifier as any).offerings) {
                params.append('offerings', (purchaseIdentifier as any).offerings);
            }
            if (purchaseIdentifier.withCoaching !== undefined) {
                params.append('withCoaching', purchaseIdentifier.withCoaching.toString());
            }
            if (purchaseIdentifier.lessonComponentIds && purchaseIdentifier.lessonComponentIds.length > 0) {
                params.append('lessonComponentIds', purchaseIdentifier.lessonComponentIds.join(','));
            }
            if (purchaseIdentifier.coachUsername) {
                params.append('coachUsername', purchaseIdentifier.coachUsername);
            }

            const url = params.toString()
                ? `/api/checkout/get-checkout-url?${params.toString()}`
                : '/api/checkout/get-checkout-url';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const data = await response.json();

            if (!data.clientSecret) {
                throw new Error('No client secret returned');
            }

            setClientSecret(data.clientSecret);
            setModalState('payment');
        } catch (error) {
            console.error('Error creating checkout session:', error);
            setCouponError('Failed to proceed to payment. Please try again.');
        } finally {
            setIsLoadingPayment(false);
        }
    };

    const handleBack = () => {
        setModalState('summary');
        setClientSecret(null);
    };

    const handleCloseModal = () => {
        if (!isLoadingPayment) {
            setModalState('summary');
            setClientSecret(null);
            onClose();
        }
    };

    const formatPrice = (amount: number) => {
        return `${amount.toFixed(2)} ${currentTransactionDraft.currency}`;
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={handleCloseModal}
            defaultOpen={false}
        >
            <DialogContent
                showCloseButton={modalState === 'summary'}
                closeOnOverlayClick={
                    !isLoadingPayment && modalState === 'summary'
                }
                closeOnEscape={!isLoadingPayment}
                className={modalState === 'summary' ? 'max-w-2xl' : 'max-w-4xl'}
            >
                <DialogBody>
                    {modalState === 'summary' ? (
                        <div className="flex flex-col gap-4 p-6">
                            {/* Header */}
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-base-neutral-700 rounded-small">
                                    <IconPayments
                                        size="5"
                                        classNames="text-text-primary"
                                    />
                                </span>
                                <h2 className="text-2xl font-semibold text-text-primary">
                                    {dictionary.components.checkoutModal.title}
                                </h2>
                            </div>

                            <div className="w-full h-[1px] bg-divider" />

                            {/* Line Items */}
                            <div className="flex flex-col gap-3">
                                <h3 className="text-sm font-semibold text-text-secondary uppercase">
                                    {
                                        dictionary.components.checkoutModal
                                            .lineItems
                                    }
                                </h3>
                                {currentTransactionDraft.lineItems.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-start p-3 border border-card-stroke rounded-md hover:bg-card-fill transition-colors"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="text-text-primary font-medium">
                                                    {item.name}
                                                </span>
                                                {item.description && (
                                                    <span className="text-text-secondary text-sm">
                                                        {item.description}
                                                    </span>
                                                )}
                                                <span className="text-text-secondary text-xs">
                                                    {item.quantity} ×{' '}
                                                    {formatPrice(
                                                        item.unitPrice,
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-text-primary font-semibold">
                                                {formatPrice(item.totalPrice)}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Subtotal */}
                            <div className="flex justify-between items-center p-2">
                                <span className="text-text-secondary">
                                    {
                                        dictionary.components.checkoutModal
                                            .subtotal
                                    }
                                </span>
                                <span className="text-text-primary font-semibold">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <div className="w-full h-[1px] bg-divider" />

                            {/* Coupon Section */}
                            <div className="flex flex-col gap-3">
                                {!appliedCoupon ? (
                                    <>
                                        <div onBlur={handleCouponBlur}>
                                            <InputField
                                                inputText={
                                                    dictionary.components
                                                        .checkoutModal
                                                        .enterCoupon
                                                }
                                                value={couponInput}
                                                setValue={(value) => {
                                                    setCouponInput(value);
                                                    // Clear error when user starts typing
                                                    if (
                                                        hasBlurred &&
                                                        couponError
                                                    ) {
                                                        setHasBlurred(false);
                                                        setCouponError(null);
                                                    }
                                                }}
                                                state={
                                                    hasBlurred && couponError
                                                        ? 'error'
                                                        : couponInput
                                                          ? 'filling'
                                                          : 'placeholder'
                                                }
                                                type="text"
                                            />
                                        </div>
                                        {hasBlurred && couponError && (
                                            <p className="text-red-600 text-sm -mt-2">
                                                {couponError}
                                            </p>
                                        )}
                                        <Button
                                            variant="secondary"
                                            size="medium"
                                            text={
                                                dictionary.components
                                                    .checkoutModal.applyCoupon
                                            }
                                            onClick={handleApplyCoupon}
                                            disabled={
                                                !couponInput ||
                                                isValidatingCoupon
                                            }
                                            className="w-full"
                                        />
                                    </>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <IconCheck
                                                size="4"
                                                classNames="text-green-600"
                                            />
                                            <span className="text-green-800 font-medium">
                                                {appliedCoupon}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="p-1 hover:bg-green-100 rounded-small transition-colors"
                                            aria-label={
                                                dictionary.components
                                                    .checkoutModal.removeCoupon
                                            }
                                        >
                                            <IconClose
                                                size="4"
                                                classNames="text-green-600"
                                            />
                                        </button>
                                    </div>
                                )}

                                {showCouponSuccess && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                        <p className="text-green-800 text-sm">
                                            {dictionary.components.checkoutModal.couponApplied.replace(
                                                '{code}',
                                                appliedCoupon || '',
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Discount Display */}
                            {appliedCoupon && (onApplyCoupon ? (subtotal - currentTransactionDraft.finalPrice) > 0 : discountAmount > 0) && (
                                <>
                                    <div className="flex justify-between items-center p-2">
                                        <span className="text-green-600 font-medium">
                                            {
                                                dictionary.components
                                                    .checkoutModal.discount
                                            }
                                            {!onApplyCoupon && ` (${discountPercentage}%)`}
                                        </span>
                                        <span className="text-green-600 font-semibold">
                                            -{formatPrice(onApplyCoupon ? (subtotal - currentTransactionDraft.finalPrice) : discountAmount)}
                                        </span>
                                    </div>
                                    <div className="w-full h-[1px] bg-divider" />
                                </>
                            )}

                            {/* Total */}
                            <div className="flex justify-between items-center p-4 bg-card-stroke rounded-md">
                                <span className="text-text-primary text-lg font-bold">
                                    {dictionary.components.checkoutModal.total}
                                </span>
                                <span className="text-text-primary text-lg font-bold">
                                    {formatPrice(total)}
                                </span>
                            </div>

                            {/* Proceed Button */}
                            <Button
                                variant="primary"
                                size="big"
                                text={
                                    dictionary.components.checkoutModal
                                        .proceedToPayment
                                }
                                onClick={handleProceedToPayment}
                                disabled={isLoadingPayment}
                                className="w-full mt-2"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 p-6">
                            {/* Back Button */}
                            <Button
                                variant="text"
                                size="small"
                                text="← Back to Summary"
                                onClick={handleBack}
                                className="self-start"
                            />

                            {/* Stripe Embedded Checkout */}
                            {clientSecret && (
                                <EmbeddedCheckoutProvider
                                    stripe={stripePromise}
                                    options={{ clientSecret }}
                                >
                                    <EmbeddedCheckout />
                                </EmbeddedCheckoutProvider>
                            )}

                            {!clientSecret && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};
