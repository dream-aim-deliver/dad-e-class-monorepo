import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import RulesPage from '../../../../lib/infrastructure/client/pages/rules-page';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

export default async function RulesPageServerComponent() {
    await Promise.all([
        prefetch(trpc.getPlatformLanguage.queryOptions({})),
    ]);

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper/>}>
                <RulesPage />
            </Suspense>
        </HydrateClient>
    );
}
