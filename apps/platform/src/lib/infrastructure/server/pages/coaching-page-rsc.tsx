import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import CoachingPage from '../../client/pages/coaching/coaching-page';
import getSession from '../config/auth/get-session';

interface CoachingPageProps {
    topics?: string[];
}

export default async function CoachingPageServerComponent(props: CoachingPageProps) {
    // Check if user is signed in for conditional prefetching
    const session = await getSession();
    const isSignedIn = !!session?.user;

    // Prefetch Data related to Topics and Categories
    prefetch(trpc.listCategories.queryOptions({}));
    prefetch(trpc.listTopics.queryOptions({}));
    prefetch(trpc.listTopicsByCategory.queryOptions({}));

    // Prefetch Data related to Coaching Page
    prefetch(trpc.getCoachingPage.queryOptions({}));

    // Prefetch Data related to Coaches (publicCoaches only for non-signed-in users)
    prefetch(trpc.listCoaches.queryOptions(isSignedIn ? {} : { publicCoaches: true }));

    // Prefetch Data related to Coaching Offerings
    prefetch(trpc.listCoachingOfferings.queryOptions({}));

    // Prefetch Data related to Available Coachings (only for signed-in users)
    if (isSignedIn) {
        prefetch(trpc.listAvailableCoachings.queryOptions({}));
    }

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <CoachingPage initialSelectedTopics={props.topics} />
                </Suspense>
            </HydrateClient>
        </>
    );
}
