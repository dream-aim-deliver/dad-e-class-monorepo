import { viewModels } from '@maany_shr/e-class-models';
import { createGetCourseAccessPresenter } from '../../presenter/get-course-access-presenter';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import EditCourse from '../../../client/pages/workspace/edit/edit-course';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { getQueryClient, HydrateClient, trpc } from '../../config/trpc/cms-server';

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

    if (highestRoleParsed !== 'admin' && highestRoleParsed !== 'course_creator') {
        // TODO: localize this error message
        throw new Error('You can\'t edit this course');
    }

    // TODO: prefetch any necessary data

    return (
        <Suspense fallback={<DefaultLoadingWrapper />}>
            <HydrateClient>
                <EditCourse slug={slug} defaultTab={defaultTab} />
            </HydrateClient>
        </Suspense>
    );
}

async function fetchCourseAccess(
    slug: string,
): Promise<viewModels.TCourseAccessViewModel> {
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
