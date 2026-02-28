import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import OffersPage from '../../client/pages/offers/offers-page';

interface OffersProps {
    topics?: string[];
}

export default async function OffersServerComponent(props: OffersProps) {
    // Streaming pattern: Fire prefetches without awaiting (TSK-PERF-007)
    // React will stream HTML while queries are pending
    prefetch(trpc.getOffersPageOutline.queryOptions({}));
    prefetch(trpc.listCategories.queryOptions({}));
    prefetch(trpc.listTopics.queryOptions({}));
    prefetch(trpc.listTopicsByCategory.queryOptions({}));
    prefetch(trpc.listOffersPagePackages.queryOptions({}));

    // Coaches: fetch all, client-side filtering by topic
    prefetch(trpc.listCoaches.queryOptions({}));
    prefetch(trpc.listCourses.queryOptions({ includeCoachingPrices: true }));

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <OffersPage initialSelectedTopics={props.topics} />
                </Suspense>
            </HydrateClient>
        </>
    );
}
