import { viewModels } from '@maany_shr/e-class-models';
import { TPrepareCheckoutRequest, TPrepareCheckoutUseCaseResponse } from '@dream-aim-deliver/e-class-cms-rest';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import {
    CoachingSessionItem,
    CoachingSessionTracker,
    CourseGeneralInformationView,
    DefaultError,
    DefaultLoading,
    CheckoutModal,
    Banner,
    Button,
    type TransactionDraft,
    type CouponValidationResult,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTabContext } from 'packages/ui-kit/lib/components/tabs/tab-context';
import { StudentCourseTab } from '../../../utils/course-tabs';
import { trpc } from '../../../trpc/cms-client';
import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { useListIncludedCoachingSessionsPresenter } from '../../../hooks/use-included-coaching-sessions-presenter';
import { useListCoachesPresenter } from '../../../hooks/use-coaches-presenter';
import { usePrepareCheckoutPresenter } from '../../../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../../../hooks/use-checkout-intent';
import { useCheckoutErrors, createCheckoutErrorViewModel, getCheckoutErrorMode } from '../../../hooks/use-checkout-errors';
import { useListRequiredCoursesPresenter } from '../../../hooks/use-list-required-courses-presenter';
import { useSession } from 'next-auth/react';
import env from '../../../config/env';
import CourseIntroduction from '../../common/course-introduction';
import CourseOutline from '../../common/course-outline';
import BuyCourseCoachingSessionsModal from './buy-course-coaching-sessions-modal';

interface EnrolledCourseIntroductionProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
    progressViewModel?: viewModels.TStudentProgressViewModel;
    currentRole: string;
    courseSlug: string;
    isArchived?: boolean;
}

function EnrolledCourseIntroductionContent(
    props: EnrolledCourseIntroductionProps,
) {
    const { courseViewModel, progressViewModel } = props;
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.enrolledCourse');
    const tabContext = useTabContext();
    const router = useRouter();

    // Fetch coaches (already prefetched by RSC)
    const [coachesResponse] = trpc.listCoaches.useSuspenseQuery({
        courseSlug: props.courseSlug,
        sortPreferredFirst: true,
    });
    const [coachesViewModel, setCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);
    const { presenter: coachesPresenter } = useListCoachesPresenter(setCoachesViewModel);
    // @ts-ignore
    coachesPresenter.present(coachesResponse, coachesViewModel);

    const coaches = useMemo(() => {
        if (coachesViewModel?.mode === 'default') {
            return coachesViewModel.data.coaches.map((c) => ({
                name: `${c.name} ${c.surname}`.trim(),
                avatarUrl: c.avatarUrl ?? '',
            }));
        }
        return [];
    }, [coachesViewModel]);

    if (courseViewModel.mode !== 'default' || (progressViewModel && progressViewModel.mode !== 'default')) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    const handleClickRequiredCourse = (slug: string) => {
        window.open(`/${locale}/courses/${slug}`, '_blank');
    };

    return (
        <div className="flex flex-col space-y-10">
            <CourseGeneralInformationView
                // These fields aren't utilized and are coming from a common model
                title={''}
                description={''}
                showProgress={progressViewModel !== undefined}
                language={{
                    name: '',
                    code: '',
                }}
                pricing={{
                    fullPrice: 0,
                    partialPrice: 0,
                    currency: '',
                }}
                locale={locale}
                longDescription={courseViewModel.data.description}
                duration={{
                    video: courseViewModel.data.duration.video ?? 0,
                    coaching: courseViewModel.data.duration.coaching ?? 0,
                    selfStudy: courseViewModel.data.duration.selfStudy ?? 0,
                }}
                rating={courseViewModel.data.author.averageRating}
                author={{
                    name: `${courseViewModel.data.author.name} ${courseViewModel.data.author.surname}`.trim(),
                    image: courseViewModel.data.author.avatarUrl ?? '',
                }}
                progress={progressViewModel?.data.progressPercent ?? 0}
                imageUrl={courseViewModel.data.imageFile?.downloadUrl ?? ''}
                coaches={coaches}
                onClickAuthor={() => {
                    router.push(
                        `/coaches/${courseViewModel.data.author.username}`,
                    );
                }}
                onClickResume={() => {
                    tabContext.setActiveTab(StudentCourseTab.STUDY);
                }}
                onClickReview={() => {
                    // TODO: add a callback
                }}
            />
            <Suspense fallback={<DefaultLoading locale={locale} variant="minimal" />}>
                <RequiredCourses
                    courseId={courseViewModel.data.id}
                    onClickRequiredCourse={handleClickRequiredCourse}
                />
            </Suspense>
            {/* <CourseIntroduction courseSlug={props.courseSlug} /> */}
            <CourseOutline courseSlug={props.courseSlug} />
        </div>
    );
}

