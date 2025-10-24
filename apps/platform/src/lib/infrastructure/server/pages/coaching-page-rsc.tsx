import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import CoachingPage from '../../client/pages/coaching/coaching-page';

interface CoachingPageProps {
    topics?: string[];
}

export default async function CoachingPageServerComponent(props: CoachingPageProps) {
    await Promise.all([
        prefetch(trpc.getCoachingPage.queryOptions({})),
        prefetch(trpc.listTopicsByCategory.queryOptions({})),
        prefetch(trpc.listCoachingOfferings.queryOptions({})),
    ]);

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
