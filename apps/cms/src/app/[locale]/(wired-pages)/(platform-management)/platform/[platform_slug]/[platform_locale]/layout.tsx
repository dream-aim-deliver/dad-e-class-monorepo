import { TLocale } from "@maany_shr/e-class-translations";
import CMSTRPCClientProviders from '../../../../../../../lib/infrastructure/client/trpc/cms-client-provider';
import { PlatformLocaleProvider } from '../../../../../../../lib/infrastructure/client/context/platform-locale-context';

export default async function PlatformLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ platform_locale: string; platform_slug: string }>;
}) {
    const params = await paramsPromise;
    const platformLocale = params.platform_locale as TLocale;
    const platformSlug = params.platform_slug;

    return (
        <div>
            <PlatformLocaleProvider platformSlug={platformSlug} platformLocale={platformLocale}>
                <CMSTRPCClientProviders
                    platformContext={{
                        platformSlug,
                        platformLanguageCode: platformLocale
                    }}
                >
                {children}
                </CMSTRPCClientProviders>
            </PlatformLocaleProvider>
        </div>
    );
}

