'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { trpc } from '../../trpc/cms-client';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { TPrepareCheckoutRequest, TPrepareCheckoutUseCaseResponse } from '@dream-aim-deliver/e-class-cms-rest';
import { useListAvailableCoachingsPresenter } from '../../hooks/use-available-coachings-presenter';
import { groupOfferings } from '../../utils/group-offerings';
import { useGetCoachAvailabilityPresenter } from '../../hooks/use-coach-availability-presenter';
import {
    AvailableCoachingSessions,
    BuyCoachingSession,
    CheckoutModal,
    Banner,
    DefaultError,
    DefaultLoading,
    Dialog,
    DialogContent,
    CalendarNavigationHeader,
    Button,
    UserAvatar,
    Tabs,
    type TransactionDraft,
    type CouponValidationResult,
} from '@maany_shr/e-class-ui-kit';
import ScheduledOfferingContent from './dialogs/scheduled-offering-content';
import {
    MonthlyCoachCalendarWrapper,
    WeeklyCoachCalendarWrapper,
} from '../common/coach-calendar-wrappers';
import { useGetStudentCoachingSessionPresenter } from '../../hooks/use-student-coaching-session-presenter';
import { useListCoachingOfferingsPresenter } from '../../hooks/use-coaching-offerings-presenter';
import { useGetCoachIntroductionPresenter } from '../../hooks/use-get-coach-introduction-presenter';
import { usePrepareCheckoutPresenter } from '../../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../../hooks/use-checkout-intent';
import { useCheckoutErrors, createCheckoutErrorViewModel, getCheckoutErrorMode } from '../../hooks/use-checkout-errors';
import { useSession } from 'next-auth/react';
import env from '../../config/env';

interface AvailableCoachingsProps {
    onClickBuyMoreSessions: () => void;
}

function AvailableCoachings({ onClickBuyMoreSessions }: AvailableCoachingsProps) {
    const locale = useLocale() as TLocale;
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
        return (
            <AvailableCoachingSessions
                locale={locale}
                availableCoachingSessionsData={[]}
                onClickBuyMoreSessions={onClickBuyMoreSessions}
            />
        );
    }

    return (
        <AvailableCoachingSessions
            locale={locale}
            availableCoachingSessionsData={groupedOfferings}
            onClickBuyMoreSessions={onClickBuyMoreSessions}
        />
    );
}

interface CoachHeaderProps {
    coachUsername: string;
}

function CoachHeader({ coachUsername }: CoachHeaderProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const t = useTranslations('pages.coachProfile');
    const [coachIntroResponse] = trpc.getCoachIntroduction.useSuspenseQuery({ coachUsername });

    const [coachIntroViewModel, setCoachIntroViewModel] = useState<
        viewModels.TGetCoachIntroductionViewModel | undefined
    >(undefined);

    const { presenter } = useGetCoachIntroductionPresenter(setCoachIntroViewModel);
    // @ts-ignore
    presenter.present(coachIntroResponse, coachIntroViewModel);

    if (!coachIntroViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachIntroViewModel.mode !== 'default') {
        return null;
    }

    const coach = coachIntroViewModel.data.coach;

    return (
        <div className="flex flex-col gap-4 mb-6">
            <Button
                onClick={() => router.push(`/${locale}/coaches/${coachUsername}`)}
                variant="text"
                text={`< ${t('back')}`}
                className="w-fit p-0"
            />
            <div className="flex items-center gap-4">
                <UserAvatar
                    size="large"
                    imageUrl={coach.avatarImage?.downloadUrl}
                    fullName={`${coach.name} ${coach.surname}`}
                />
                <h2 className="text-2xl lg:text-3xl text-text-primary font-bold">
                    {coach.name} {coach.surname} Availability
                </h2>
            </div>
            <hr className="border-divider" />
        </div>
    );
}

interface CoachingOfferingsPanelProps {
    coachUsername: string;
}

