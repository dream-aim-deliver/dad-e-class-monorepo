import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import OfferInformationPage from '../../../../lib/infrastructure/client/pages/offer-information-page';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

export default async function OfferInformationPageServerComponent() {
    // Streaming pattern: Fire prefetch without awaiting (TSK-PERF-007)
    prefetch(trpc.getPlatformLanguage.queryOptions({}));

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper/>}>
                <OfferInformationPage />
            </Suspense>
        </HydrateClient>
    );
}
