import { TLocale } from "@maany_shr/e-class-translations";
import CMSTRPCClientProviders from '../../../../../../../lib/infrastructure/client/trpc/cms-client-provider';

export default async function PlatformLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ platformLocale: string; platformSlug: string }>;
}) {
    const params = await paramsPromise;
    const platformLocale = params.platformLocale as TLocale;
    const platformSlug = params.platformSlug;
    
    return (
        <div>
            <CMSTRPCClientProviders>
            <h1>Platform Layout</h1>
            <p>Locale: {platformLocale}</p>
            <p>Platform Slug: {platformSlug}</p>
            {children}
            </CMSTRPCClientProviders>
        </div>
    );
}

