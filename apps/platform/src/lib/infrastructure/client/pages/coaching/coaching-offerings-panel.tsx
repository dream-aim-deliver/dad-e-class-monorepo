import { viewModels } from '@maany_shr/e-class-models';
import { TPrepareCheckoutRequest, TPrepareCheckoutUseCaseResponse, TStudentCoachingSession } from '@dream-aim-deliver/e-class-cms-rest';
import { trpc } from '../../trpc/cms-client';
import { Suspense, useMemo, useState, useEffect, useCallback } from 'react';
import { useListCoachingOfferingsPresenter } from '../../hooks/use-coaching-offerings-presenter';
import {
    AvailableCoachingSessions,
    BuyCoachingSession,
    CheckoutModal,
    PurchaseAuthModal,
    DefaultError,
    DefaultLoading,
    Banner,
    type TransactionDraft,
    type CouponValidationResult,
    type CourseCoachingSessionData,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import { useListAvailableCoachingsPresenter } from '../../hooks/use-available-coachings-presenter';
import { useSession } from 'next-auth/react';
import { groupOfferings } from '../../utils/group-offerings';
import { usePrepareCheckoutPresenter } from '../../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../../hooks/use-checkout-intent';
import { useCheckoutErrors, createCheckoutErrorViewModel, getCheckoutErrorMode } from '../../hooks/use-checkout-errors';
import env from '../../config/env';

type CheckoutAggregationData = viewModels.TPrepareCheckoutSuccess;

function AvailableCoachings() {
    const coachingT = useTranslations('pages.coaching');
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
    const router = useRouter();

    // Query course coaching sessions (this component is only rendered when logged in)
    const studentSessionsQuery = trpc.listStudentCoachingSessions.useQuery(
        {},
        { enabled: true, staleTime: 0, refetchOnMount: 'always' }
    );

    const courseCoachingSessionsData = useMemo(() => {
        if (!studentSessionsQuery.data?.success || !studentSessionsQuery.data?.data) return [];
        const sessions = (studentSessionsQuery.data.data as { sessions: TStudentCoachingSession[] }).sessions;
        const courseUnscheduled = sessions.filter(
            (s): s is Extract<TStudentCoachingSession, { sessionType: 'course-unscheduled' }> =>
                s.sessionType === 'course-unscheduled' && s.id != null
        );
        return Object.values(
            courseUnscheduled.reduce((acc: Record<string, CourseCoachingSessionData>, session) => {
                if (session.id == null) return acc;
                if (!acc[session.course.slug]) {
                    acc[session.course.slug] = {
                        courseTitle: session.course.title,
                        courseSlug: session.course.slug,
                        sessionTitle: session.coachingOfferingTitle || '',
                        sessionDuration: session.coachingOfferingDuration || 0,
                        sessionId: typeof session.id === 'string' ? parseInt(session.id, 10) : session.id,
                        lessonId: session.lessonId ?? null,
                        moduleName: session.moduleName ?? null,
                        lessonName: session.lessonName ?? null,
                        moduleIndex: session.moduleIndex ?? null,
                        moduleTotalCount: session.moduleTotalCount ?? null,
                        lessonIndex: session.lessonIndex ?? null,
                        lessonTotalCount: session.lessonTotalCount ?? null,
                    };
                }
                return acc;
            }, {})
        );
    }, [studentSessionsQuery.data]);

    const groupedOfferings = useMemo(() => {
        if (!availableCoachingsViewModel) return [];
        return groupOfferings(availableCoachingsViewModel);
    }, [availableCoachingsViewModel]);

    if (!availableCoachingsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (availableCoachingsViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={coachingT('error.title')}
                description={coachingT('error.description')}
            />
        );
    }

    if (
        availableCoachingsViewModel.mode === 'not-found' ||
        availableCoachingsViewModel.mode === 'unauthenticated'
    ) {
        return;
    }

    const availableOfferings = availableCoachingsViewModel.data.offerings;

    if (availableOfferings.length === 0 && courseCoachingSessionsData.length === 0) {
        return;
    }

    return (
        <AvailableCoachingSessions
            locale={locale}
            availableCoachingSessionsData={groupedOfferings}
            onClickBuyMoreSessions={() => {
                const buyCoachingsPanel =
                    document.getElementById('buy-coaching-sessions-desktop') ??
                    document.getElementById('buy-coaching-sessions');
                buyCoachingsPanel?.scrollIntoView({ behavior: 'smooth' });
            }}
            courseCoachingSessionsData={courseCoachingSessionsData}
            onClickCourseSession={(data) => {
                window.open(`/${locale}/courses/${data.courseSlug}?tab=study&lesson=${data.lessonId}&highlightSession=${data.sessionId}`, '_blank');
            }}
        />
    );
}

export default function CoachingOfferingsPanel() {
    const coachingT = useTranslations('pages.coaching');
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
    const { getCheckoutErrorTitle, getCheckoutErrorDescription } = useCheckoutErrors();

    const sessionDTO = useSession();
    const isLoggedIn = !!sessionDTO.data;

    // Checkout modal state
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isPurchaseAuthOpen, setIsPurchaseAuthOpen] = useState(false);
    const [pendingPurchaseRequest, setPendingPurchaseRequest] = useState<TPrepareCheckoutRequest | null>(null);
    const [transactionDraft, setTransactionDraft] =
        useState<TransactionDraft | null>(null);
    const [currentRequest, setCurrentRequest] =
        useState<TPrepareCheckoutRequest | null>(null);
    const [checkoutViewModel, setCheckoutViewModel] =
        useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
    const [checkoutError, setCheckoutError] =
        useState<viewModels.TPrepareCheckoutViewModel | null>(null);
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
        request: TPrepareCheckoutRequest,
    ) => {
        try {
            setCurrentRequest(request);
            setCheckoutError(null); // Clear any previous error
            // @ts-ignore - TBaseResult structure is compatible with use case response at runtime
            const response = await utils.prepareCheckout.fetch(request);
            // Unwrap TBaseResult if needed
            if (response && typeof response === 'object' && 'success' in response) {
                if (response.success === true && response.data) {
                    checkoutPresenter.present({ success: true, data: response.data } as unknown as TPrepareCheckoutUseCaseResponse, checkoutViewModel);
                } else if (response.success === false && response.data) {
                    // Access the nested data structure from tRPC response
                    const errorData = 'data' in response.data ? response.data.data : response.data;
                    const errorViewModel = createCheckoutErrorViewModel(errorData as { message?: string; errorType?: string; operation?: string; context?: unknown });
                    setCheckoutError(errorViewModel);
                    // Scroll to top so user can see the error banner
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else {
                checkoutPresenter.present(response as TPrepareCheckoutUseCaseResponse, checkoutViewModel);
            }
        } catch (err) {
            console.error('Failed to prepare checkout:', err);
        }
    }, [utils, checkoutPresenter, checkoutViewModel]);

    // Helper to build purchase identifier from request (handles discriminated union)
    const getPurchaseIdentifier = (request: TPrepareCheckoutRequest) => {
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
        if (checkoutViewModel) {
            if (checkoutViewModel.mode === 'default') {
                setTransactionDraft(checkoutViewModel.data);
                setIsCheckoutOpen(true);
                setCheckoutError(null);
            } else {
                setCheckoutError(checkoutViewModel);
            }
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
            .filter(([, quantity]) => quantity > 0)
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

        // If user is not logged in, show auth modal
        if (!isLoggedIn) {
            const request: TPrepareCheckoutRequest = {
                purchaseType: 'StudentCoachingSessionPurchase',
                coachingOfferingId: selectedOfferings[0].offeringId,
                quantity: selectedOfferings[0].quantity,
            };
            setPendingPurchaseRequest(request);
            setIsPurchaseAuthOpen(true);
            return;
        }

        // If multiple offerings selected, we need to combine them
        if (selectedOfferings.length === 1) {
            // Single offering - use existing flow
            const request: TPrepareCheckoutRequest = {
                purchaseType: 'StudentCoachingSessionPurchase',
                coachingOfferingId: selectedOfferings[0].offeringId,
                quantity: selectedOfferings[0].quantity,
            };

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
                    } as TPrepareCheckoutRequest)
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
                        const data = response.data as CheckoutAggregationData;
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

    const handlePurchaseAuthLogin = () => {
        if (pendingPurchaseRequest) {
            saveIntent(pendingPurchaseRequest, window.location.pathname);
        }
        setIsPurchaseAuthOpen(false);
        router.push(
            `/${locale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
        );
    };

    const handlePurchaseAuthCancel = () => {
        setIsPurchaseAuthOpen(false);
        setPendingPurchaseRequest(null);
    };

    const handlePaymentComplete = () => {
        setIsCheckoutOpen(false);
        setTransactionDraft(null);
        setCheckoutViewModel(undefined);
        setCurrentRequest(null);
        // TODO: Redirect to success page or show success message
    };

    // Handle coupon validation via prepareCheckout
    const handleApplyCoupon = useCallback(async (couponCode: string): Promise<CouponValidationResult> => {
        // Handle multiple offerings case
        if (multipleOfferings && multipleOfferings.length > 1) {
            try {
                // Make separate prepareCheckout calls for each offering with coupon code
                const checkoutPromises = multipleOfferings.map((offering) =>
                    utils.prepareCheckout.fetch({
                        purchaseType: 'StudentCoachingSessionPurchase',
                        coachingOfferingId: offering.offeringId,
                        quantity: offering.quantity,
                        couponCode,
                    } as TPrepareCheckoutRequest)
                );

                const responses = await Promise.all(checkoutPromises);

                // Check if any response failed
                const failedResponse = responses.find((r) => !r.success);
                if (failedResponse && failedResponse.success === false && failedResponse.data) {
                    // Extract error data
                    const errorData = 'data' in failedResponse.data ? failedResponse.data.data : failedResponse.data;
                    const errorMode = getCheckoutErrorMode(errorData as { errorType?: string; message?: string });
                    const errorMessage = getCheckoutErrorDescription(errorMode);

                    return {
                        success: false,
                        errorMessage
                    };
                }

                // Combine all line items from all offerings
                const allLineItems: Array<{
                    name: string;
                    description: string;
                    unitPrice: number;
                    quantity: number;
                    totalPrice: number;
                }> = [];
                let totalPrice = 0;
                let currency = 'CHF';

                responses.forEach((response) => {
                    if (response.success && response.data) {
                        const data = response.data as CheckoutAggregationData;
                        if (data.lineItems) {
                            allLineItems.push(...data.lineItems);
                            totalPrice += data.finalPrice || 0;
                            currency = data.currency || currency;
                        }
                    }
                });

                // Return combined transaction draft
                return {
                    success: true,
                    data: {
                        lineItems: allLineItems,
                        currency,
                        finalPrice: totalPrice,
                        couponCode,
                    }
                };
            } catch {
                return {
                    success: false,
                    errorMessage: getCheckoutErrorDescription('kaboom')
                };
            }
        }

        // Single offering case - use existing logic
        if (!currentRequest) {
            return {
                success: false,
                errorMessage: getCheckoutErrorDescription('kaboom')
            };
        }

        try {
            const requestWithCoupon = { ...currentRequest, couponCode };
            // @ts-ignore - TBaseResult structure is compatible with use case response at runtime
            const response = await utils.prepareCheckout.fetch(requestWithCoupon);

            if (response && typeof response === 'object' && 'success' in response) {
                if (response.success === true && response.data) {
                    return {
                        success: true,
                        data: response.data as unknown as TransactionDraft,
                    };
                } else if (response.success === false && response.data) {
                    // Extract error data from response
                    const errorData = 'data' in response.data ? response.data.data : response.data;

                    // Get error mode using centralized logic
                    const errorMode = getCheckoutErrorMode(errorData as { errorType?: string; message?: string });

                    // Get translated error message
                    const errorMessage = getCheckoutErrorDescription(errorMode);

                    return {
                        success: false,
                        errorMessage
                    };
                }
            }

            return {
                success: false,
                errorMessage: getCheckoutErrorDescription('kaboom')
            };
        } catch {
            return {
                success: false,
                errorMessage: getCheckoutErrorDescription('kaboom')
            };
        }
    }, [multipleOfferings, currentRequest, utils, getCheckoutErrorDescription]);

    if (!coachingOfferingsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachingOfferingsViewModel.mode === 'not-found') {
        return;
    }

    if (coachingOfferingsViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={coachingT('error.title')}
                description={coachingT('error.description')}
            />
        );
    }

    const coachingOfferings = coachingOfferingsViewModel.data.offerings;

    if (coachingOfferings.length === 0) {
        return;
    }

    const availableCoachingsPanel = isLoggedIn ? (
        <div className="w-full min-w-0">
            <Suspense
                fallback={
                    <AvailableCoachingSessions
                        locale={locale}
                        isLoading
                        hideButton
                        availableCoachingSessionsData={[]}
                        onClickBuyMoreSessions={() => {
                            router.push(`/${locale}/checkout`);
                        }}
                    />
                }
            >
                <AvailableCoachings />
            </Suspense>
        </div>
    ) : null;

    const buyCoachingsPanel = (
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
    );

    return (
        <div
            className={`flex flex-col space-y-5 lg:min-w-[400px] lg:w-[400px] lg:self-stretch`}
        >
            {/* Checkout Error Banner */}
            {checkoutError && checkoutError.mode !== 'default' && (
                <Banner
                    style="error"
                    icon
                    closeable
                    title={getCheckoutErrorTitle(checkoutError.mode)}
                    description={getCheckoutErrorDescription(checkoutError.mode)}
                    onClose={() => {
                        setCheckoutError(null);
                        setCheckoutViewModel(undefined);
                    }}
                />
            )}
            <div
                className="grid w-full min-w-0 items-start gap-5 lg:hidden"
                style={{
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))',
                }}
            >
                {availableCoachingsPanel}
                <div id="buy-coaching-sessions" className="w-full min-w-0">
                    {buyCoachingsPanel}
                </div>
            </div>
            <div className="hidden w-full min-w-0 lg:flex lg:flex-1 lg:flex-col lg:gap-5">
                {availableCoachingsPanel}
                <div
                    id="buy-coaching-sessions-desktop"
                    className="w-full min-w-0 sticky top-22 self-start"
                >
                    {buyCoachingsPanel}
                </div>
            </div>

            <PurchaseAuthModal
                isOpen={isPurchaseAuthOpen}
                onLogin={handlePurchaseAuthLogin}
                onCancel={handlePurchaseAuthCancel}
                locale={locale}
            />

            {transactionDraft && currentRequest && currentRequest.purchaseType === 'StudentCoachingSessionPurchase' && (
                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => {
                        setIsCheckoutOpen(false);
                        setTransactionDraft(null);
                        setCheckoutViewModel(undefined);
                        setCurrentRequest(null);
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
                    onApplyCoupon={handleApplyCoupon}
                />
            )}
        </div>
    );
}
