
import { getServerTRPC } from '../../../../../../../lib/infrastructure/server/config/trpc/cms-server';

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

    // Example: Use trpc for data fetching with platform headers automatically included
    // await prefetch(trpc.someQuery.query({ ... }));

    const platformSlug = params.platform_slug;
    const platformLocale = params.platform_locale;
    let tab = searchParams.tab;

    if (!tab || Array.isArray(tab)) {
        tab = undefined;
    }

    return (
        <div>
            <h1>Platform Page - {platformSlug}</h1>
            <p>Locale: {platformLocale}</p>
            {tab && <p>Tab: {tab}</p>}
        </div>
    )
}
