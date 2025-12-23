'use client';

import Header from './header';
import { useEffect, useRef } from 'react';
import { DefaultError, DefaultLoading, ImageProvider } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import CMSSidebar from '../../server/pages/layouts/cms-sidebar';
import { OptimizedImage } from '../components/optimized-image';

interface LayoutProps {
    children: React.ReactNode;
    availableLocales: TLocale[];
    backgroundImageUrl?: string;
    platformName?: string;
    platformLogoUrl?: string;
    platformSlug?: string;
    platformLocale?: string;
    showSidebar?: boolean;
}

export default function Layout({
    children,
    availableLocales,
    backgroundImageUrl,
    platformName,
    platformLogoUrl,
    platformSlug,
    platformLocale,
    showSidebar = false,
}: LayoutProps) {
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


    return (
        <ImageProvider value={OptimizedImage}>
            <div
                className="w-full min-h-screen bg-repeat-y flex flex-col justify-center items-center px-4"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${"https://i.imgur.com/PoJASP9.png"})`,
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundColor: '#1E1B4B',
                }}
            >
                <Header
                    availableLocales={availableLocales}
                    locale={locale}
                    session={session}
                />
                <main className="flex-grow w-full mx-auto pt-25 pb-35 justify-center items-center">
                    {showSidebar && platformName && platformSlug && platformLocale ? (
                        <div className="flex flex-row lg:gap-3 w-full">
                            <div
                                id="cms-sidebar"
                                className="sticky top-25 h-screen flex-shrink-0 z-[1000]"
                            >
                                <CMSSidebar
                                    platformName={platformName}
                                    platformLogoUrl={platformLogoUrl}
                                    platformSlug={platformSlug}
                                    platformLocale={platformLocale}
                                    locale={locale}
                                />
                            </div>
                            <div ref={contentRef} className="page-content-entrance w-full px-5">
                                {children}
                            </div>
                        </div>
                    ) : (
                        <div ref={contentRef} className="page-content-entrance w-full">
                            {children}
                        </div>
                    )}
                </main>
            </div>
        </ImageProvider>
    );
}
