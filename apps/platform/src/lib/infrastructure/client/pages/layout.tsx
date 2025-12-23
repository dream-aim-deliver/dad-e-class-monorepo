'use client';

import Header from './header';
import Footer from './footer';
import { useMemo, useEffect, useRef } from 'react';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRequiredPlatform } from '../context/platform-context';
import { ImageProvider } from '@maany_shr/e-class-ui-kit';
import { OptimizedImage } from '../components/optimized-image';

interface LayoutProps {
    children: React.ReactNode;
    availableLocales: TLocale[];
}

export default function Layout({ children, availableLocales }: LayoutProps) {
    const locale = useLocale() as TLocale;
    const sessionDTO = useSession();
    const session = sessionDTO.data;
    const pathname = usePathname();
    const contentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // Trigger animation on route change (but not on initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (contentRef.current) {
            // Remove animation class
            contentRef.current.classList.remove('page-content-entrance');
            // Force reflow
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            contentRef.current.offsetHeight;
            // Re-add animation class
            contentRef.current.classList.add('page-content-entrance');
        }
    }, [pathname]);

    // Get platform data from context (already fetched server-side with 15-minute cache)
    const { platform } = useRequiredPlatform();

    // Transform platform data to view model format
    // Since platform comes from required context (throws if missing) and is already
    // validated server-side, we can safely construct the 'default' mode view model
    const platformViewModel = useMemo(() => ({
        mode: 'default' as const,
        data: platform,
    }), [platform]);

    return (
        <ImageProvider value={OptimizedImage}>
            <div
                className="w-full min-h-screen bg-repeat-y flex flex-col justify-center items-center"
                style={{
                    // Temporary linear gradient to match the Figma. Should be uploaded this dark.
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${platformViewModel.data.backgroundImage?.downloadUrl ?? ''})`,
                    backgroundSize: '100% auto',
                    // TODO: have a fallback color
                    backgroundColor: '#141414',
                }}
            >
                <Header
                    platformViewModel={platformViewModel}
                    availableLocales={availableLocales}
                    locale={locale}
                    session={session}
                />
                <main className="flex-grow w-full mx-auto py-25 justify-center items-center">
                    <div ref={contentRef} className="page-content-entrance w-full">
                        {children}
                    </div>
                </main>
                <Footer
                    locale={locale}
                    availableLocales={availableLocales}
                    platformViewModel={platformViewModel}
                />
            </div>
        </ImageProvider>
    );
}
