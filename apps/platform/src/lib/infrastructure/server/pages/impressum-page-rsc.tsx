import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import ImpressumPage from '../../../../lib/infrastructure/client/pages/impressum-page';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

export default async function ImpressumPageServerComponent() {
    await Promise.all([
        prefetch(trpc.getPlatformLanguage.queryOptions({})),
    ]);

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper/>}>
                <ImpressumPage />
            </Suspense>
        </HydrateClient>
    );
}
