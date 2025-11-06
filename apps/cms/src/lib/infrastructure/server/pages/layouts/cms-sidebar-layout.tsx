'use client';

import { Suspense } from 'react';
import CMSSidebar from './cms-sidebar';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { TLocale } from '@maany_shr/e-class-translations';

export interface CMSSidebarLayoutProps {
    children: React.ReactNode;
    platformName: string;
    platformLogoUrl?: string;
    platformSlug: string;
    platformLocale: string;
    locale: TLocale;
}

export default function CMSSidebarLayout({
    children,
    platformName,
    platformLogoUrl,
    platformSlug,
    platformLocale,
    locale,
}: CMSSidebarLayoutProps) {
    return (
        <div className="flex flex-row lg:gap-3">
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
            <div id="content" className="w-full min-w-0 px-5">
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    {children}
                </Suspense>
            </div>
        </div>
    );
}
