'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
    Button,
    CheckoutModal,
    type TransactionDraft,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import env from '../../config/env';
import { trpc } from '../../trpc/client';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { usePrepareCheckoutPresenter } from '../../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../../hooks/use-checkout-intent';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SimulationCardProps {
    title: string;
    description: string;
    icon: string;
    onTest: () => Promise<void>;
    isLoading: boolean;
}

function SimulationCard({
    title,
    description,
    icon,
    onTest,
    isLoading,
}: SimulationCardProps) {
    return (
        <div className="border border-card-stroke rounded-lg p-6 bg-card-fill hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className="text-4xl">{icon}</div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                        {description}
                    </p>
                    <Button
                        variant="primary"
                        size="medium"
                        text={isLoading ? 'Loading...' : 'Test Purchase'}
                        onClick={onTest}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const sessionDTO = useSession();
    const isLoggedIn = !!sessionDTO.data;

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [transactionDraft, setTransactionDraft] =
        useState<TransactionDraft | null>(null);
    const [currentRequest, setCurrentRequest] =
        useState<useCaseModels.TPrepareCheckoutRequest | null>(null);
    const [viewModel, setViewModel] =
        useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
    const { presenter } = usePrepareCheckoutPresenter(setViewModel);

    const prepareCheckoutMutation = trpc.prepareCheckout.useMutation();

    // Helper to execute checkout
    const executeCheckout = useCallback(async (
        request: useCaseModels.TPrepareCheckoutRequest,
    ) => {
        try {
            setCurrentRequest(request); // Save current request for metadata
            const response = await prepareCheckoutMutation.mutateAsync(request);
            presenter.present(response, viewModel);
        } catch (err) {
            console.error('Failed to prepare checkout:', err);
        }
    }, [prepareCheckoutMutation, presenter, viewModel]);

    // Watch for viewModel changes and open modal when ready
    useEffect(() => {
        if (viewModel && viewModel.mode === 'default') {
            setTransactionDraft(viewModel.data.transaction);
            setIsCheckoutOpen(true);
        }
    }, [viewModel]);

    // Checkout intent hook for login flow preservation
    const { saveIntent } = useCheckoutIntent({
        onResumeCheckout: executeCheckout,
    });

    const handleTest = async (request: useCaseModels.TPrepareCheckoutRequest) => {
        // If user is not logged in, save intent and redirect to login
        if (!isLoggedIn) {
            saveIntent(request, window.location.pathname);
            router.push(
                `/${locale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
            );
            return;
        }

        // User is logged in, execute checkout
        executeCheckout(request);
    };

    const handlePaymentComplete = (sessionId: string) => {
        console.log('Payment completed with session ID:', sessionId);
        setIsCheckoutOpen(false);
        setTransactionDraft(null);
    };

    // Helper to build purchase identifier from request (handles discriminated union)
    const getPurchaseIdentifier = (request: useCaseModels.TPrepareCheckoutRequest) => {
        switch (request.type) {
            case 'StudentCoursePurchase':
            case 'StudentCoursePurchaseWithCoaching':
                return {
                    courseSlug: request.courseSlug,
                    withCoaching: request.type === 'StudentCoursePurchaseWithCoaching',
                };
            case 'StudentPackagePurchase':
            case 'StudentPackagePurchaseWithCoaching':
                return {
                    packageId: request.packageId,
                    withCoaching: request.type === 'StudentPackagePurchaseWithCoaching',
                };
            case 'StudentCoachingSessionPurchase':
                return {
                    coachingOfferingId: request.coachingOfferingId,
                    quantity: request.quantity,
                };
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Checkout Testing & Simulation
                    </h1>
                    <p className="text-text-secondary">
                        This page allows you to test all purchase flows without
                        requiring full backend setup. Click any card below to
                        simulate a purchase and test the checkout modal.
                    </p>
                </div>

                {viewModel && viewModel.mode !== 'default' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 font-semibold">
                            Error: {viewModel.mode}
                        </p>
                        <p className="text-red-600 text-sm">{viewModel.data.message}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <SimulationCard
                        title="Single Course"
                        description="Purchase a single course without coaching sessions"
                        icon="📚"
                        isLoading={prepareCheckoutMutation.isPending}
                        onTest={() =>
                            handleTest({
                                type: 'StudentCoursePurchase',
                                courseSlug: 'intro-to-programming',
                            })
                        }
                    />

                    <SimulationCard
                        title="Course + Coaching"
                        description="Purchase a course with personalized coaching sessions"
                        icon="👨‍🏫"
                        isLoading={prepareCheckoutMutation.isPending}
                        onTest={() =>
                            handleTest({
                                type: 'StudentCoursePurchaseWithCoaching',
                                courseSlug: 'advanced-javascript',
                            })
                        }
                    />

                    <SimulationCard
                        title="Package"
                        description="Purchase a package bundle of multiple courses"
                        icon="📦"
                        isLoading={prepareCheckoutMutation.isPending}
                        onTest={() =>
                            handleTest({
                                type: 'StudentPackagePurchase',
                                packageId: 1,
                            })
                        }
                    />

                    <SimulationCard
                        title="Package + Coaching"
                        description="Purchase a package with coaching for all included courses"
                        icon="🎓"
                        isLoading={prepareCheckoutMutation.isPending}
                        onTest={() =>
                            handleTest({
                                type: 'StudentPackagePurchaseWithCoaching',
                                packageId: 1,
                            })
                        }
                    />

                    <SimulationCard
                        title="Coaching Sessions"
                        description="Purchase standalone coaching sessions"
                        icon="💬"
                        isLoading={prepareCheckoutMutation.isPending}
                        onTest={() =>
                            handleTest({
                                type: 'StudentCoachingSessionPurchase',
                                coachingOfferingId: 1,
                                quantity: 2,
                            })
                        }
                    />
                </div>

                <div className="border-t border-card-stroke pt-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Coupon Testing
                    </h2>
                    <p className="text-text-secondary mb-4">
                        Test various coupon scenarios by clicking the cards
                        below. These will test coupon validation.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SimulationCard
                            title="Valid: 10% Off"
                            description="Test with SAVE10 coupon"
                            icon="✅"
                            isLoading={prepareCheckoutMutation.isPending}
                            onTest={() =>
                                handleTest({
                                    type: 'StudentCoursePurchase',
                                    courseSlug: 'intro-to-programming',
                                    couponCode: 'SAVE10',
                                })
                            }
                        />

                        <SimulationCard
                            title="Valid: 20% Off"
                            description="Test with SAVE20 coupon"
                            icon="✅"
                            isLoading={prepareCheckoutMutation.isPending}
                            onTest={() =>
                                handleTest({
                                    type: 'StudentCoursePurchase',
                                    courseSlug: 'intro-to-programming',
                                    couponCode: 'SAVE20',
                                })
                            }
                        />

                        <SimulationCard
                            title="Invalid Code"
                            description="Test with INVALID coupon"
                            icon="❌"
                            isLoading={prepareCheckoutMutation.isPending}
                            onTest={() =>
                                handleTest({
                                    type: 'StudentCoursePurchase',
                                    courseSlug: 'intro-to-programming',
                                    couponCode: 'INVALID',
                                })
                            }
                        />

                        <SimulationCard
                            title="Expired"
                            description="Test with EXPIRED coupon"
                            icon="⏰"
                            isLoading={prepareCheckoutMutation.isPending}
                            onTest={() =>
                                handleTest({
                                    type: 'StudentCoursePurchase',
                                    courseSlug: 'intro-to-programming',
                                    couponCode: 'EXPIRED',
                                })
                            }
                        />
                    </div>
                </div>

                {transactionDraft && currentRequest && (
                    <CheckoutModal
                        isOpen={isCheckoutOpen}
                        onClose={() => {
                            setIsCheckoutOpen(false);
                            setTransactionDraft(null);
                        }}
                        transactionDraft={transactionDraft}
                        stripePublishableKey={
                            env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                        }
                        customerEmail={sessionDTO.data?.user?.email}
                        purchaseType={currentRequest.type}
                        purchaseIdentifier={getPurchaseIdentifier(currentRequest)}
                        locale={locale}
                        onPaymentComplete={handlePaymentComplete}
                    />
                )}
            </div>
        </div>
    );
}
