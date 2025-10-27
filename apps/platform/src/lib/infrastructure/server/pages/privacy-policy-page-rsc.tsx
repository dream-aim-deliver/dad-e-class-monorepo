import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import PrivacyPolicyPage from '../../../../lib/infrastructure/client/pages/privacy-policy-page';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';

export default async function PrivacyPolicyPageServerComponent() {
    await Promise.all([
        prefetch(trpc.getPlatformLanguage.queryOptions({})),
    ]);

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper/>}>
                <PrivacyPolicyPage />
            </Suspense>
        </HydrateClient>
    );
}
