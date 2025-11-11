import HomePage from '../../client/pages/home-page';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';

export default async function HomeServerComponent() {
    // Streaming pattern: Fire prefetches without awaiting (TSK-PERF-007)
    // React will stream HTML while queries are pending
    prefetch(trpc.getHomePage.queryOptions({}));
    prefetch(trpc.listTopics.queryOptions({}));

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <HomePage />
                </Suspense>
            </HydrateClient>
        </>
    );
}
