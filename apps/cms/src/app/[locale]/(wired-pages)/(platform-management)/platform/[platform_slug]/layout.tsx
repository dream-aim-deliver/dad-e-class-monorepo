import { TLocale } from "@maany_shr/e-class-translations";
import CMSTRPCClientProviders from '../../../../../../lib/infrastructure/client/trpc/cms-client-provider';

export default async function PlatformSlugLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ platform_slug: string; locale: string }>;
}) {
    const params = await paramsPromise;
    const platformSlug = params.platform_slug;
    const appLocale = params.locale as TLocale;

    return (
        <CMSTRPCClientProviders
            platformContext={{
                platformSlug,
                platformLanguageCode: appLocale,
            }}
        >
            {children}
        </CMSTRPCClientProviders>
    );
}