function CoachingOfferingsPanel({ coachUsername }: CoachingOfferingsPanelProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const sessionDTO = useSession();
    const isLoggedIn = !!sessionDTO.data;
    const { getCheckoutErrorTitle, getCheckoutErrorDescription } = useCheckoutErrors();

    // Fetch coaching offerings
    const [coachingOfferingsResponse] = trpc.listCoachingOfferings.useSuspenseQuery({});
    const [coachingOfferingsViewModel, setCoachingOfferingsViewModel] = useState<
        viewModels.TCoachingOfferingListViewModel | undefined
    >(undefined);
    const { presenter } = useListCoachingOfferingsPresenter(setCoachingOfferingsViewModel);
    // @ts-ignore
    presenter.present(coachingOfferingsResponse, coachingOfferingsViewModel);

    // Toggle state for buy section visibility
    const [isBuySectionVisible, setIsBuySectionVisible] = useState(false);

    // Checkout modal state
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [transactionDraft, setTransactionDraft] = useState<TransactionDraft | null>(null);
    const [currentRequest, setCurrentRequest] = useState<TPrepareCheckoutRequest | null>(null);
    const [checkoutViewModel, setCheckoutViewModel] = useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
    const [checkoutError, setCheckoutError] = useState<viewModels.TPrepareCheckoutViewModel | null>(null);
    const [multipleOfferings, setMultipleOfferings] = useState<Array<{ offeringId: number; quantity: number }> | null>(null);
    const { presenter: checkoutPresenter } = usePrepareCheckoutPresenter(setCheckoutViewModel);
    const utils = trpc.useUtils();

    const currency = useMemo(() => {
        if (!coachingOfferingsViewModel || coachingOfferingsViewModel.mode !== 'default') {
            return undefined;
        }
        return coachingOfferingsViewModel.data.offerings[0]?.currency;
    }, [coachingOfferingsViewModel]);

    // Helper to execute checkout
    const executeCheckout = useCallback(async (request: TPrepareCheckoutRequest) => {
        try {
            setCurrentRequest(request);
            setCheckoutError(null);
            // @ts-ignore
            const response = await utils.prepareCheckout.fetch(request);
            if (response && typeof response === 'object' && 'success' in response) {
                if (response.success === true && response.data) {
                    checkoutPresenter.present({ success: true, data: response.data } as unknown as TPrepareCheckoutUseCaseResponse, checkoutViewModel);
                } else if (response.success === false && response.data) {
                    // Access the nested data structure from tRPC response
                    const errorData = 'data' in response.data ? response.data.data : response.data;
                    const errorViewModel = createCheckoutErrorViewModel(errorData as { message?: string; errorType?: string; operation?: string; context?: unknown });
                    setCheckoutError(errorViewModel);
                }
            } else {
                checkoutPresenter.present(response as TPrepareCheckoutUseCaseResponse, checkoutViewModel);
            }
        } catch (err) {
            console.error('Failed to prepare checkout:', err);
        }
    }, [utils, checkoutPresenter, checkoutViewModel]);

    // Helper to build purchase identifier
    const getPurchaseIdentifier = (request: TPrepareCheckoutRequest) => {
        if (request.purchaseType !== 'StudentCoachingSessionPurchase') return {};
        if (multipleOfferings && multipleOfferings.length > 1) {
            const offeringsString = multipleOfferings.map((o) => `${o.offeringId}:${o.quantity}`).join(',');
            return {
                coachingOfferingId: multipleOfferings[0].offeringId,
                quantity: multipleOfferings[0].quantity,
                offerings: offeringsString,
                coachUsername,
            };
        }
        return {
            coachingOfferingId: request.coachingOfferingId,
            quantity: request.quantity,
            coachUsername,
        };
    };

    // Watch for checkoutViewModel changes and open modal
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

    const handleBuyCoachingSessions = async (sessionsPerOffering: Record<string | number, number>) => {
        const selectedOfferings = Object.entries(sessionsPerOffering)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => ({
                offeringId: Number(id),
                quantity: quantity,
            }));

        if (selectedOfferings.length === 0) return;

        if (selectedOfferings.length > 1) {
            setMultipleOfferings(selectedOfferings);
        } else {
            setMultipleOfferings(null);
        }

        if (selectedOfferings.length === 1) {
            const request: TPrepareCheckoutRequest = {
                purchaseType: 'StudentCoachingSessionPurchase',
                coachingOfferingId: selectedOfferings[0].offeringId,
                quantity: selectedOfferings[0].quantity,
            };

            if (!isLoggedIn) {
                saveIntent(request, window.location.pathname);
                router.push(`/${locale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
                return;
            }

            executeCheckout(request);
        } else {
            try {
                const checkoutPromises = selectedOfferings.map((offering) =>
                    utils.prepareCheckout.fetch({
                        purchaseType: 'StudentCoachingSessionPurchase',
                        coachingOfferingId: offering.offeringId,
                        quantity: offering.quantity,
                    } as TPrepareCheckoutRequest)
                );

                const responses = await Promise.all(checkoutPromises);
                const allLineItems: Array<{
                    name: string;
                    description: string;
                    unitPrice: number;
                    quantity: number;
                    totalPrice: number;
                    currency: string;
                }> = [];
                let totalPrice = 0;
                let currencyValue = 'CHF';

                responses.forEach((response) => {
                    if (response.success && response.data) {
                        const data = response.data as any;
                        if (data.lineItems) {
                            allLineItems.push(...data.lineItems);
                            totalPrice += data.finalPrice || 0;
                            currencyValue = data.currency || currencyValue;
                        }
                    }
                });

                const combinedViewModel: viewModels.TPrepareCheckoutViewModel = {
                    mode: 'default',
                    data: {
                        lineItems: allLineItems,
                        currency: currencyValue,
                        finalPrice: totalPrice,
                    },
                };

                setCheckoutViewModel(combinedViewModel);
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
        setIsCheckoutOpen(false);
        setTransactionDraft(null);
        setCheckoutViewModel(undefined);
        setCurrentRequest(null);
    };

    // Handle coupon validation via prepareCheckout
    const handleApplyCoupon = useCallback(async (couponCode: string): Promise<CouponValidationResult> => {
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
        } catch (error) {
            return {
                success: false,
                errorMessage: getCheckoutErrorDescription('kaboom')
            };
        }
    }, [currentRequest, utils, getCheckoutErrorDescription]);

    if (!coachingOfferingsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachingOfferingsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (coachingOfferingsViewModel.mode === 'not-found') {
        return (
            <Suspense fallback={
                <AvailableCoachingSessions
                    locale={locale}
                    isLoading
                    hideButton
                    availableCoachingSessionsData={[]}
                    onClickBuyMoreSessions={() => { /* noop - loading state */ }}
                />
            }>
                <AvailableCoachings onClickBuyMoreSessions={() => router.push('/coaching')} />
            </Suspense>
        );
    }

    const coachingOfferings = coachingOfferingsViewModel.data.offerings;

    return (
        <div className="flex flex-col space-y-5">
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

            {/* Available Coaching Sessions */}
            <Suspense fallback={
                <AvailableCoachingSessions
                    locale={locale}
                    isLoading
                    hideButton
                    availableCoachingSessionsData={[]}
                    onClickBuyMoreSessions={() => { /* noop - loading state */ }}
                />
            }>
                <AvailableCoachings onClickBuyMoreSessions={() => setIsBuySectionVisible((prev) => !prev)} />
            </Suspense>

            {/* Buy Coaching Sessions - toggleable */}
            {isBuySectionVisible && coachingOfferings.length > 0 && (
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
            )}

            {/* Checkout Modal */}
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
                    stripePublishableKey={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
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

interface BookCoachPageProps {
    coachUsername: string;
    sessionId?: number;
    returnTo?: string;
    lessonComponentId?: string;
    courseSlug?: string;
}

interface BookCoachPageContentProps {
    coachUsername: string;
    defaultSession: ScheduledOffering | null;
    returnTo?: string;
    lessonComponentId?: string;
    courseSlug?: string;
    onBookingInitiated?: () => void;
}

function BookCoachPageContent({
    coachUsername,
    defaultSession,
    returnTo,
    lessonComponentId,
    courseSlug,
    onBookingInitiated,
}: BookCoachPageContentProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const [coachAvailabilityResponse, { refetch: refetchCoachAvailability }] =
        trpc.getCoachAvailability.useSuspenseQuery({ coachUsername });

    const [coachAvailabilityViewModel, setCoachAvailabilityViewModel] =
        useState<viewModels.TCoachAvailabilityViewModel | undefined>(undefined);
    const { presenter } = useGetCoachAvailabilityPresenter(
        setCoachAvailabilityViewModel,
    );

    // @ts-ignore
    presenter.present(coachAvailabilityResponse, coachAvailabilityViewModel);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [newSession, setNewSession] = useState<ScheduledOffering | null>(
        defaultSession,
    );
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [briefing, setBriefing] = useState('');
    const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
    const calendarT = useTranslations('pages.calendarPage');

    const setNewSessionStart = (startTime: Date) => {
        setNewSession((prev) => {
            if (!defaultSession || !defaultSession.session)
                return { startTime };
            const endTime = new Date(startTime);
            endTime.setMinutes(
                endTime.getMinutes() + defaultSession.session.duration,
            );
            return { ...prev, startTime, endTime };
        });
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const utils = trpc.useUtils();

    const requestSessionMutation = trpc.requestCoachingSession.useMutation({
        onSuccess: () => {
            // Invalidate related queries to refetch fresh data
            utils.listStudentCoachingSessions.invalidate();
            utils.getCoachAvailability.invalidate({ coachUsername });
        },
    });
    const [submitError, setSubmitError] = useState<string | undefined>(
        undefined,
    );

    const onSubmit = () => {
        if (!newSession) return;
        if (!newSession.session) return;
        if (!newSession.startTime) return;

        // Check if briefing is provided
        if (!briefing.trim()) {
            setSubmitError('Please provide a briefing for your coach.');
            return;
        }

        // Check if session is scheduled for the past
        if (newSession.startTime < new Date()) {
            setSubmitError('Cannot schedule a session in the past.');
            return;
        }

        // TODO: Check if there is availability for the selected time

        // briefing and lessonComponentId are supported by the backend but not yet in @dream-aim-deliver/e-class-cms-rest types
        requestSessionMutation.mutate(
            {
                coachUsername,
                sessionId: newSession.session.id,
                startTime: newSession.startTime.toISOString(),
                briefing,
                ...(lessonComponentId && { lessonComponentId }),
            } as Parameters<typeof requestSessionMutation.mutate>[0],
            {
                onSuccess: (data) => {
                    if (!data.success) {
                        // TODO: check error type and show specific message
                        setSubmitError(
                            'Failed to schedule session. Please try again.',
                        );
                        return;
                    }
                    setBookingSuccess(true);
                    onBookingInitiated?.();
                    // Query invalidation handled by mutation's onSuccess callback
                },
                onError: (error) => {
                    setSubmitError(
                        'Failed to schedule session. Please try again.',
                    );
                },
            },
        );
    };

    useEffect(() => {
        if (coachAvailabilityViewModel?.mode === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [coachAvailabilityViewModel, router]);

    if (!coachAvailabilityViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachAvailabilityViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const coachAvailability = coachAvailabilityViewModel.data;

    return (
        <>
            <Dialog
                open={isDialogOpen}
                onOpenChange={(isDialogOpen) => {
                    if (!isDialogOpen) {
                        setNewSession(defaultSession);
                        setSubmitError(undefined);
                        setBriefing('');
                    }
                    setIsDialogOpen(isDialogOpen);
                }}
                defaultOpen={false}
            >
                <DialogContent
                    showCloseButton
                    closeOnOverlayClick
                    closeOnEscape
                >
                    <ScheduledOfferingContent
                        offering={newSession}
                        setOffering={setNewSession}
                        briefing={briefing}
                        setBriefing={setBriefing}
                        onSubmit={onSubmit}
                        isSubmitting={requestSessionMutation.isPending}
                        submitError={submitError}
                        bookingSuccess={bookingSuccess}
                        returnTo={returnTo}
                        courseSlug={courseSlug}
                        onReturnToCourse={() => {
                            if (returnTo) {
                                router.push(returnTo);
                            }
                        }}
                        onViewSessions={() => {
                            router.push('/workspace/coaching-sessions');
                        }}
                        closeDialog={() => {
                            setIsDialogOpen(false);
                            setNewSession(defaultSession);
                            setSubmitError(undefined);
                            setBookingSuccess(false);
                            setBriefing('');
                        }}
                    />
                </DialogContent>
            </Dialog>
            <div className="flex flex-col h-screen p-4 md:p-6">
                {returnTo && (
                    <div className="mb-4">
                        <Button
                            variant="text"
                            text="← Back to Course"
                            onClick={() => router.push(returnTo)}
                        />
                    </div>
                )}
                {/* Coach Header */}
                <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
                    <CoachHeader coachUsername={coachUsername} />
                </Suspense>
                {/* Desktop Layout: Calendar on left, AvailableCoachings on right */}
                <div className="max-h-full flex-row hidden md:flex gap-6">
                    <div className="rounded-lg bg-card-fill p-4 flex-1">
                        <Tabs.Root
                            defaultTab="weekly"
                            onValueChange={(value) => setViewType(value as 'weekly' | 'monthly')}
                        >
                            <CalendarNavigationHeader
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                                locale={locale}
                                viewType={viewType}
                                viewTabs={
                                    <Tabs.List className="bg-base-neutral-800 border border-base-neutral-700">
                                        <Tabs.Trigger value="weekly" isLast={false}>
                                            {calendarT('weeklyView')}
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value="monthly" isLast={true}>
                                            {calendarT('monthlyView')}
                                        </Tabs.Trigger>
                                    </Tabs.List>
                                }
                            />
                        </Tabs.Root>
                        {viewType === 'weekly' ? (
                            <WeeklyCoachCalendarWrapper
                                coachAvailabilityViewModel={
                                    coachAvailabilityViewModel
                                }
                                setNewSessionStart={setNewSessionStart}
                                openDialog={() => setIsDialogOpen(true)}
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                            />
                        ) : (
                            <MonthlyCoachCalendarWrapper
                                coachAvailabilityViewModel={coachAvailabilityViewModel}
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                                setNewSessionStart={setNewSessionStart}
                                openDialog={() => setIsDialogOpen(true)}
                                variant="full"
                            />
                        )}
                    </div>
                    <div className="w-[400px] shrink-0">
                        <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
                            <CoachingOfferingsPanel coachUsername={coachUsername} />
                        </Suspense>
                    </div>
                </div>
                {/* Mobile Layout: Calendar above, AvailableCoachings below */}
                <div className="flex flex-col md:hidden gap-4">
                    <MonthlyCoachCalendarWrapper
                        coachAvailabilityViewModel={coachAvailabilityViewModel}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        setNewSessionStart={setNewSessionStart}
                        openDialog={() => setIsDialogOpen(true)}
                    />
                    <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
                        <CoachingOfferingsPanel coachUsername={coachUsername} />
                    </Suspense>
                </div>
            </div>
        </>
    );
}

interface BookCoachWithSessionPageProps {
    coachUsername: string;
    sessionId: number | string;
    returnTo?: string;
    lessonComponentId?: string;
    courseSlug?: string;
}

function BookCoachWithSessionPage({
    coachUsername,
    sessionId,
    returnTo,
    lessonComponentId,
    courseSlug,
}: BookCoachWithSessionPageProps) {
    const locale = useLocale() as TLocale;

    const sessionIdNumber = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;

    // Track if booking was initiated to avoid showing error after successful request
    const [bookingInitiated, setBookingInitiated] = useState(false);

    const [coachingSessionResponse] =
        trpc.getStudentCoachingSession.useSuspenseQuery({ id: sessionIdNumber });

    const [coachingSessionViewModel, setCoachingSessionViewModel] = useState<
        viewModels.TStudentCoachingSessionViewModel | undefined
    >(undefined);

    const { presenter } = useGetStudentCoachingSessionPresenter(
        setCoachingSessionViewModel,
    );
    // @ts-ignore
    presenter.present(coachingSessionResponse, coachingSessionViewModel);

    if (!coachingSessionViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachingSessionViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const coachingSession = coachingSessionViewModel.data;

    // Guard against undefined data or session
    if (!coachingSession?.session) {
        return <DefaultError locale={locale} />;
    }

    // Only check unscheduled status if booking hasn't been initiated
    // After booking, status changes to 'requested' which would incorrectly trigger error
    // When bookingInitiated is true, we skip this check so user can continue viewing calendar
    if (coachingSession.session.status !== 'unscheduled' && !bookingInitiated) {
        return (
            <DefaultError
                locale={locale}
                title="Invalid request"
                description="This coaching session has been scheduled"
            />
        );
    }

    const coachingSessionId = typeof coachingSession.session.id === 'string'
        ? parseInt(coachingSession.session.id, 10)
        : coachingSession.session.id;

    const defaultSession: ScheduledOffering = {
        session: {
            id: coachingSessionId,
            name: coachingSession.session.coachingOfferingTitle,
            duration: coachingSession.session.coachingOfferingDuration,
        },
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-card-stroke rounded-md border border-neutral-700 p-4 w-full">
                <span className="text-text-secondary">Session: </span>
                <span className="font-bold text-text-primary">
                    {coachingSession.session.coachingOfferingTitle} (
                    {coachingSession.session.coachingOfferingDuration} minutes)
                </span>
            </div>
            <BookCoachPageContent
                coachUsername={coachUsername}
                defaultSession={defaultSession}
                returnTo={returnTo}
                lessonComponentId={lessonComponentId}
                courseSlug={courseSlug}
                onBookingInitiated={() => setBookingInitiated(true)}
            />
        </div>
    );
}

export default function BookCoachPage({
    coachUsername,
    sessionId,
    returnTo,
    lessonComponentId,
    courseSlug,
}: BookCoachPageProps) {
    if (sessionId) {
        return (
            <BookCoachWithSessionPage
                coachUsername={coachUsername}
                sessionId={sessionId}
                returnTo={returnTo}
                lessonComponentId={lessonComponentId}
                courseSlug={courseSlug}
            />
        );
    }

    return <BookCoachPageContent coachUsername={coachUsername} defaultSession={null} returnTo={returnTo} lessonComponentId={lessonComponentId} courseSlug={courseSlug} />;
}