function IncludedCoachingSessions({
    courseSlug,
    onPurchaseComponentCoaching,
    onBuySessions,
    isArchived,
}: {
    courseSlug: string;
    onPurchaseComponentCoaching?: (lessonComponentIds: string[]) => void;
    onBuySessions?: () => void;
    isArchived?: boolean;
}) {
    const [coachingSessionsResponse] =
        trpc.listIncludedCoachingSessions.useSuspenseQuery({
            courseSlug: courseSlug,
        });

    const [coachingSessionsViewModel, setCoachingSessionsViewModel] = useState<
        viewModels.TIncludedCoachingSessionListViewModel | undefined
    >(undefined);
    const { presenter } = useListIncludedCoachingSessionsPresenter(
        setCoachingSessionsViewModel,
    );
    // @ts-ignore
    presenter.present(coachingSessionsResponse, coachingSessionsViewModel);

    const locale = useLocale() as TLocale;

    if (!coachingSessionsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // If there is an error, nothing is rendered
    if (coachingSessionsViewModel.mode !== 'default') {
        return;
    }

    const offers = coachingSessionsViewModel.data.offers;

    return (
        <CoachingSessionTracker
            locale={locale}
            // Don't show buy sessions button for archived courses
            onClickBuySessions={isArchived ? undefined : () => onBuySessions?.()}
        >
            {offers.map((offer) => (
                <CoachingSessionItem
                    key={offer.name}
                    used={offer.usedCount}
                    included={offer.usedCount + offer.availableIds.length}
                    title={offer.name}
                    duration={offer.duration}
                    locale={locale}
                    // Fields below are not used in the component, but required by the type
                    description={''}
                    currency={''}
                    price={0}
                />
            ))}
        </CoachingSessionTracker>
    );
}

function RequiredCourses({
    courseId,
    onClickRequiredCourse,
}: {
    courseId: number;
    onClickRequiredCourse: (slug: string) => void;
}) {
    const [requiredCoursesResponse] = trpc.listRequiredCourses.useSuspenseQuery({
        courseId,
    });

    const [requiredCoursesViewModel, setRequiredCoursesViewModel] = useState<
        viewModels.TListRequiredCoursesViewModel | undefined
    >(undefined);
    const { presenter } = useListRequiredCoursesPresenter(setRequiredCoursesViewModel);
    // @ts-ignore
    presenter.present(requiredCoursesResponse, requiredCoursesViewModel);

    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);

    if (!requiredCoursesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // If there is an error, render nothing
    if (requiredCoursesViewModel.mode !== 'default') {
        return null;
    }

    const requiredCourses = requiredCoursesViewModel.data.requiredCourses ?? [];

    // Don't show section if no requirements
    if (requiredCourses.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-1 items-start w-full">
            <h6 className="text-text-primary text-lg">
                {dictionary.components.courseGeneralInformationView.requirementsTitle}
            </h6>
            <p className="text-text-secondary">
                {dictionary.components.courseGeneralInformationView.requirementsDetails}
            </p>
            <div className="flex flex-wrap gap-3">
                {requiredCourses.map((course) => (
                    <Button
                        key={course.id}
                        className="p-0 gap-1 text-sm sm:w-auto truncate"
                        size="small"
                        variant="text"
                        text={course.title}
                        onClick={() => onClickRequiredCourse(course.slug)}
                    />
                ))}
            </div>
        </div>
    );
}

function StudentEnrolledCourseIntroduction(
    props: EnrolledCourseIntroductionProps,
) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const { getCheckoutErrorTitle, getCheckoutErrorDescription } = useCheckoutErrors();
    const sessionDTO = useSession();
    const isLoggedIn = !!sessionDTO.data;

    // Checkout state management
    const [transactionDraft, setTransactionDraft] = useState<TransactionDraft | null>(null);
    const [currentRequest, setCurrentRequest] = useState<TPrepareCheckoutRequest | null>(null);
    const [checkoutViewModel, setCheckoutViewModel] = useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
    const [checkoutError, setCheckoutError] = useState<viewModels.TPrepareCheckoutViewModel | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isBuySessionsModalOpen, setIsBuySessionsModalOpen] = useState(false);

    // Get tRPC utils for fetching checkout data
    const utils = trpc.useUtils();

    // Checkout presenter
    const { presenter: checkoutPresenter } = usePrepareCheckoutPresenter(setCheckoutViewModel);

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

    // Checkout intent hook for login flow preservation
    const { saveIntent } = useCheckoutIntent({
        onResumeCheckout: executeCheckout,
    });

    // Helper to build purchase identifier from request (handles discriminated union)
    const getPurchaseIdentifier = (request: TPrepareCheckoutRequest) => {
        switch (request.purchaseType) {
            case 'StudentCourseCoachingSessionPurchase':
                return {
                    courseSlug: request.courseSlug,
                    lessonComponentIds: request.lessonComponentIds,
                };
            case 'StudentCoachingSessionPurchase':
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
        }
    };

    // Handle purchase of coaching for lesson components
    const handlePurchaseComponentCoaching = useCallback((lessonComponentIds: string[]) => {
        const request: TPrepareCheckoutRequest = {
            purchaseType: 'StudentCourseCoachingSessionPurchase',
            courseSlug: props.courseSlug,
            lessonComponentIds: lessonComponentIds,
        };

        // If user is not logged in, save intent and redirect to login
        if (!isLoggedIn) {
            saveIntent(request, window.location.pathname);
            router.push(
                `/${locale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
            );
            return;
        }

        // Close the buy sessions modal
        setIsBuySessionsModalOpen(false);

        // User is logged in, execute checkout
        executeCheckout(request);
    }, [props.courseSlug, isLoggedIn, saveIntent, router, locale, executeCheckout]);

    const handlePaymentComplete = (sessionId: string) => {
        setIsCheckoutOpen(false);
        setTransactionDraft(null);
        setCheckoutViewModel(undefined);
        setCurrentRequest(null);

        // Invalidate queries to refresh coaching sessions data after purchase
        utils.listIncludedCoachingSessions.invalidate({ courseSlug: props.courseSlug });
        utils.listCourseCoachingSessionPurchaseStatus.invalidate({ courseSlug: props.courseSlug });

        // TODO: Redirect to success page or show success message
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

    return (
        <div className="flex flex-col space-y-10">
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
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <IncludedCoachingSessions
                    courseSlug={props.courseSlug}
                    onPurchaseComponentCoaching={handlePurchaseComponentCoaching}
                    onBuySessions={() => setIsBuySessionsModalOpen(true)}
                    isArchived={props.isArchived}
                />
            </Suspense>
            <EnrolledCourseIntroductionContent {...props} />

            {/* Buy Course Coaching Sessions Modal - not shown for archived courses */}
            {!props.isArchived && (
                <BuyCourseCoachingSessionsModal
                    isOpen={isBuySessionsModalOpen}
                    onClose={() => setIsBuySessionsModalOpen(false)}
                    courseSlug={props.courseSlug}
                    locale={locale}
                    onPurchase={handlePurchaseComponentCoaching}
                />
            )}

            {transactionDraft && currentRequest && currentRequest.purchaseType === 'StudentCourseCoachingSessionPurchase' && (
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

export default function EnrolledCourseIntroduction(
    props: EnrolledCourseIntroductionProps,
) {
    if (props.currentRole === 'student') {
        return <StudentEnrolledCourseIntroduction {...props} />;
    }

    return <EnrolledCourseIntroductionContent {...props} />;
}
