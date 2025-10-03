import { viewModels } from '@maany_shr/e-class-models';
import { createGetCourseAccessPresenter } from '../presenter/get-course-access-presenter';
import { notFound, redirect } from 'next/navigation';
import AssessmentForm from '../../client/pages/course/assessment-form';
import EnrolledCourse from '../../client/pages/course/enrolled-course/enrolled-course';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import { getQueryClient, getServerTRPC, prefetch } from '../config/trpc/cms-server';
import { trpc as trpcMock, HydrateClient, prefetch as prefetchMock } from '../config/trpc/server';

interface CourseServerComponentProps {
    slug: string;
    role?: string;
    tab?: string;
}

export default async function CourseServerComponent({
    slug,
    role,
    tab,
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
        return renderVisitorView(slug);
    }

    const currentRole = role ?? highestRoleParsed;
    validateRoleAccess(currentRole, roles);

    if (shouldShowAssessment(currentRole, isAssessmentCompleted)) {
        return renderAssessmentForm(slug);
    }

    // TODO: might differ base on the tab
    await prefetchIntroductionData(slug, currentRole);

    return renderEnrolledCourse({ slug, roles, currentRole, tab });
}

async function fetchCourseAccess(
    slug: string,
): Promise<viewModels.TCourseAccessViewModel> {
    const trpc = getServerTRPC();
    const queryOptions = trpc.getCourseAccess.queryOptions({
        courseSlug: slug,
    });
    const queryClient = getQueryClient();
    const courseAccessResponse = await queryClient.fetchQuery(queryOptions);

    let courseAccessViewModel: viewModels.TCourseAccessViewModel | undefined;
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
    courseAccessViewModel: viewModels.TCourseAccessViewModel,
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
    await prefetchMock(
        trpcMock.listPreCourseAssessmentComponents.queryOptions({}),
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
    const trpc = getServerTRPC();
    const promises = [
        prefetch(
            trpc.getEnrolledCourseDetails.queryOptions({
                courseSlug: slug,
            }),
        ),
    ];

    if (currentRole === 'student') {
        promises.push(
            prefetchMock(
                trpcMock.getStudentProgress.queryOptions({
                    courseSlug: slug,
                }),
            ),
            prefetchMock(
                trpcMock.listIncludedCoachingSessions.queryOptions({
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

function renderVisitorView(slug: string) {
    return <div>Visitor View</div>;
}
