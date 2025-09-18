'use client';

import { trpc } from '../trpc/client';
import Header from './header';
import Footer from './footer';
import { useState, useEffect, useRef } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformPresenter } from '../hooks/use-platform-presenter';
import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

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

    const [platformResponse] = trpc.getPlatform.useSuspenseQuery({});
    const [platformViewModel, setPlatformViewModel] = useState<
        viewModels.TPlatformViewModel | undefined
    >(undefined);
    const { presenter: platformPresenter } =
        useGetPlatformPresenter(setPlatformViewModel);
    platformPresenter.present(platformResponse, platformViewModel);

    if (!platformViewModel)
        return <DefaultLoading locale={locale} variant="minimal" />;
    if (platformViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div
            className="w-full min-h-screen bg-repeat-y flex flex-col justify-center items-center"
            style={{
                // Temporary linear gradient to match the Figma. Should be uploaded this dark.
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${platformViewModel.data.backgroundImageUrl})`,
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
            <main className="flex-grow w-full mx-auto py-4 justify-center items-center">
                <div ref={contentRef} className="page-content-entrance w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
