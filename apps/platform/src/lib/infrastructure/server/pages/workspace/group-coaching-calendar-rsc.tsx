/**
 * NOT WIRED TO ANY ROUTE - TBD if we need this
 *
 * Purpose: RSC wrapper for the general coach calendar overview.
 * Would show all coaching sessions for a coach across all courses/groups.
 */

import GroupCoachingCalendar from '../../../client/pages/workspace/calendar/group-coaching-calendar';
import { HydrateClient } from '../../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';

export default async function GroupCoachingCalendarServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    // Only coaches should access group coaching calendar
    if (!session.user.roles?.includes('coach')) {
        redirect('/workspace');
    }

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <GroupCoachingCalendar />
                </Suspense>
            </HydrateClient>
        </>
    );
}