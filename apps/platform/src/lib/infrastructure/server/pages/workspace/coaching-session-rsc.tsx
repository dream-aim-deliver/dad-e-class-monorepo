import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/cms-server';
import StudentCoachingSessions from '../../../client/pages/workspace/student-coaching-sessions';
import CoachCoachingSessions from '../../../client/pages/workspace/coach-coaching-sessions';

interface CoachingSessionsServerComponentProps {
    role?: string;
}

export default async function CoachingSessionsServerComponent(props: CoachingSessionsServerComponentProps) {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;
    const userRole = props.role || 'coach'; // Get role from props or default to coach

    // Handle coach role
    if (roles && roles.includes('coach') && userRole === 'coach') {
        // Streaming pattern: Fire prefetch without awaiting (TSK-PERF-007)
        prefetch(trpc.listCoachCoachingSessions.queryOptions({}));

        return (
            <>
                <HydrateClient>
                    <Suspense fallback={<DefaultLoadingWrapper />}>
                        <CoachCoachingSessions role={userRole} />
                    </Suspense>
                </HydrateClient>
            </>
        );
    } else if (roles && roles.includes('student')) {
        await Promise.all([prefetch(trpc.listStudentCoachingSessions.queryOptions({}))]);

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
