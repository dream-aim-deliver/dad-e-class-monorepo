import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/cms-server';
import StudentCoachingSessions from '../../../client/pages/workspace/student-coaching-sessions';
import CoachCoachingSessions from '../../../client/pages/workspace/coach-coaching-sessions';

export default async function CoachingSessionsServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;

    if (roles && roles.includes('coach')) {
        prefetch(trpc.listCoachCoachingSessions.queryOptions({}));

        return (
            <>
                <HydrateClient>
                    <Suspense fallback={<DefaultLoadingWrapper />}>
                        <CoachCoachingSessions />
                    </Suspense>
                </HydrateClient>
            </>
        );
    } else if (roles && roles.includes('student')) {
        prefetch(trpc.listStudentCoachingSessions.queryOptions({ includeAllPlatforms: true }));

        return (
            <>
                <HydrateClient>
                    <Suspense fallback={<DefaultLoadingWrapper />}>
                        <StudentCoachingSessions />
                    </Suspense>
                </HydrateClient>
            </>
        );
    } else {
        throw new Error('Access denied for current role');
    }
}
