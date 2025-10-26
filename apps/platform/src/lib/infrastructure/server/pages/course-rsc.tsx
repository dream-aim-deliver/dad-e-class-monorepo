import { viewModels } from '@maany_shr/e-class-models';
import { createGetOffersPageOutlinePresenter } from '../presenter/get-offers-page-outline-presenter';
import { createGetPublicCourseDetailsPresenter } from '../presenter/get-public-course-details-presenter';
import { notFound, redirect } from 'next/navigation';
import AssessmentForm from '../../client/pages/course/assessment-form';
import EnrolledCourse from '../../client/pages/course/enrolled-course/enrolled-course';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import { getQueryClient, trpc, prefetch, HydrateClient } from '../config/trpc/cms-server';
import VisitorPage from '../../client/pages/course/visitor-page';
import { createGetCourseAccessPresenter } from '../presenter/get-course-access-presenter';
import CMSTRPCClientProviders from '../../client/trpc/cms-client-provider';
import { createListCourseReviewsPresenter } from '../presenter/list-course-reviews-presenter';
import { createGetCourseIntroductionPresenter } from '../presenter/get-course-introduction-presenter';
import { createGetCourseOutlinePresenter } from '../presenter/get-course-outline-presenter';
import { createGetCoursePackagesPresenter } from '../presenter/get-course-packages-presenter';
import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';


interface CourseServerComponentProps {
    slug: string;
    locale: TLocale;
    role?: string;
    tab?: string
}

export default async function CourseServerComponent({
    slug,
    locale,
    role,
    tab
}: CourseServerComponentProps) {
    const courseAccessViewModel = await fetchCourseAccess(slug);
    if (courseAccessViewModel.mode !== 'default') {
        throw new Error(courseAccessViewModel.data.message);
    }

    handleAccessModes(courseAccessViewModel);

    const { highestRole, roles, isAssessmentCompleted } =
        courseAccessViewModel.data;
    const highestRoleParsed = highestRole ?? 'visitor';
    validateUserRole(highestRoleParsed);

    if (highestRoleParsed === 'visitor') {
        return renderVisitorView(slug, locale);
    }

    const currentRole = role ?? highestRoleParsed;
    validateRoleAccess(currentRole, roles);

    if (shouldShowAssessment(currentRole, isAssessmentCompleted ?? false)) {
        return renderAssessmentForm(slug);
    }

    // TODO: might differ base on the tab
    await prefetchIntroductionData(slug, currentRole);

    return renderEnrolledCourse({ slug, roles, currentRole, tab });
}

async function fetchCourseAccess(
    slug: string,
): Promise<viewModels.TGetCourseAccessViewModel> {
    const queryOptions = trpc.getCourseAccess.queryOptions({
        courseSlug: slug,
    });
    const queryClient = getQueryClient();
    const courseAccessResponse = await queryClient.fetchQuery(queryOptions);

    let courseAccessViewModel: viewModels.TGetCourseAccessViewModel | undefined;
    const presenter = createGetCourseAccessPresenter((viewModel) => {
        courseAccessViewModel = viewModel;
    });

    // @ts-ignore
    await presenter.present(courseAccessResponse, courseAccessViewModel);

    if (!courseAccessViewModel) {
        // TODO: would we need to localize these error messages?
        throw new Error('Failed to load course access data');
    }
    return courseAccessViewModel;
}

function handleAccessModes(
    courseAccessViewModel: viewModels.TGetCourseAccessViewModel,
): void {
    switch (courseAccessViewModel.mode) {
        case 'not-found':
            notFound();
            break;
        case 'unauthenticated':
            redirect('/login');
            break;
        case 'default':
            // Continue with normal flow
            break;
        default:
            throw new Error(courseAccessViewModel.data.message);
    }
}

function validateUserRole(highestRole: string | undefined): void {
    if (!highestRole) {
        throw new Error('No user role found');
    }
}

