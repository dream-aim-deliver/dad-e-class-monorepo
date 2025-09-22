import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/server';
import CoachCoachingSessions from '../../../client/pages/workspace/coach-coaching-sessions';

export default async function CoachingSessionsServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;
    if (roles && roles.includes('coach')) {
        await Promise.all([prefetch(trpc.listCoachCoachingSessions.queryOptions({}))]);

        return (
            <>
                <HydrateClient>
                    <Suspense fallback={<DefaultLoadingWrapper />}>
                       <CoachCoachingSessions />
                    </Suspense>
                </HydrateClient>
            </>
        );
    } else {
        return "";
    }
}