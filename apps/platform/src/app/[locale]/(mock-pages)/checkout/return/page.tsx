'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { trpc } from '../../../../../lib/infrastructure/client/trpc/client';
import { checkoutSessionStorage } from '../../../../../lib/infrastructure/client/utils/checkout-session-storage';
import env from '../../../../../lib/infrastructure/client/config/env';

type PageState = 'loading' | 'success' | 'error';

export default function CheckoutReturnPage() {
    const router = useRouter();
    const locale = useLocale();
    const searchParams = useSearchParams();
    const sessionId = searchParams?.get('session_id');

    const [state, setState] = useState<PageState>('loading');
    const [transaction, setTransaction] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [countdown, setCountdown] = useState(5);

    const verifyMutation = trpc.verifyAndUnlockPurchase.useMutation();

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
            const result = await verifyMutation.mutateAsync({ sessionId });

            if (result.success) {
                checkoutSessionStorage.saveCompletedSession(sessionId);
                setTransaction(result);
                setState('success');

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
            case 'StudentPackagePurchase':
            case 'StudentPackagePurchaseWithCoaching':
                return `/${locale}/workspace/courses`;
            case 'StudentCoachingSessionPurchase':
                return `/${locale}/offers`;
            default:
                return `/${locale}/workspace/courses`;
        }
    };

    const getButtonText = (purchaseType: string): string => {
        switch (purchaseType) {
            case 'StudentCoursePurchase':
            case 'StudentCoursePurchaseWithCoaching':
                return 'Go to Course';
            case 'StudentPackagePurchase':
            case 'StudentPackagePurchaseWithCoaching':
                return 'View My Courses';
            case 'StudentCoachingSessionPurchase':
                return 'Browse Offerings';
            default:
                return 'Continue';
        }
    }

    if (state === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Processing your payment...</p>
                </div>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center mb-6">
                        <div className="text-red-600 text-6xl mb-4">✗</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Payment Error
                        </h1>
                        <p className="text-gray-700">{error}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded mb-6">
                        <p className="text-sm font-semibold mb-2">Need help?</p>
                        {env.NEXT_PUBLIC_CONTACT_EMAIL && (
                            <p className="text-sm mb-1">
                                Email:{' '}
                                <a
                                    href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {env.NEXT_PUBLIC_CONTACT_EMAIL}
                                </a>
                            </p>
                        )}
                        {env.NEXT_PUBLIC_CONTACT_PHONE && (
                            <p className="text-sm">
                                Phone:{' '}
                                <a
                                    href={`tel:${env.NEXT_PUBLIC_CONTACT_PHONE}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {env.NEXT_PUBLIC_CONTACT_PHONE}
                                </a>
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => sessionId && processPayment(sessionId)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-2"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push(`/${locale}/checkout`)}
                        className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                    >
                        Back to Checkout
                    </button>
                </div>
            </div>
        );
    }

    // Success state
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-6">
                    <div className="text-green-600 text-6xl mb-4">✓</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Successful!
                    </h1>
                    {transaction?.customerEmail && (
                        <p className="text-gray-600">
                            Confirmation email sent to{' '}
                            <span className="font-semibold">
                                {transaction.customerEmail}
                            </span>
                        </p>
                    )}
                </div>

                {transaction && !transaction.alreadyProcessed && transaction.transaction && (
                    <div className="bg-gray-50 p-4 rounded mb-6">
                        <h2 className="font-semibold mb-2">Transaction Receipt</h2>
                        <p className="text-sm text-gray-600 mb-1">
                            Transaction ID: {transaction.transaction.id}
                        </p>
                        <p className="text-sm text-gray-600">
                            Amount:{' '}
                            {(transaction.transaction.amount / 100).toFixed(2)}{' '}
                            {transaction.transaction.currency.toUpperCase()}
                        </p>
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-sm text-gray-700 text-center">
                        {transaction?.alreadyProcessed
                            ? 'This purchase has already been processed and unlocked.'
                            : 'Your purchase has been unlocked and is now available.'}
                    </p>
                </div>

                {transaction && !transaction.alreadyProcessed && (
                    <>
                        <button
                            onClick={() => redirectToDestination(transaction)}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 mb-2"
                        >
                            {getButtonText(transaction.purchaseType)}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Redirecting in {countdown} seconds...
                        </p>
                    </>
                )}

                {transaction?.alreadyProcessed && (
                    <button
                        onClick={() => router.push(`/${locale}/workspace/courses`)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700"
                    >
                        Go to My Courses
                    </button>
                )}
            </div>
        </div>
    );
}
