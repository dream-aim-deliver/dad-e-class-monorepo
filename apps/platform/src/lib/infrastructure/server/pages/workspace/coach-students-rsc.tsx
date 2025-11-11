import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import CoachStudents from '../../../client/pages/workspace/coach-students';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/cms-server';

export default async function CoachStudentsServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;
    const isCoachOrCourseCreator = roles && (roles.includes('coach') || roles.includes('admin'));

    if (!isCoachOrCourseCreator) {
        // TODO: fill in localized error message
        throw new Error('Access denied. Only coaches and course creators can access this page.');
    }

    // Streaming pattern: Fire prefetch without awaiting (TSK-PERF-007)
    prefetch(
        trpc.listCoachStudents.queryOptions({
            pagination: {
                page: 1,
                pageSize: 20,
            },
        }),
    );

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <CoachStudents roles={roles} />
                </Suspense>
            </HydrateClient>
        </>
    );
}