function validateRoleAccess(currentRole: string, roles: string[]): void {
    if (!roles.includes(currentRole)) {
        throw new Error('Access denied for current role');
    }
}

function shouldShowAssessment(
    currentRole: string,
    isAssessmentCompleted: boolean | null,
): boolean {
    return (
        currentRole === 'student' &&
        isAssessmentCompleted !== null &&
        !isAssessmentCompleted
    );
}

async function renderAssessmentForm(slug: string) {
    await prefetch(
        trpc.listPreCourseAssessmentComponents.queryOptions({}),
    );

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <AssessmentForm courseSlug={slug} />
            </Suspense>
        </HydrateClient>
    );
}

async function prefetchIntroductionData(
    slug: string,
    currentRole: string,
): Promise<void> {
    const promises = [
        prefetch(
            trpc.getEnrolledCourseDetails.queryOptions({
                courseSlug: slug,
            }),
        ),
    ];

    if (currentRole === 'student') {
        promises.push(
            prefetch(
                trpc.getStudentProgress.queryOptions({
                    courseSlug: slug,
                }),
            ),
            prefetch(
                trpc.listIncludedCoachingSessions.queryOptions({
                    courseSlug: slug,
                }),
            ),
            prefetch(
                trpc.getCourseStatus.queryOptions({
                    courseSlug: slug,
                }),
            ),
            prefetch(
                trpc.getCourseCertificateData.queryOptions({
                    courseSlug: slug,
                }),
            ),
        );
    }

    await Promise.all(promises);
}

function renderEnrolledCourse({
    slug,
    roles,
    currentRole,
    tab,
}: {
    slug: string;
    roles: string[];
    currentRole: string;
    tab?: string;
}) {
    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <EnrolledCourse
                    courseSlug={slug}
                    roles={roles.filter((role) => role !== 'visitor')}
                    currentRole={currentRole}
                    tab={tab}
                />
            </Suspense>
        </HydrateClient>
    );
}

