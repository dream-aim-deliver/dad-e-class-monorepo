
import { Suspense } from 'react';
import PlatformManagement from '../../../../../../../lib/infrastructure/client/pages/platform-management';
import DefaultLoadingWrapper from '../../../../../../../lib/infrastructure/client/wrappers/default-loading';
import { HydrateClient, getServerTRPC } from '../../../../../../../lib/infrastructure/server/config/trpc/cms-server';

export default async function Page({
    params: paramsPromise,
    searchParams: searchParamsPromise,
}: {
    params: Promise<{
        platform_slug: string;
        platform_locale: string;
        locale: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await paramsPromise;
    const searchParams = await searchParamsPromise;

    // Get platform-aware TRPC proxy - single line, always works!
    const trpc = getServerTRPC(params);

    // Optional: Prefetch data for better performance
    // await Promise.all([
    //     prefetch(trpc.listTopics.queryOptions({})),
    //     prefetch(trpc.listCategories.queryOptions({})),
    // ]);

    const platformSlug = params.platform_slug;
    const platformLocale = params.platform_locale;
    let tab = searchParams.tab;

    if (!tab || Array.isArray(tab)) {
        tab = undefined;
    }

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <PlatformManagement
                    platformSlug={platformSlug}
                    platformLocale={platformLocale}
                />
            </Suspense>
        </HydrateClient>
    )
}
