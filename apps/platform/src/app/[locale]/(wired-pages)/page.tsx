import type { ResolvingMetadata, Viewport } from 'next';
import HomeServerComponent from '../../../lib/infrastructure/server/pages/home-page-rsc';
import { MobileReadyStyle } from '../../../lib/mobile-hack';
import { generatePageMetadata } from '../../../lib/infrastructure/server/utils/page-metadata';

// MOBILE-HACK: Override layout's 1280px viewport with responsive mobile viewport
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata,
) {
    return generatePageMetadata(params, parent, 'home', '');
}

export default async function Index() {
    return (
        <>
            <MobileReadyStyle />
            <HomeServerComponent />
        </>
    );
}
