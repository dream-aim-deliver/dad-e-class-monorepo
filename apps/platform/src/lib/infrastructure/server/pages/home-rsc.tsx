import Home from '../../client/pages/home';
import { HydrateClient, prefetch, trpc } from '../config/trpc/server';
import { Suspense } from 'react';

export default async function HomeServerComponent() {
    await prefetch(trpc.getHomePage.queryOptions());

    return (
        <>
            <HydrateClient>
                <div className="bg-card-color-fill">
                    <Suspense
                        fallback={
                            <div className="text-white">
                                Loading... Hello...
                            </div>
                        }
                    >
                        <Home />
                    </Suspense>
                </div>
            </HydrateClient>
        </>
    );
}
