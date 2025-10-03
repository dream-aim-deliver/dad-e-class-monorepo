import Home from '../../client/pages/home';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';

export default async function HomeServerComponent() {
    await Promise.all([
        prefetch(trpc.getHomePage.queryOptions({})),
        prefetch(trpc.listTopics.queryOptions({})),
    ]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <Home />
                </Suspense>
            </HydrateClient>
        </>
    );
}
