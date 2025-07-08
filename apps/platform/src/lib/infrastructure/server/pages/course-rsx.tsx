import { viewModels } from '@maany_shr/e-class-models';
import { createGetCourseAccessPresenter } from '../presenter/get-course-access-presenter';
import { getQueryClient, prefetch, trpc } from '../config/trpc/server';
import { notFound, redirect } from 'next/navigation';
import AssessmentForm from '../../client/pages/course/assessment-form';
import EnrolledCourse from '../../client/pages/course/enrolled-course/enrolled-course';
import { propagateServerField } from 'next/dist/server/lib/render-server';

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

    const { highestRole, roles, isAssessmentCompleted } =
        courseAccessViewModel.data;

    if (!highestRole) {
        throw new Error();
    }

    if (highestRole === 'visitor') {
        return <div>Visitor View</div>;
    }

    const currentRole = role ?? highestRole;
    if (!(roles as string[]).includes(currentRole)) {
        throw new Error();
    }

    if (currentRole === 'student') {
        if (isAssessmentCompleted !== null && !isAssessmentCompleted) {
            await prefetch(
                trpc.listAssessmentComponents.queryOptions({
                    courseSlug: slug,
                }),
            );
            return <AssessmentForm courseSlug={slug} />;
        }
    }

    return (
        <EnrolledCourse
            courseSlug={slug}
            roles={roles.filter((role) => role !== 'visitor')}
            currentRole={currentRole}
            tab={tab}
        />
    );
}
