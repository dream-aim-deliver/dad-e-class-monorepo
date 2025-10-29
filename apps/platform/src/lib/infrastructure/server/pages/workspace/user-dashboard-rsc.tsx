import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import UserDashboard from '../../../client/pages/workspace/user-dashboard';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/cms-server';
import CMSTRPCClientProviders from '../../../client/trpc/cms-client-provider';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { getLocale } from 'next-intl/server';

export default async function UserDashboardServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const locale = await getLocale();
    const dictionary = getDictionary(locale as TLocale);

    const roles = session.user.roles;
    const isVisitor = !roles || (roles.length === 1 && roles[0] === 'visitor');

    if (isVisitor) {
        throw new Error(dictionary.pages.userDashboard.errorAccess);
    }

    const isCoach = roles?.includes('coach');

    // Prefetch data based on user role
    const prefetchPromises = [
        prefetch(trpc.listUserCourses.queryOptions({})),
        prefetch(trpc.getPersonalProfile.queryOptions({}))
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

    try {
        await Promise.all(prefetchPromises);
    } catch (error) {
        throw new Error(dictionary.pages.userDashboard.errorFailed);
    }

    return (
        <CMSTRPCClientProviders>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <UserDashboard roles={roles || []} />
                </Suspense>
            </HydrateClient>
        </CMSTRPCClientProviders>
    );
}