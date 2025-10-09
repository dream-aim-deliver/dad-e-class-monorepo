import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import AboutPage from '../../../../lib/infrastructure/client/pages/about-page';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

export default async function AboutPageServerComponent() {
    await Promise.all([
        prefetch(trpc.getPlatformLanguage.queryOptions({})),
    ]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper/>}>
                    <AboutPage />
                </Suspense>
            </HydrateClient>
        </>
    );
}
