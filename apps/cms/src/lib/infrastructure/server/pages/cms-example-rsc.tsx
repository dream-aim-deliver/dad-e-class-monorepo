import { HydrateClient, prefetch, getServerTRPC } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import CMSExample from '../../client/pages/cms-example';

export default async function CMSVersionRSC() {
    const trpc = getServerTRPC();
    await Promise.all([
        prefetch(trpc.version.queryOptions()),
        prefetch(
            trpc.getSkills.queryOptions({
                userId: '1',
            }),
        ),
    ]);
    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <CMSExample />
            </Suspense>
        </HydrateClient>
    );
}
