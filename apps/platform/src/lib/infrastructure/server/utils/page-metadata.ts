import type { Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';
import env from '../config/env';

/**
 * Per-page SEO metadata (title, description, canonical, hreflang, Open Graph).
 *
 * Texts live in the translation dictionaries under `metadata.pages.<key>` so that
 * they can be edited without touching code. `{appName}` is replaced with the
 * platform name. The title is used as-is (`absolute`), so what is in the
 * dictionary is exactly what Google shows.
 *
 * Open Graph and Twitter images, site name and type are taken over from the
 * layout's metadata (Next.js replaces nested objects instead of merging them).
 */
export type TPageMetadataKey =
    | 'home'
    | 'about'
    | 'offers'
    | 'offerInformation'
    | 'coaching'
    | 'rules'
    | 'impressum'
    | 'privacyPolicy'
    | 'termsOfUse';

export async function generatePageMetadata(
    params: Promise<{ locale: string }>,
    parent: ResolvingMetadata,
    key: TPageMetadataKey,
    path: string,
): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.pages' });
    const appName = env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME;
    const title = t(`${key}.title`, { appName });
    const description = t(`${key}.description`, { appName });
    const previous = await parent;
    const url = `/${locale}${path}`;

    return {
        title: { absolute: title },
        description,
        alternates: {
            canonical: url,
            languages: { en: `/en${path}`, de: `/de${path}`, 'x-default': `/de${path}` },
        },
        openGraph: {
            title,
            description,
            url,
            siteName: previous.openGraph?.siteName ?? appName,
            locale,
            type: 'website',
            images: previous.openGraph?.images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: previous.twitter?.images,
        },
    };
}
