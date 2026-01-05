import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    CoachingSessionItem,
    CoachingSessionTracker,
    CourseGeneralInformationView,
    DefaultError,
    DefaultLoading,
    CheckoutModal,
    type TransactionDraft,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTabContext } from 'packages/ui-kit/lib/components/tabs/tab-context';
import { StudentCourseTab } from '../../../utils/course-tabs';
import { trpc } from '../../../trpc/cms-client';
import { Suspense, useState, useEffect, useCallback } from 'react';
import { useListIncludedCoachingSessionsPresenter } from '../../../hooks/use-included-coaching-sessions-presenter';
import { usePrepareCheckoutPresenter } from '../../../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../../../hooks/use-checkout-intent';
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
}

function EnrolledCourseIntroductionContent(
    props: EnrolledCourseIntroductionProps,
) {
    const { courseViewModel, progressViewModel } = props;
    const locale = useLocale() as TLocale;
    const tabContext = useTabContext();
    const router = useRouter();

    if (courseViewModel.mode !== 'default' || (progressViewModel && progressViewModel.mode !== 'default')) {
        return <DefaultError locale={locale} />;
    }

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
                    name: '',
                    image: '',
                }}
                progress={progressViewModel?.data.progressPercent ?? 0}
                imageUrl={courseViewModel.data.imageFile?.downloadUrl ?? ''}
                students={courseViewModel.data.students.map((student) => ({
                    name: student.name,
                    avatarUrl: student.avatarUrl ?? '',
                }))}
                totalStudentCount={courseViewModel.data.studentCount}
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
            {/* <CourseIntroduction courseSlug={props.courseSlug} /> */}
            <CourseOutline courseSlug={props.courseSlug} />
        </div>
    );
}

function IncludedCoachingSessions({ 
    courseSlug,
    onPurchaseComponentCoaching,
    onBuySessions,
}: { 
    courseSlug: string;
    onPurchaseComponentCoaching?: (lessonComponentIds: string[]) => void;
    onBuySessions?: () => void;
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
            onClickBuySessions={() => {
                onBuySessions?.();
            }}
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

function StudentEnrolledCourseIntroduction(
    props: EnrolledCourseIntroductionProps,
) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const sessionDTO = useSession();
    const isLoggedIn = !!sessionDTO.data;

    // Checkout state management
    const [transactionDraft, setTransactionDraft] = useState<TransactionDraft | null>(null);
    const [currentRequest, setCurrentRequest] = useState<useCaseModels.TPrepareCheckoutRequest | null>(null);
    const [checkoutViewModel, setCheckoutViewModel] = useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isBuySessionsModalOpen, setIsBuySessionsModalOpen] = useState(false);

    // Get tRPC utils for fetching checkout data
    const utils = trpc.useUtils();

    // Checkout presenter
    const { presenter: checkoutPresenter } = usePrepareCheckoutPresenter(setCheckoutViewModel);

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

    // Watch for checkoutViewModel changes and open modal when ready
    useEffect(() => {
        if (checkoutViewModel && checkoutViewModel.mode === 'default') {
            setTransactionDraft(checkoutViewModel.data);
            setIsCheckoutOpen(true);
        }
    }, [checkoutViewModel]);

    // Checkout intent hook for login flow preservation
    const { saveIntent } = useCheckoutIntent({
        onResumeCheckout: executeCheckout,
    });

    // Helper to build purchase identifier from request (handles discriminated union)
    const getPurchaseIdentifier = (request: useCaseModels.TPrepareCheckoutRequest) => {
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
        const request: useCaseModels.TPrepareCheckoutRequest = {
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
        
        // Invalidate queries to refresh coaching sessions data after purchase
        utils.listIncludedCoachingSessions.invalidate({ courseSlug: props.courseSlug });
        utils.listCourseCoachingSessionPurchaseStatus.invalidate({ courseSlug: props.courseSlug });
        
        // TODO: Redirect to success page or show success message
    };

    return (
        <div className="flex flex-col space-y-10">
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <IncludedCoachingSessions 
                    courseSlug={props.courseSlug}
                    onPurchaseComponentCoaching={handlePurchaseComponentCoaching}
                    onBuySessions={() => setIsBuySessionsModalOpen(true)}
                />
            </Suspense>
            <EnrolledCourseIntroductionContent {...props} />

            {/* Buy Course Coaching Sessions Modal */}
            <BuyCourseCoachingSessionsModal
                isOpen={isBuySessionsModalOpen}
                onClose={() => setIsBuySessionsModalOpen(false)}
                courseSlug={props.courseSlug}
                locale={locale}
                onPurchase={handlePurchaseComponentCoaching}
            />

            {transactionDraft && currentRequest && currentRequest.purchaseType === 'StudentCourseCoachingSessionPurchase' && (
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

export default function EnrolledCourseIntroduction(
    props: EnrolledCourseIntroductionProps,
) {
    if (props.currentRole === 'student') {
        return <StudentEnrolledCourseIntroduction {...props} />;
    }

    return <EnrolledCourseIntroductionContent {...props} />;
}
