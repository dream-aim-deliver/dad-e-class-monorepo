import { TLocale } from "@maany_shr/e-class-translations";
import CMSTRPCClientProviders from '../../../../../../../lib/infrastructure/client/trpc/cms-client-provider';
import { PlatformLocaleProvider } from '../../../../../../../lib/infrastructure/client/context/platform-locale-context';
import CMSSidebarLayout from '../../../../../../../lib/infrastructure/server/pages/layouts/cms-sidebar-layout';

export default async function PlatformLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ platform_locale: string; platform_slug: string; locale: TLocale }>;
}) {
    const params = await paramsPromise;
    const platformLocale = params.platform_locale as TLocale;
    const platformSlug = params.platform_slug;
    const appLocale = params.locale;

    // TODO: Fetch actual platform details from database
    // For now, using placeholder values
    const platformName = platformSlug.charAt(0).toUpperCase() + platformSlug.slice(1);
    const platformLogoUrl = undefined; // Will be fetched from database

    return (
        <div>
            <PlatformLocaleProvider platformSlug={platformSlug} platformLocale={platformLocale}>
                <CMSTRPCClientProviders
                    platformContext={{
                        platformSlug,
                        platformLanguageCode: platformLocale
                    }}
                >
                    <CMSSidebarLayout
                        platformName={platformName}
                        platformLogoUrl={platformLogoUrl}
                        platformSlug={platformSlug}
                        platformLocale={platformLocale}
                        locale={appLocale}
                    >
                        {children}
                    </CMSSidebarLayout>
                </CMSTRPCClientProviders>
            </PlatformLocaleProvider>
        </div>
    );
}

