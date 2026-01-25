import { viewModels } from '@maany_shr/e-class-models';
import { createGetCourseAccessPresenter } from '../../presenter/get-course-access-presenter';
import EnrolledCourseDetailsPresenter from '../../../common/presenters/enrolled-course-details-presenter';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import EditCourse from '../../../client/pages/workspace/edit/edit-course';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { getQueryClient, HydrateClient, trpc, prefetch } from '../../config/trpc/cms-server';

interface CourseServerComponentProps {
    slug: string;
    defaultTab?: string;
}

export default async function EditCourseServerComponent({
    slug,
    defaultTab,
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

    if (highestRoleParsed !== 'superadmin' && highestRoleParsed !== 'admin' && highestRoleParsed !== 'course_creator') {
        // TODO: localize this error message
        throw new Error('You can\'t edit this course');
    }

    // Streaming pattern: Fire prefetches without awaiting (TSK-PERF-007)
    // All data needed across tabs - React will stream HTML while queries are pending

    // General Tab data - need courseId for listRequiredCourses
    const enrolledCourseViewModel = await fetchEnrolledCourseDetails(slug);
    const courseId = enrolledCourseViewModel.mode === 'default' ? enrolledCourseViewModel.data.id : 0;

    prefetch(trpc.listTopics.queryOptions({}));
    prefetch(trpc.listCategories.queryOptions({}));
    prefetch(trpc.listPlatformCoursesShort.queryOptions({}));
    if (courseId > 0) {
        prefetch(trpc.listRequiredCourses.queryOptions({ courseId }));
    }

    // Intro/Outline Tab data
    prefetch(trpc.getCourseIntroduction.queryOptions({
        courseSlug: slug,
    }));
    prefetch(trpc.getCourseOutline.queryOptions({
        courseSlug: slug,
    }));

    // Course Content Tab data
    prefetch(trpc.getCourseStructure.queryOptions({
        courseSlug: slug,
    }));

    return (
        <Suspense fallback={<DefaultLoadingWrapper />}>
            <HydrateClient>
                <EditCourse slug={slug} defaultTab={defaultTab} roles={roles} />
            </HydrateClient>
        </Suspense>
    );
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

async function fetchEnrolledCourseDetails(
    slug: string,
): Promise<viewModels.TEnrolledCourseDetailsViewModel> {
    const queryOptions = trpc.getEnrolledCourseDetails.queryOptions({
        courseSlug: slug,
    });
    const queryClient = getQueryClient();
    const enrolledCourseResponse = await queryClient.fetchQuery(queryOptions);

    let enrolledCourseViewModel: viewModels.TEnrolledCourseDetailsViewModel | undefined;
    const presenter = new EnrolledCourseDetailsPresenter((viewModel) => {
        enrolledCourseViewModel = viewModel;
    }, {});

    // @ts-ignore
    await presenter.present(enrolledCourseResponse, enrolledCourseViewModel);

    if (!enrolledCourseViewModel) {
        throw new Error('Failed to load enrolled course data');
    }

    return enrolledCourseViewModel;
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