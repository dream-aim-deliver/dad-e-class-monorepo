import { HydrateClient, prefetch, getServerTRPC } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import CMSExample from '../../client/pages/cms-example';

export default async function CMSVersionRSC() {
    const trpc = getServerTRPC();
    // Streaming pattern: Fire prefetches without awaiting (TSK-PERF-007)
    prefetch(trpc.version.queryOptions());
    prefetch(
        trpc.getSkills.queryOptions({
            userId: '1',
        }),
    );
    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <CMSExample />
            </Suspense>
        </HydrateClient>
    );
}