async function renderVisitorView(slug: string, locale: TLocale) {
    // Fetch all required data for visitor view serially
    const { courseDetails: visitorData,
        courseIntroduction: introductionData,
        offersCarousel: offersCarouselData,
        outline: outlineData, reviews: reviewsData,
        packages: packagesData
    } = await fetchVisitorCourseData(slug);

    // Ensure all required view models exist
    if (!visitorData || !introductionData || !outlineData || !reviewsData || !packagesData || !offersCarouselData) {
        throw new Error('Failed to load course data');
    }

    return (
        <CMSTRPCClientProviders>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <VisitorPage
                    courseData={visitorData}
                    introductionData={introductionData}
                    outlineData={outlineData}
                    reviewsData={reviewsData}
                    packagesData={packagesData}
                    offersCarouselData={offersCarouselData}
                    locale={locale}
                />
            </Suspense>
        </CMSTRPCClientProviders>
    );
}
async function fetchVisitorCourseData(slug: string) {
    const queryClient = await getQueryClient();

    //   TODO: 1. GetPublicCourseDetails - MOCK endpoint (no real backend available)
    const courseDetailsPromise = (async () => {
        const courseDetailsQuery = trpc.getPublicCourseDetails.queryOptions({
            courseSlug: slug,
        });
        const courseDetailsResponse = await queryClient.fetchQuery(courseDetailsQuery);

        let courseDetailViewModel: viewModels.TPublicCourseDetailsViewModel | undefined;

        const presenter = createGetPublicCourseDetailsPresenter((viewModel) => {
            courseDetailViewModel = viewModel;
        });

        // @ts-ignore
        await presenter.present(courseDetailsResponse, courseDetailViewModel);


        return courseDetailViewModel;
    })();


    const courseIntroductionPromise = (async () => {
        const courseIntroductionQuery = trpc.getCourseIntroduction.queryOptions({
            courseSlug: slug,
        });
        const courseIntroductionResponse = await queryClient.fetchQuery(courseIntroductionQuery);

        let courseIntroductionViewModel: viewModels.TCourseIntroductionViewModel | undefined;
        const presenter = createGetCourseIntroductionPresenter((viewModel) => {
            courseIntroductionViewModel = viewModel;
        });

        // @ts-ignore
        await presenter.present(courseIntroductionResponse, courseIntroductionViewModel);


        return courseIntroductionViewModel;
    })();

    // 3. GetCourseOutline - MOCK endpoint (using mock for visitor access)
    const courseOutlinePromise = (async () => {
        const courseOutlineQuery = trpc.getCourseOutline.queryOptions({
            courseSlug: slug,
        });
        const courseOutlineResponse = await queryClient.fetchQuery(courseOutlineQuery);

        let courseOutlineViewModel: viewModels.TCourseOutlineViewModel | undefined;
        const presenter = createGetCourseOutlinePresenter((viewModel) => {
            courseOutlineViewModel = viewModel;
        });

        // @ts-ignore
        await presenter.present(courseOutlineResponse, courseOutlineViewModel);


        return courseOutlineViewModel;
    })();

    // 4. ListCourseReviews - MOCK endpoint
    const courseReviewsPromise = (async () => {
        const courseReviewsQuery = trpc.listCourseReviews.queryOptions({
            courseSlug: slug,
        });
        const courseReviewsResponse = await queryClient.fetchQuery(courseReviewsQuery);

        let courseReviewsViewModel: viewModels.TCourseReviewsViewModel | undefined;
        const presenter = createListCourseReviewsPresenter((viewModel) => {
            courseReviewsViewModel = viewModel;
        });

        // @ts-ignore
        await presenter.present(courseReviewsResponse, courseReviewsViewModel);


        return courseReviewsViewModel;
    })();

    // 5. GetCoursePackages - MOCK endpoint
    const coursePackagesPromise = (async () => {
        const coursePackagesQuery = trpc.getCoursePackages.queryOptions({
            courseSlug: slug,
        });
        const coursePackagesResponse = await queryClient.fetchQuery(coursePackagesQuery);

        let coursePackagesViewModel: viewModels.TCoursePackagesViewModel | undefined;
        const presenter = createGetCoursePackagesPresenter((viewModel) => {
            coursePackagesViewModel = viewModel;
        });

        // @ts-ignore
        await presenter.present(coursePackagesResponse, coursePackagesViewModel);


        return coursePackagesViewModel;
    })();

    // 6. GetOffersPageOutline - MOCK endpoint (consistent with other course data)
    const offersCarouselPromise = (async () => {
        const offersCarouselQuery = trpc.getOffersPageOutline.queryOptions({});
        const offersCarouselResponse = await queryClient.fetchQuery(offersCarouselQuery);

        let offersCarouselViewModel: viewModels.TGetOffersPageOutlineViewModel | undefined;
        const presenter = createGetOffersPageOutlinePresenter((viewModel) => {
            offersCarouselViewModel = viewModel;
        });

        // @ts-ignore
        await presenter.present(offersCarouselResponse, offersCarouselViewModel);

        return offersCarouselViewModel;
    })();

    // Execute all promises in parallel
    const [
        courseDetailsViewModel,
        courseIntroductionViewModel,
        courseOutlineViewModel,
        courseReviewsViewModel,
        coursePackagesViewModel,
        offersCarouselViewModel,
    ] = await Promise.all([
        courseDetailsPromise,
        courseIntroductionPromise,
        courseOutlinePromise,
        courseReviewsPromise,
        coursePackagesPromise,
        offersCarouselPromise,
    ]);

    // Combine and return transformed view models
    return {
        courseDetails: courseDetailsViewModel,
        courseIntroduction: courseIntroductionViewModel,
        outline: courseOutlineViewModel,
        reviews: courseReviewsViewModel,
        packages: coursePackagesViewModel,
        offersCarousel: offersCarouselViewModel,
    };
}
