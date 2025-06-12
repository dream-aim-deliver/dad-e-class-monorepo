import Home from '../../client/pages/home';
import { HydrateClient, prefetch, trpc } from '../config/trpc/server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

export default async function HomeServerComponent() {
    await Promise.all([
        prefetch(trpc.getHomePage.queryOptions({})),
        prefetch(trpc.getHomePageTopics.queryOptions()),
    ]);

    return (
        <>
            <HydrateClient>
                <div className="bg-card-color-fill">
                    <Suspense fallback={<DefaultLoadingWrapper />}>
                        <Home />
                    </Suspense>
                </div>
            </HydrateClient>
        </>
    );
}
