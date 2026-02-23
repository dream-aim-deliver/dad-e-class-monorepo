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

    // TSK-PERF-014: Add missing prefetches for coaches and courses lists
    prefetch(trpc.listCoaches.queryOptions({
        skillSlugs: [],  // Default: all coaches (filters applied client-side)
        pagination: { page: 1, pageSize: 6 }
    }));
    prefetch(trpc.listCourses.queryOptions({}));

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
