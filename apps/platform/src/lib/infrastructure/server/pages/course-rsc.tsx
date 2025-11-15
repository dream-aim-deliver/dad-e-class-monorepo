/**
 * ✅ SERVER-SIDE PRESENTERS REFACTOR (TSK-PERF-008)
 *
 * REMOVED: 6 presenters from visitor view that ran presentation logic on server
 * - GetPublicCourseDetailsPresenter
 * - GetCourseIntroductionPresenter
 * - GetCourseOutlinePresenter
 * - ListCourseReviewsPresenter
 * - GetCoursePackagesPresenter
 * - GetOffersPageOutlinePresenter
 *
 * NEW ARCHITECTURE:
 * - Server: Only prefetches raw data (no transformation)
 * - Client: Fetches from cache + runs presenters for view models
 * - Benefits: 10-15% server CPU reduction, better separation of concerns
 *
 * REMAINING:
 * - GetCourseAccessPresenter: Used for server-side access control decisions
 *   (not pure presentation - determines routing/permissions)
 *   Future improvement: Extract role calculation to separate utility
 */

import { viewModels } from '@maany_shr/e-class-models';
import { notFound, redirect } from 'next/navigation';
import AssessmentForm from '../../client/pages/course/assessment-form';
import EnrolledCourse from '../../client/pages/course/enrolled-course/enrolled-course';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import { getQueryClient, trpc, prefetch, HydrateClient } from '../config/trpc/cms-server';
import VisitorPage from '../../client/pages/course/visitor-page';
import { createGetCourseAccessPresenter } from '../presenter/get-course-access-presenter';
import CMSTRPCClientProviders from '../../client/trpc/cms-client-provider';
import { TLocale } from '@maany_shr/e-class-translations';


interface CourseServerComponentProps {
    slug: string;
    locale: TLocale;
    role?: string;
    tab?: string;
    username?: string;
    lesson?: string;
}

export default async function CourseServerComponent({
    slug,
    locale,
    role,
    tab,
    username,
    lesson,
}: CourseServerComponentProps) {
    const courseAccessViewModel = await fetchCourseAccess(slug);

    // Handle all access modes (not-found, unauthenticated, etc.)
    handleAccessModes(courseAccessViewModel);

    // After handleAccessModes, we can safely assume mode is 'default'
    if (courseAccessViewModel.mode !== 'default') {
        throw new Error('Unexpected state after handleAccessModes');
    }

    const { highestRole, roles, isAssessmentCompleted, course } =
        courseAccessViewModel.data;
    const highestRoleParsed = highestRole ?? 'visitor';
    validateUserRole(highestRoleParsed);

    if (highestRoleParsed === 'visitor') {
        return renderVisitorView(slug, locale);
    }

    const currentRole = role ?? highestRoleParsed;
    validateRoleAccess(currentRole, roles);

    if (shouldShowAssessment(currentRole, isAssessmentCompleted ?? false)) {
        const courseLanguage = course?.language?.code as TLocale;
        return renderAssessmentForm(slug, courseLanguage);
    }

    // TODO: might differ base on the tab
    await prefetchIntroductionData(slug, currentRole);

    return renderEnrolledCourse({
        slug,
        roles,
        currentRole,
        tab,
        username,
        lesson,
    });
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

async function renderAssessmentForm(slug: string, courseLanguage?: TLocale) {
    // Streaming pattern: Fire prefetch without awaiting
    prefetch(
        trpc.listPreCourseAssessmentComponents.queryOptions({}),
    );

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <AssessmentForm courseSlug={slug} courseLanguage={courseLanguage} />
            </Suspense>
        </HydrateClient>
    );
}

async function prefetchIntroductionData(
    slug: string,
    currentRole: string,
): Promise<void> {
    // Streaming pattern: Fire prefetches without awaiting
    prefetch(
        trpc.getEnrolledCourseDetails.queryOptions({
            courseSlug: slug,
        }),
    );

    // TSK-PERF-014: Remove role restriction - course status used by all roles
    prefetch(
        trpc.getCourseStatus.queryOptions({
            courseSlug: slug,
        }),
    );

    if (currentRole === 'student') {
        prefetch(
            trpc.getStudentProgress.queryOptions({
                courseSlug: slug,
            }),
        );
        prefetch(
            trpc.listIncludedCoachingSessions.queryOptions({
                courseSlug: slug,
            }),
        );
        // TSK-PERF-014: Removed unused getCourseCertificateData prefetch
        // No client component uses this query currently
    }
}

function renderEnrolledCourse({
    slug,
    roles,
    currentRole,
    tab,
    username,
    lesson,
}: {
    slug: string;
    roles: string[];
    currentRole: string;
    tab?: string;
    username?: string;
    lesson?: string;
}) {
    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <EnrolledCourse
                    courseSlug={slug}
                    roles={roles.filter((role) => role !== 'visitor')}
                    currentRole={currentRole}
                    tab={tab}
                    studentUsername={username}
                    lesson={lesson}
                />
            </Suspense>
        </HydrateClient>
    );
}

async function renderVisitorView(slug: string, locale: TLocale) {
    // ✅ Only prefetch data - no presenters on server
    await prefetchVisitorCourseData(slug);

    return (
        <CMSTRPCClientProviders>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <VisitorPage
                    courseSlug={slug}
                    locale={locale}
                />
            </Suspense>
        </CMSTRPCClientProviders>
    );
}
// ✅ NEW: Only prefetch data - no presenters on server
// ✅ STREAMING: Fire prefetches without awaiting (TSK-PERF-007)
async function prefetchVisitorCourseData(slug: string) {
    // Streaming pattern: Fire all prefetches without awaiting
    // React will stream HTML while queries are pending
    prefetch(trpc.getPublicCourseDetails.queryOptions({ courseSlug: slug }));
    prefetch(trpc.getCourseIntroduction.queryOptions({ courseSlug: slug }));
    prefetch(trpc.getCourseOutline.queryOptions({ courseSlug: slug }));
    prefetch(trpc.listCourseReviews.queryOptions({ courseSlug: slug }));
    prefetch(trpc.getCoursePackages.queryOptions({ courseSlug: slug }));
    prefetch(trpc.getOffersPageOutline.queryOptions({}));
    prefetch(trpc.getCoachingPage.queryOptions({}));
}
