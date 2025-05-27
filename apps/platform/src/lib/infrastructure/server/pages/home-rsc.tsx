import Home from '../../client/pages/home';
import { HydrateClient, prefetch, trpc } from '../config/trpc/server';
import { Suspense } from 'react';

export default async function HomeServerComponent() {
    // TODO: might be cached
    await prefetch(trpc.getHomePage.queryOptions());
    await prefetch(trpc.getHomePageTopics.queryOptions());

    return (
        <>
            <HydrateClient>
                <div className="bg-card-color-fill">
                    <Suspense
                        fallback={<div className="text-white">Loading...</div>}
                    >
                        <Home />
                    </Suspense>
                </div>
            </HydrateClient>
        </>
    );
}
