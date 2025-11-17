import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
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
    const [availableCoachingsResponse] =
        trpc.listAvailableCoachings.useSuspenseQuery({});
    const [availableCoachingsViewModel, setAvailableCoachingsViewModel] =
        useState<viewModels.TAvailableCoachingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListAvailableCoachingsPresenter(
        setAvailableCoachingsViewModel,
    );
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
                // TODO: Implement buy more sessions functionality
            }}
            hideButton
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
    const { presenter: checkoutPresenter } =
        usePrepareCheckoutPresenter(setCheckoutViewModel);
    const prepareCheckoutMutation = trpc.prepareCheckout.useMutation();

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
            setCurrentRequest(request); // Save current request for metadata
            const response = await prepareCheckoutMutation.mutateAsync(request);
            checkoutPresenter.present(response, checkoutViewModel);
        } catch (err) {
            console.error('Failed to prepare checkout:', err);
        }
    }, [prepareCheckoutMutation, checkoutPresenter, checkoutViewModel]);

    // Watch for checkoutViewModel changes and open modal when ready
    useEffect(() => {
        if (checkoutViewModel && checkoutViewModel.mode === 'default') {
            setTransactionDraft(checkoutViewModel.data.transaction);
            setIsCheckoutOpen(true);
        }
    }, [checkoutViewModel]);

    // Checkout intent hook for login flow preservation
    const { saveIntent } = useCheckoutIntent({
        onResumeCheckout: executeCheckout,
    });

    const handleBuyCoachingSessions = async (
        sessionsPerOffering: Record<string | number, number>,
    ) => {
        // Find the first offering with a quantity > 0
        const offeringId = Object.keys(sessionsPerOffering).find(
            (id) => sessionsPerOffering[id] > 0,
        );
        const quantity = offeringId ? sessionsPerOffering[offeringId] : 0;

        if (!offeringId || quantity === 0) {
            return;
        }

        const request: useCaseModels.TPrepareCheckoutRequest = {
            type: 'StudentCoachingSessionPurchase',
            coachingOfferingId: Number(offeringId),
            quantity,
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
                                // TODO: Implement buy more sessions functionality
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

            {transactionDraft && currentRequest && currentRequest.type === 'StudentCoachingSessionPurchase' && (
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
                    purchaseIdentifier={{
                        coachingOfferingId: currentRequest.coachingOfferingId,
                        quantity: currentRequest.quantity,
                    }}
                    locale={locale}
                    onPaymentComplete={handlePaymentComplete}
                />
            )}
        </div>
    );
}
