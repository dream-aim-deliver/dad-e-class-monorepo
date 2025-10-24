import HomePage from '../../client/pages/home-page';
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
                    <HomePage />
                </Suspense>
            </HydrateClient>
        </>
    );
}
