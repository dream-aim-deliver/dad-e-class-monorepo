'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { checkoutSessionStorage } from '../../../../../lib/infrastructure/client/utils/checkout-session-storage';
import env from '../../../../../lib/infrastructure/client/config/env';
import {
    Button,
    IconSuccess,
    IconError,
    IconLoaderSpinner,
} from '@maany_shr/e-class-ui-kit';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../../../../lib/infrastructure/client/trpc/cms-client';

type PageState = 'loading' | 'success' | 'error';

export default function CheckoutReturnPage() {
    const router = useRouter();
    const locale = useLocale();
    const dictionary = getDictionary(locale as TLocale);
    const searchParams = useSearchParams();
    const sessionId = searchParams?.get('session_id');
    const utils = trpc.useUtils();

    const [state, setState] = useState<PageState>('loading');
    const [transaction, setTransaction] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [errorTimestamp, setErrorTimestamp] = useState<string>('');
    const [stripeDetails, setStripeDetails] = useState<{
        sessionId?: string;
        paymentIntentId?: string;
        customerEmail?: string;
        amount?: number;
        currency?: string;
        paymentStatus?: string;
        lineItems?: Array<{ description: string; quantity: number; amount: number }>;
        metadata?: Record<string, string>;
    } | null>(null);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!sessionId) {
            setState('error');
            setError('No session ID provided');
            return;
        }

        // Check if already processed
        if (checkoutSessionStorage.isSessionCompleted(sessionId)) {
            // Already processed - show simplified success
            setState('success');
            setTransaction({
                alreadyProcessed: true,
                customerEmail: '',
            });
            return;
        }

        // Process the payment
        processPayment(sessionId);
    }, [sessionId]);

    const processPayment = async (sessionId: string) => {
        try {
            // Call the verify-and-unlock API route
            const response = await fetch('/api/checkout/verify-and-unlock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Capture stripe details from error response if available
                if (errorData.stripeDetails) {
                    setStripeDetails(errorData.stripeDetails);
                }
                throw new Error(errorData.error || errorData.message || 'Payment verification failed');
            }

            const result = await response.json();

            if (result.success) {
                checkoutSessionStorage.saveCompletedSession(sessionId);
                setTransaction(result);
                setState('success');

                // Invalidate relevant queries to refresh data after purchase
                if (result.purchaseType === 'StudentCourseCoachingSessionPurchase' && result.purchaseIdentifier?.courseSlug) {
                    utils.listIncludedCoachingSessions.invalidate({ courseSlug: result.purchaseIdentifier.courseSlug });
                    utils.listCourseCoachingSessionPurchaseStatus.invalidate({ courseSlug: result.purchaseIdentifier.courseSlug });
                } else if (result.purchaseType === 'StudentCoursePurchase' || result.purchaseType === 'StudentCoursePurchaseWithCoaching') {
                    if (result.purchaseIdentifier?.courseSlug) {
                        utils.listIncludedCoachingSessions.invalidate({ courseSlug: result.purchaseIdentifier.courseSlug });
                        utils.getEnrolledCourseDetails.invalidate({ courseSlug: result.purchaseIdentifier.courseSlug });
                    }
                }

                // Start countdown for auto-redirect
                if (!result.alreadyProcessed) {
                    startCountdown(result);
                }
            } else {
                setState('error');
                setError('Payment verification failed');
            }
        } catch (err: any) {
            console.error('[CheckoutReturnPage] Error:', err);
            setState('error');
            setError(err.message || 'An error occurred processing your payment');
            setErrorTimestamp(new Date().toLocaleString());
        }
    };

    const startCountdown = (result: any) => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    redirectToDestination(result);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const redirectToDestination = (result: any) => {
        const path = getRedirectPath(
            result.purchaseType,
            result.purchaseIdentifier,
            locale,
        );
        router.push(path);
    };

    const getRedirectPath = (
        purchaseType: string,
        identifier: any,
        locale: string,
    ) => {
        switch (purchaseType) {
            case 'StudentCoursePurchase':
            case 'StudentCoursePurchaseWithCoaching':
                return `/${locale}/courses/${identifier.courseSlug}`;
            case 'StudentCourseCoachingSessionPurchase':
                // Redirect back to the enrolled course page
                return identifier.courseSlug 
                    ? `/${locale}/courses/${identifier.courseSlug}`
                    : `/${locale}/workspace/courses`;
            case 'StudentPackagePurchase':
            case 'StudentPackagePurchaseWithCoaching':
                return `/${locale}/workspace/courses`;
            case 'StudentCoachingSessionPurchase':
                return `/${locale}/workspace/coaching-sessions`;
            default:
                return `/${locale}/workspace/courses`;
        }
    };

    const getButtonText = (purchaseType: string, purchaseIdentifier?: any): string => {
        switch (purchaseType) {
            case 'StudentCoursePurchase':
            case 'StudentCoursePurchaseWithCoaching':
                return dictionary.pages.checkoutReturn.actions.goToCourse;
            case 'StudentPackagePurchase':
            case 'StudentPackagePurchaseWithCoaching':
                return dictionary.pages.checkoutReturn.actions.viewMyCourses;
            case 'StudentCoachingSessionPurchase':
                return dictionary.pages.checkoutReturn.actions.viewCoachingSessions;
            default:
                return dictionary.pages.checkoutReturn.actions.continue;
        }
    }

    if (state === 'loading') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <IconLoaderSpinner
                        size="8"
                        classNames="text-button-primary-fill animate-spin"
                    />
                    <p className="text-lg text-text-secondary">
                        {dictionary.pages.checkoutReturn.loading.processing}
                    </p>
                </div>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <div className="border border-card-stroke rounded-lg bg-card-fill shadow-md p-6">
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                                <IconError
                                    size="12"
                                    classNames="text-feedback-error-primary"
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-text-primary mb-2">
                                {dictionary.pages.checkoutReturn.error.title}
                            </h1>
                            <p className="text-text-secondary">{error}</p>
                        </div>

                        {/* Credit card warning banner */}
                        <div className="bg-feedback-warning-secondary border border-feedback-warning-primary p-4 rounded-medium mb-4">
                            <p className="text-sm text-feedback-warning-primary font-medium">
                                {dictionary.pages.checkoutReturn.error.checkCardWarning}
                            </p>
                        </div>

                        {/* Transaction details for support */}
                        <div className="bg-base-neutral-800 border border-card-stroke p-4 rounded-medium mb-4">
                            <p className="text-sm font-semibold text-text-primary mb-2">
                                {dictionary.pages.checkoutReturn.error.transactionDetails}
                            </p>
                            {(stripeDetails?.paymentIntentId || sessionId) && (
                                <p className="text-sm text-text-secondary mb-1 font-mono break-all">
                                    {stripeDetails?.paymentIntentId
                                        ? `${dictionary.pages.checkoutReturn.error.paymentIntentId} ${stripeDetails.paymentIntentId}`
                                        : `${dictionary.pages.checkoutReturn.error.sessionId} ${sessionId}`}
                                </p>
                            )}
                            {stripeDetails?.customerEmail && (
                                <p className="text-sm text-text-secondary mb-1">
                                    {dictionary.pages.checkoutReturn.error.customerEmail}{' '}
                                    {stripeDetails.customerEmail}
                                </p>
                            )}
                            {stripeDetails?.amount && stripeDetails?.currency && (
                                <p className="text-sm text-text-secondary mb-1">
                                    {dictionary.pages.checkoutReturn.error.amount}{' '}
                                    {(stripeDetails.amount / 100).toFixed(2)} {stripeDetails.currency}
                                </p>
                            )}
                            {stripeDetails?.lineItems && stripeDetails.lineItems.length > 0 && (
                                <div className="text-sm text-text-secondary mb-1">
                                    <span>{dictionary.pages.checkoutReturn.error.items}</span>
                                    <ul className="list-disc list-inside ml-2 mt-1">
                                        {stripeDetails.lineItems.map((item, index) => (
                                            <li key={index}>
                                                {item.description} (x{item.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {stripeDetails?.metadata && Object.keys(stripeDetails.metadata).length > 0 && (
                                <div className="text-sm text-text-secondary mb-1">
                                    <span>{dictionary.pages.checkoutReturn.error.purchaseInfo}</span>
                                    <ul className="list-none ml-2 mt-1 space-y-0.5">
                                        {stripeDetails.metadata.purchaseType && (
                                            <li>Type: {stripeDetails.metadata.purchaseType}</li>
                                        )}
                                        {stripeDetails.metadata.courseSlug && (
                                            <li>Course: {stripeDetails.metadata.courseSlug}</li>
                                        )}
                                        {stripeDetails.metadata.packageId && (
                                            <li>Package ID: {stripeDetails.metadata.packageId}</li>
                                        )}
                                        {stripeDetails.metadata.coachingOfferingId && (
                                            <li>Coaching Offering: {stripeDetails.metadata.coachingOfferingId}</li>
                                        )}
                                        {stripeDetails.metadata.couponCode && (
                                            <li>Coupon: {stripeDetails.metadata.couponCode}</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                            {errorTimestamp && (
                                <p className="text-sm text-text-secondary">
                                    {dictionary.pages.checkoutReturn.error.timestamp}{' '}
                                    {errorTimestamp}
                                </p>
                            )}
                        </div>

                        {/* Contact information with instructions */}
                        <div className="bg-base-neutral-800 border border-card-stroke p-4 rounded-medium mb-6">
                            <p className="text-sm font-semibold text-text-primary mb-2">
                                {dictionary.pages.checkoutReturn.error.needHelp}
                            </p>
                            {env.NEXT_PUBLIC_CONTACT_EMAIL && (
                                <p className="text-sm text-text-secondary mb-3">
                                    {dictionary.pages.checkoutReturn.error.email}{' '}
                                    <a
                                        href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                                        className="text-button-primary-fill hover:underline"
                                    >
                                        {env.NEXT_PUBLIC_CONTACT_EMAIL}
                                    </a>
                                </p>
                            )}
                            <p className="text-sm text-text-secondary mb-2">
                                {dictionary.pages.checkoutReturn.error.contactInstructions}
                            </p>
                            <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
                                <li>{dictionary.pages.checkoutReturn.error.includeEmail}</li>
                                <li>{dictionary.pages.checkoutReturn.error.includeDescription}</li>
                            </ul>
                            {env.NEXT_PUBLIC_CONTACT_PHONE && (
                                <p className="text-sm text-text-secondary mt-3">
                                    {dictionary.pages.checkoutReturn.error.phone}{' '}
                                    <a
                                        href={`tel:${env.NEXT_PUBLIC_CONTACT_PHONE}`}
                                        className="text-button-primary-fill hover:underline"
                                    >
                                        {env.NEXT_PUBLIC_CONTACT_PHONE}
                                    </a>
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                size="big"
                                text={dictionary.pages.checkoutReturn.error.tryAgain}
                                onClick={() => sessionId && processPayment(sessionId)}
                                className="w-full"
                            />
                            <Button
                                variant="secondary"
                                size="big"
                                text={dictionary.pages.checkoutReturn.error.backToDashboard}
                                onClick={() => router.push(`/${locale}`)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <div className="border border-card-stroke rounded-lg bg-card-fill shadow-md p-6">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <IconSuccess
                                size="12"
                                classNames="text-feedback-success-primary"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">
                            {dictionary.pages.checkoutReturn.success.title}
                        </h1>
                        {transaction?.customerEmail && (
                            <p className="text-text-secondary">
                                {
                                    dictionary.pages.checkoutReturn.success
                                        .confirmationEmailSent
                                }{' '}
                                <span className="font-semibold">
                                    {transaction.customerEmail}
                                </span>
                            </p>
                        )}
                    </div>

                    {transaction &&
                        !transaction.alreadyProcessed &&
                        transaction.transaction && (
                            <div className="bg-base-neutral-800 border border-card-stroke p-4 rounded-medium mb-6">
                                <h2 className="font-semibold text-text-primary mb-2">
                                    {
                                        dictionary.pages.checkoutReturn.success
                                            .transactionReceipt
                                    }
                                </h2>
                                <p className="text-sm text-text-secondary mb-1">
                                    {
                                        dictionary.pages.checkoutReturn.success
                                            .transactionId
                                    }{' '}
                                    {transaction.transaction.id}
                                </p>
                                <p className="text-sm text-text-secondary">
                                    {
                                        dictionary.pages.checkoutReturn.success
                                            .amount
                                    }{' '}
                                    {(
                                        transaction.transaction.amount / 100
                                    ).toFixed(2)}{' '}
                                    {transaction.transaction.currency.toUpperCase()}
                                </p>
                            </div>
                        )}

                    <div className="mb-6">
                        <p className="text-sm text-text-secondary text-center">
                            {transaction?.alreadyProcessed
                                ? dictionary.pages.checkoutReturn.success
                                      .alreadyProcessed
                                : dictionary.pages.checkoutReturn.success
                                      .purchaseUnlocked}
                        </p>
                    </div>

                    {transaction && !transaction.alreadyProcessed && (
                        <div className="flex flex-col gap-4">
                            <Button
                                variant="primary"
                                size="big"
                                text={getButtonText(transaction.purchaseType, transaction.purchaseIdentifier)}
                                onClick={() => redirectToDestination(transaction)}
                                className="w-full"
                            />

                            <p className="text-center text-sm text-text-secondary">
                                {dictionary.pages.checkoutReturn.success.redirectingIn.replace(
                                    '{countdown}',
                                    countdown.toString(),
                                )}
                            </p>
                        </div>
                    )}

                    {transaction?.alreadyProcessed && (
                        <Button
                            variant="primary"
                            size="big"
                            text={
                                dictionary.pages.checkoutReturn.actions
                                    .viewMyCourses
                            }
                            onClick={() =>
                                router.push(`/${locale}/workspace/courses`)
                            }
                            className="w-full"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
