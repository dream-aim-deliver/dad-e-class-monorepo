'use client';

import Header from './header';
import Footer from './footer';
import { useState, useEffect, useRef } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformPresenter } from '../hooks/use-get-platform-presenter';
import { DefaultError, DefaultLoading, DefaultNotFound } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRequiredPlatform } from '../context/platform-context';

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
    const [platformViewModel, setPlatformViewModel] = useState<
        viewModels.TGetPlatformViewModel | undefined
    >(undefined);
    const { presenter: platformPresenter } =
        useGetPlatformPresenter(setPlatformViewModel);

    // Construct response object expected by presenter
    const platformResponse = {
        success: true as const,
        data: platform,
    };

    // @ts-ignore
    platformPresenter.present(platformResponse, platformViewModel);

    if (!platformViewModel)
        return <DefaultLoading locale={locale} variant="minimal" />;

    if (platformViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (platformViewModel.mode === 'not-found')
    {
        return <DefaultNotFound locale={locale} />;
    }

    return (
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
    );
}
