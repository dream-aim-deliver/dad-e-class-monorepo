import ListPlatforms from '../../client/pages/list-platforms';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import { HydrateClient, prefetch, getServerTRPC } from '../config/trpc/cms-server';

export default async function ListPlatformsServerComponent() {
    const trpc = getServerTRPC();
    await Promise.all([
        prefetch(trpc.listPlatforms.queryOptions({})),
    ]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <ListPlatforms />
                </Suspense>
            </HydrateClient>
        </>
    );
}
