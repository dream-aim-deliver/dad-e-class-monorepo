import { TLocale } from "@maany_shr/e-class-translations";

export default async function PlatformLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ platformLocale: string; slug: string }>;
}) {
    const params = await paramsPromise;
    const platformLocale = params.platformLocale as TLocale;
    const slug = params.slug;
    
    return (
        <div>
            <h1>Platform Layout</h1>
            <p>Locale: {platformLocale}</p>
            <p>Slug: {slug}</p>
            {children}
        </div>
    );
}