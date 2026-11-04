import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import env from '../config/env';
import { getPlatformCached } from './get-platform-cached';
import { stripCopyPrefix, toMetaDescription } from './seo-text';

export const FALLBACK_OG_IMAGE = 'https://i.imgur.com/6CGQTz1.png';

type BuildEntityMetadataInput = {
    locale: string;
    /** Absolute path starting with `/`, e.g. `/de/courses/slug` */
    path: string;
    title?: string | null;
    description?: string | null;
    imageUrl?: string | null;
};

/**
 * Builds page-level Metadata that inherits the layout title template (`%s | appName`).
 * Falls back to the global platform title/description when entity fields are missing.
 */
export async function buildEntityMetadata({
    locale,
    path,
    title,
    description,
    imageUrl,
}: BuildEntityMetadataInput): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'metadata.platform' });
    const appName = env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME;
    const appUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');

    const cleanedTitle = stripCopyPrefix(title);
    const metaDescription = toMetaDescription(description);

    // Document title uses the layout template (`%s | appName`) when set.
    // Open Graph / Twitter titles include the app name explicitly.
    const defaultTitle = t('title', { appName });
    const documentTitle = cleanedTitle || undefined;
    const socialTitle = cleanedTitle ? `${cleanedTitle} | ${appName}` : defaultTitle;
    const resolvedDescription = metaDescription || t('description');

    let ogImage = imageUrl || FALLBACK_OG_IMAGE;
    if (!imageUrl) {
        try {
            const platformData = await getPlatformCached(locale);
            if (platformData?.logo?.downloadUrl) {
                ogImage = platformData.logo.downloadUrl;
            }
        } catch {
            // Keep FALLBACK_OG_IMAGE
        }
    }

    const absoluteUrl = `${appUrl}${path}`;
    const pathWithoutLocale = path.replace(/^\/(de|en)/, '') || '/';

    return {
        title: documentTitle,
        description: resolvedDescription,
        alternates: {
            canonical: path,
            languages: {
                de: `/de${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
                en: `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
            },
        },
        openGraph: {
            title: socialTitle,
            description: resolvedDescription,
            url: absoluteUrl,
            siteName: appName,
            locale,
            type: 'website',
            images: [{ url: ogImage, alt: socialTitle }],
        },
        twitter: {
            card: 'summary_large_image',
            title: socialTitle,
            description: resolvedDescription,
            images: [ogImage],
        },
    };
}
