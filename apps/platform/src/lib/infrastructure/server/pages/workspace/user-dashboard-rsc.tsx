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
    const isAdmin = roles?.includes('admin');

    // Streaming pattern: Fire prefetches without awaiting
    // Pending queries will be dehydrated and sent to client
    prefetch(trpc.listUserCourses.queryOptions({}));
    prefetch(trpc.getPersonalProfile.queryOptions({}));
    prefetch(trpc.listNotifications.queryOptions({
        pagination: {
            page: 1,
            pageSize: 5,
        },
    }));

    // TSK-PERF-014: Add coaching sessions prefetch for all users
    prefetch(trpc.listUpcomingStudentCoachingSessions.queryOptions({
        studentUsername: session.user.name || ''
    }));
    prefetch(trpc.listStudentCoachingSessions.queryOptions({}));

    // Add coach-specific data prefetching
    if (isCoach) {
        prefetch(trpc.listCoachCoachingSessions.queryOptions({}));

        // TSK-PERF-014: Fix pagination - changed from pageSize 3 to 8 (matches client)
        prefetch(
            trpc.listCoachStudents.queryOptions({
                pagination: {
                    page: 1,
                    pageSize: 8,
                },
            })
        );

        // TSK-PERF-014: Add coach reviews prefetch for rating badge
        prefetch(
            trpc.listCoachReviews.queryOptions({
                coachUsername: session.user.name || ''
            })
        );
    }

    // TSK-PERF-014: Add platform courses prefetch for create course modal
    if (isAdmin || isCoach) {
        prefetch(trpc.listPlatformCoursesShort.queryOptions({}));
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