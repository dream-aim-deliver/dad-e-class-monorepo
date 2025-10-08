import CMSSidebar from './cms-sidebar';
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
        <div className="flex flex-row lg:gap-3 p-5">
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
            <div id="content" className="w-full px-5">
                {children}
            </div>
        </div>
    );
}
