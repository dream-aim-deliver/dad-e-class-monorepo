import type { Viewport } from 'next';
import HomeServerComponent from '../../../lib/infrastructure/server/pages/home-page-rsc';
import { MobileReadyStyle } from '../../../lib/mobile-hack';

// MOBILE-HACK: Override layout's 1280px viewport with responsive mobile viewport
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default async function Index() {
    return (
        <>
            <MobileReadyStyle />
            <HomeServerComponent />
        </>
    );
}
