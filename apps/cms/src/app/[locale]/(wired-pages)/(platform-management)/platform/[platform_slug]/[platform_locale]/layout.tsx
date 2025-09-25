import { TLocale } from "@maany_shr/e-class-translations";
import CMSTRPCClientProviders from '../../../../../../../lib/infrastructure/client/trpc/cms-client-provider';

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
            <CMSTRPCClientProviders
                platformContext={{
                    platformSlug,
                    platformLanguageCode: platformLocale
                }}
            >
            <h1>Platform Layout</h1>
            <p>Locale: {platformLocale}</p>
            <p>Platform Slug: {platformSlug}</p>
            {children}
            </CMSTRPCClientProviders>
        </div>
    );
}

