import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/cms-client';
import { Suspense, useMemo, useState, useEffect, useCallback } from 'react';
import { useListCoachingOfferingsPresenter } from '../../hooks/use-coaching-offerings-presenter';
import {
    AvailableCoachingSessions,
    BuyCoachingSession,
    CheckoutModal,
    DefaultError,
    DefaultLoading,
    type TransactionDraft,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import { useListAvailableCoachingsPresenter } from '../../hooks/use-available-coachings-presenter';
import { useSession } from 'next-auth/react';
import { groupOfferings } from '../../utils/group-offerings';
import { usePrepareCheckoutPresenter } from '../../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../../hooks/use-checkout-intent';
import env from '../../config/env';

function AvailableCoachings() {
    const router = useRouter();
    const [availableCoachingsResponse] =
        trpc.listAvailableCoachings.useSuspenseQuery({});
    const [availableCoachingsViewModel, setAvailableCoachingsViewModel] =
        useState<viewModels.TAvailableCoachingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListAvailableCoachingsPresenter(
        setAvailableCoachingsViewModel,
    );
    // @ts-ignore - TBaseResult structure needs unwrapping, presenter handles it
    presenter.present(availableCoachingsResponse, availableCoachingsViewModel);

    const locale = useLocale() as TLocale;

    const groupedOfferings = useMemo(() => {
        if (!availableCoachingsViewModel) return [];
        return groupOfferings(availableCoachingsViewModel);
    }, [availableCoachingsViewModel]);

    if (!availableCoachingsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (availableCoachingsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (
        availableCoachingsViewModel.mode === 'not-found' ||
        availableCoachingsViewModel.mode === 'unauthenticated'
    ) {
        return;
    }

    const availableOfferings = availableCoachingsViewModel.data.offerings;

    if (availableOfferings.length === 0) {
        return;
    }

    return (
        <AvailableCoachingSessions
            locale={locale}
            availableCoachingSessionsData={groupedOfferings}
            onClickBuyMoreSessions={() => {
                router.push('/checkout');
            }}
        />
    );
}

export default function CoachingOfferingsPanel() {
    const [coachingOfferingsResponse] =
        trpc.listCoachingOfferings.useSuspenseQuery({});
    const [coachingOfferingsViewModel, setCoachingOfferingsViewModel] =
        useState<viewModels.TCoachingOfferingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListCoachingOfferingsPresenter(
        setCoachingOfferingsViewModel,
    );
    // @ts-ignore
    presenter.present(coachingOfferingsResponse, coachingOfferingsViewModel);

    const locale = useLocale() as TLocale;
    const router = useRouter();

    const sessionDTO = useSession();
    const isLoggedIn = !!sessionDTO.data;

    // Checkout modal state
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [transactionDraft, setTransactionDraft] =
        useState<TransactionDraft | null>(null);
    const [currentRequest, setCurrentRequest] =
        useState<useCaseModels.TPrepareCheckoutRequest | null>(null);
    const [checkoutViewModel, setCheckoutViewModel] =
        useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
    const [multipleOfferings, setMultipleOfferings] = useState<Array<{ offeringId: number; quantity: number }> | null>(null);
    const { presenter: checkoutPresenter } =
        usePrepareCheckoutPresenter(setCheckoutViewModel);
    const utils = trpc.useUtils();

    const currency = useMemo(() => {
        if (
            !coachingOfferingsViewModel ||
            coachingOfferingsViewModel.mode !== 'default'
        ) {
            return undefined;
        }
        // Each offering specifies a currency, hence deriving it from the first offering
        return coachingOfferingsViewModel.data.offerings[0]?.currency;
    }, [coachingOfferingsViewModel]);

    // Helper to execute checkout
    const executeCheckout = useCallback(async (
        request: useCaseModels.TPrepareCheckoutRequest,
    ) => {
        try {
            setCurrentRequest(request);
            // @ts-ignore - TBaseResult structure is compatible with use case response at runtime
            const response = await utils.prepareCheckout.fetch(request) as useCaseModels.TPrepareCheckoutUseCaseResponse;
            checkoutPresenter.present(response, checkoutViewModel);
        } catch (err) {
            console.error('Failed to prepare checkout:', err);
        }
    }, [utils, checkoutPresenter, checkoutViewModel]);

    // Helper to build purchase identifier from request (handles discriminated union)
    const getPurchaseIdentifier = (request: useCaseModels.TPrepareCheckoutRequest) => {
        switch (request.purchaseType) {
            case 'StudentCoachingSessionPurchase':
                // If we have multiple offerings, return them in the format expected by backend
                if (multipleOfferings && multipleOfferings.length > 1) {
                    // Format: "1:3,2:2" means offering 1 qty 3, offering 2 qty 2
                    const offeringsString = multipleOfferings
                        .map((o) => `${o.offeringId}:${o.quantity}`)
                        .join(',');
                    return {
                        coachingOfferingId: multipleOfferings[0].offeringId, // First one for compatibility
                        quantity: multipleOfferings[0].quantity, // First one for compatibility
                        offerings: offeringsString, // Multiple offerings in backend format
                    };
                }
                return {
                    coachingOfferingId: request.coachingOfferingId,
                    quantity: request.quantity,
                };
            case 'StudentCoursePurchase':
                return {
                    courseSlug: request.courseSlug,
                };
            case 'StudentCoursePurchaseWithCoaching':
                return {
                    courseSlug: request.courseSlug,
                    withCoaching: request.purchaseType === 'StudentCoursePurchaseWithCoaching',
                };
            case 'StudentPackagePurchase':
            case 'StudentPackagePurchaseWithCoaching':
                return {
                    packageId: request.packageId,
                    withCoaching: request.purchaseType === 'StudentPackagePurchaseWithCoaching',
                };
            case 'StudentCourseCoachingSessionPurchase':
                return {
                    courseSlug: request.courseSlug,
                    lessonComponentIds: request.lessonComponentIds,
                };
        }
    };

    // Watch for checkoutViewModel changes and open modal when ready
    useEffect(() => {
        if (checkoutViewModel && checkoutViewModel.mode === 'default') {
            setTransactionDraft(checkoutViewModel.data);
            setIsCheckoutOpen(true);
        }
    }, [checkoutViewModel]);

    // Reset multiple offerings when modal closes
    useEffect(() => {
        if (!isCheckoutOpen) {
            setMultipleOfferings(null);
        }
    }, [isCheckoutOpen]);

    // Checkout intent hook for login flow preservation
    const { saveIntent } = useCheckoutIntent({
        onResumeCheckout: executeCheckout,
    });

    const handleBuyCoachingSessions = async (
        sessionsPerOffering: Record<string | number, number>,
    ) => {
        // Collect all offerings with quantity > 0
        const selectedOfferings = Object.entries(sessionsPerOffering)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => ({
                offeringId: Number(id),
                quantity: quantity,
            }));

        if (selectedOfferings.length === 0) {
            return;
        }

        // Store multiple offerings if more than one
        if (selectedOfferings.length > 1) {
            setMultipleOfferings(selectedOfferings);
        } else {
            setMultipleOfferings(null);
        }

        // If multiple offerings selected, we need to combine them
        if (selectedOfferings.length === 1) {
            // Single offering - use existing flow
            const request: useCaseModels.TPrepareCheckoutRequest = {
                purchaseType: 'StudentCoachingSessionPurchase',
                coachingOfferingId: selectedOfferings[0].offeringId,
                quantity: selectedOfferings[0].quantity,
            };

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
        } else {
            // Multiple offerings - make separate prepareCheckout calls and combine
            try {
                const checkoutPromises = selectedOfferings.map((offering) =>
                    utils.prepareCheckout.fetch({
                        purchaseType: 'StudentCoachingSessionPurchase',
                        coachingOfferingId: offering.offeringId,
                        quantity: offering.quantity,
                    } as useCaseModels.TPrepareCheckoutRequest)
                );

                const responses = await Promise.all(checkoutPromises);
                
                // Combine all line items and calculate total
                const allLineItems: Array<{
                    name: string;
                    description: string;
                    unitPrice: number;
                    quantity: number;
                    totalPrice: number;
                    currency: string;
                }> = [];
                let totalPrice = 0;
                let currency = 'CHF';

                responses.forEach((response) => {
                    if (response.success && response.data) {
                        const data = response.data as any;
                        if (data.lineItems) {
                            allLineItems.push(...data.lineItems);
                            totalPrice += data.finalPrice || 0;
                            currency = data.currency || currency;
                        }
                    }
                });

                // Create a combined checkout view model
                const combinedViewModel: viewModels.TPrepareCheckoutViewModel = {
                    mode: 'default',
                    data: {
                        lineItems: allLineItems,
                        currency: currency,
                        finalPrice: totalPrice,
                    },
                };

                // Set the combined view model
                setCheckoutViewModel(combinedViewModel);
                
                // Create a request with the first offering (for type compatibility)
                // The actual multiple offerings will be passed via getPurchaseIdentifier
                setCurrentRequest({
                    purchaseType: 'StudentCoachingSessionPurchase',
                    coachingOfferingId: selectedOfferings[0].offeringId,
                    quantity: selectedOfferings[0].quantity,
                });
            } catch (err) {
                console.error('Failed to prepare checkout for multiple offerings:', err);
            }
        }
    };

    const handlePaymentComplete = (sessionId: string) => {
        console.log('Payment completed with session ID:', sessionId);
        setIsCheckoutOpen(false);
        setTransactionDraft(null);
        // TODO: Redirect to success page or show success message
    };

    if (!coachingOfferingsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachingOfferingsViewModel.mode === 'not-found') {
        return;
    }

    if (coachingOfferingsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const coachingOfferings = coachingOfferingsViewModel.data.offerings;

    if (coachingOfferings.length === 0) {
        return;
    }

    return (
        <div
            className={`flex flex-col space-y-5 lg:min-w-[400px] lg:w-[400px]`}
        >
            {isLoggedIn && (
                <Suspense
                    fallback={
                        <AvailableCoachingSessions
                            locale={locale}
                            isLoading
                            hideButton
                            availableCoachingSessionsData={[]}
                            onClickBuyMoreSessions={() => {
                                router.push('/checkout');
                            }}
                        />
                    }
                >
                    <AvailableCoachings />
                </Suspense>
            )}
            <BuyCoachingSession
                offerings={coachingOfferings.map((offering) => ({
                    id: offering.id,
                    title: offering.name,
                    content: offering.description,
                    price: offering.price,
                    currency: offering.currency,
                    duration: offering.duration,
                }))}
                onBuy={handleBuyCoachingSessions}
                currencyType={currency ?? ''}
                locale={locale}
            />

            {transactionDraft && currentRequest && currentRequest.purchaseType === 'StudentCoachingSessionPurchase' && (
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
                    purchaseType={currentRequest.purchaseType}
                    purchaseIdentifier={getPurchaseIdentifier(currentRequest)}
                    locale={locale}
                    onPaymentComplete={handlePaymentComplete}
                />
            )}
        </div>
    );
}
