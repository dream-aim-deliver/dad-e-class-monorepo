import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import UserDashboard from '../../../client/pages/workspace/user-dashboard';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/cms-server';
import MockTRPCClientProviders from '../../../client/trpc/mock-client-providers';

export default async function UserDashboardServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;
    const isCoach = roles?.includes('coach');

    // Prefetch data based on user role
    const prefetchPromises = [
        prefetch(trpc.listUserCourses.queryOptions({}))
    ];

    // Add coach-specific data prefetching
    if (isCoach) {
        prefetchPromises.push(
            prefetch(
                trpc.listCoachStudents.queryOptions({
                    pagination: {
                        page: 1,
                        pageSize: 3,
                    },
                }),
            )
        );
        // TODO: Add prefetch for coach reviews when endpoint is available
        // prefetchPromises.push(
        //     prefetch(
        //         trpc.listCoachReviews.queryOptions({
        //             pagination: {
        //                 page: 1,
        //                 pageSize: 3,
        //             },
        //         }),
        //     )
        // );
    }

    await Promise.all(prefetchPromises);

    return (
        <MockTRPCClientProviders>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <UserDashboard roles={roles || []} />
                </Suspense>
            </HydrateClient>
        </MockTRPCClientProviders>
    );
}