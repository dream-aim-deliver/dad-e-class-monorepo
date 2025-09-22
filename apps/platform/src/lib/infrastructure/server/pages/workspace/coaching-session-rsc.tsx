import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/server';
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

    // Only allow coach role - return empty for any other role
    if (roles && roles.includes('coach') && userRole === 'coach') {
        await Promise.all([prefetch(trpc.listCoachCoachingSessions.queryOptions({}))]);

        return (
            <>
                <HydrateClient>
                    <Suspense fallback={<DefaultLoadingWrapper />}>
                       <CoachCoachingSessions role={userRole} />
                    </Suspense>
                </HydrateClient>
            </>
        );
    } else {
        return null; // Return null instead of empty string for student role
    }
}
