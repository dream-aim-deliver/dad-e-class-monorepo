import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import RulesPage from '../../../../lib/infrastructure/client/pages/rules-page';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

export default async function RulesPageServerComponent() {
    // Streaming pattern: Fire prefetch without awaiting (TSK-PERF-007)
    prefetch(trpc.getPlatformLanguage.queryOptions({}));

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper/>}>
                <RulesPage />
            </Suspense>
        </HydrateClient>
    );
}
