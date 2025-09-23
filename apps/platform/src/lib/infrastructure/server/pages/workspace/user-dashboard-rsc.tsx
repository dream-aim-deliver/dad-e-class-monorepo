import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import UserDashboard from '../../../client/pages/workspace/user-dashboard';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/server';
import MockTRPCClientProviders from '../../../client/trpc/mock-client-providers';

export default async function UserDashboardServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;
    // Now allows any user with courses, not just students
    
    // Prefetch user courses data for the user dashboard
    await Promise.all([prefetch(trpc.listUserCourses.queryOptions({}))]);

    return (
        <MockTRPCClientProviders>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <UserDashboard roles={roles || []} />
            </Suspense>
        </MockTRPCClientProviders>
    );
}