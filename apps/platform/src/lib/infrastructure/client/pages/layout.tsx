'use client';

import { trpc } from '../trpc/client';
import Header from './header';
import Footer from './footer';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformPresenter } from '../hooks/use-platform-presenter';
import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';

interface LayoutProps {
    children: React.ReactNode;
    availableLocales: TLocale[];
}

export default function Layout({ children, availableLocales }: LayoutProps) {
    const locale = useLocale() as TLocale;
    const sessionDTO = useSession();
    const session = sessionDTO.data;

    const [platformResponse] = trpc.getPlatform.useSuspenseQuery({});
    const [platformViewModel, setPlatformViewModel] = useState<
        viewModels.TPlatformViewModel | undefined
    >(undefined);
    const { presenter: platformPresenter } =
        useGetPlatformPresenter(setPlatformViewModel);
    platformPresenter.present(platformResponse, platformViewModel);

    if (!platformViewModel) return <DefaultLoading locale={locale} />;
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
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-16">
                {children}
            </main>
            <Footer
                locale={locale}
                availableLocales={availableLocales}
                platformViewModel={platformViewModel}
            />
        </div>
    );
}
