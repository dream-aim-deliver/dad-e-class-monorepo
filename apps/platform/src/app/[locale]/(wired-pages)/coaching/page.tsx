import type { ResolvingMetadata, Viewport } from 'next';
import { extractListParams } from '../../../../lib/infrastructure/server/utils/extract-params';
import CoachingPageServerComponent from '../../../../lib/infrastructure/server/pages/coaching-page-rsc';
import { MobileReadyStyle } from '../../../../lib/mobile-hack';
import { generatePageMetadata } from '../../../../lib/infrastructure/server/utils/page-metadata';

// MOBILE-HACK: Override layout's 1280px viewport with responsive mobile viewport
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata,
) {
    return generatePageMetadata(params, parent, 'coaching', '/coaching');
}

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
            <CoachingPageServerComponent topics={topics} />
        </>
    );
}
