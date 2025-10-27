import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import TermsOfUsePage from '../../../../lib/infrastructure/client/pages/terms-of-use-page';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

export default async function TermsOfUsePageServerComponent() {
    await Promise.all([
        prefetch(trpc.getPlatformLanguage.queryOptions({})),
    ]);

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper/>}>
                <TermsOfUsePage />
            </Suspense>
        </HydrateClient>
    );
}
