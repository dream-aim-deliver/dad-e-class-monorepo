import { viewModels } from '@maany_shr/e-class-models';
import { createGetCourseAccessPresenter } from '../presenter/get-course-access-presenter';
import { getQueryClient, trpc } from '../config/trpc/server';
import { notFound, redirect } from 'next/navigation';
import AssessmentForm from '../../client/pages/course/assessment-form';

interface CourseServerComponentProps {
    slug: string;
}

export default async function CourseServerComponent({
    slug,
}: CourseServerComponentProps) {
    const queryOptions = trpc.getCourseAccess.queryOptions({
        courseSlug: slug,
    });
    const queryClient = getQueryClient();
    const courseAccessResponse = await queryClient.fetchQuery(queryOptions);

    let courseAccessViewModel: viewModels.TCourseAccessViewModel | undefined;
    const presenter = createGetCourseAccessPresenter((viewModel) => {
        courseAccessViewModel = viewModel;
    });
    await presenter.present(courseAccessResponse, courseAccessViewModel);

    if (!courseAccessViewModel) {
        throw new Error();
    }

    if (courseAccessViewModel.mode === 'not-found') {
        notFound();
    }

    if (courseAccessViewModel.mode === 'unauthenticated') {
        redirect('/login');
    }

    if (courseAccessViewModel.mode !== 'default') {
        throw new Error(courseAccessViewModel.data.message);
    }

    if (!courseAccessViewModel.data.highestRole) {
        throw new Error();
    }

    if (courseAccessViewModel.data.highestRole === 'visitor') {
        return <div>Visitor View</div>;
    }

    if (courseAccessViewModel.data.highestRole === 'student') {
        if (courseAccessViewModel.data.isAssessmentCompleted || courseAccessViewModel.data.isAssessmentCompleted === null) {
            return <div>Student View</div>;
        } else {
            return <AssessmentForm courseSlug={slug} />;
        }
    }

    return (
        <div>
            <h1>Course Access</h1>
            <p>Roles: {courseAccessViewModel.data.roles.join(', ')}</p>
            <p>
                Is Assessment Completed:{' '}
                {courseAccessViewModel.data.isAssessmentCompleted
                    ? 'Yes'
                    : 'No'}
            </p>
        </div>
    );
}
