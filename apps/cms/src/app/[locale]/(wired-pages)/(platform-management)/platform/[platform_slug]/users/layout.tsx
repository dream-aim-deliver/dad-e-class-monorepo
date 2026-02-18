import { TLocale } from "@maany_shr/e-class-translations";
import CMSTRPCClientProviders from '../../../../../../../lib/infrastructure/client/trpc/cms-client-provider';
import { PlatformLocaleProvider } from '../../../../../../../lib/infrastructure/client/context/platform-locale-context';
import { PlatformProvider } from '../../../../../../../lib/infrastructure/client/context/platform-context';
import CMSSidebarLayout from '../../../../../../../lib/infrastructure/server/pages/layouts/cms-sidebar-layout';
import { getQueryClient, getServerTRPC } from '../../../../../../../lib/infrastructure/server/config/trpc/cms-server';
import type { TGetPlatformUseCaseResponse } from '@dream-aim-deliver/e-class-cms-rest';

export default async function PlatformScopedLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ platform_slug: string; locale: string }>;
}) {
    const params = await paramsPromise;
    const platformSlug = params.platform_slug;
    const appLocale = params.locale as TLocale;

    const platformLocale = appLocale as TLocale;

    const trpc = getServerTRPC({
        platform_slug: platformSlug,
        platform_locale: platformLocale
    });

    const queryClient = getQueryClient();
    // @ts-expect-error see TRPC router typing
    const platformResult: TGetPlatformUseCaseResponse = await queryClient.fetchQuery(
        trpc.getPlatform.queryOptions({})
    );

    if (!platformResult.success) {
        throw new Error('Failed to load platform data');
    }

    const platform = platformResult.data;

    return (
        <div>
            <PlatformLocaleProvider platformSlug={platformSlug} platformLocale={platformLocale}>
                <PlatformProvider platform={platform}>
                    <CMSTRPCClientProviders
                        platformContext={{
                            platformSlug,
                            platformLanguageCode: platformLocale
                        }}
                    >
                        <CMSSidebarLayout
                            platformName={platform.name}
                            platformLogoUrl={platform.logo?.downloadUrl ?? undefined}
                            platformSlug={platformSlug}
                            platformLocale={platformLocale}
                            locale={appLocale}
                        >
                            {children}
                        </CMSSidebarLayout>
                    </CMSTRPCClientProviders>
                </PlatformProvider>
            </PlatformLocaleProvider>
        </div>
    );
}

