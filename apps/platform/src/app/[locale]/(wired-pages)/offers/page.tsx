import type { Viewport } from 'next';
import { extractListParams } from '../../../../lib/infrastructure/server/utils/extract-params';
import OffersServerComponent from '../../../../lib/infrastructure/server/pages/offers-page-rsc';
import { MobileReadyStyle } from '../../../../lib/mobile-hack';

// MOBILE-HACK: Override layout's 1280px viewport with responsive mobile viewport
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    const topics = extractListParams(searchParams.topics);
    return (
        <>
            <MobileReadyStyle />
            <OffersServerComponent topics={topics} />
        </>
    );
}
