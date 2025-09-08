import { HydrateClient } from '../../config/trpc/server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import EditPreCourseAssessment from '../../../client/pages/workspace/edit-pre-course-assessment';

export default async function EditPreCourseAssessmentServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    if (!session.user.roles?.includes('admin')) {
        // TODO: fill in localized error message
        throw new Error('You do not have permission to access this page');
    }

    // TODO: possibly prefetch duplication course

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <EditPreCourseAssessment />
                </Suspense>
            </HydrateClient>
        </>
    );
}
