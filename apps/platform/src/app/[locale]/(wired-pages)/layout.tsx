import { i18nConfig, TLocale } from '@maany_shr/e-class-translations';
import '../global.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Figtree, Nunito, Raleway, Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { auth, viewModels } from '@maany_shr/e-class-models';
import { NextAuthGateway } from '@maany_shr/e-class-auth';
import nextAuth from '../../../lib/infrastructure/server/config/auth/next-auth.config';
import { SessionMonitorWrapper } from '../../../lib/infrastructure/client/components/session-monitor-wrapper';
import {
    languageCodeToLocale,
    localeToLanguageCode,
} from '../../../lib/infrastructure/server/utils/language-mapping';
import Layout from '../../../lib/infrastructure/client/pages/layout';
import CMSTRPCClientProviders from '../../../lib/infrastructure/client/trpc/cms-client-provider';
import { PlatformProviderWithSuspense } from '../../../lib/infrastructure/client/context/platform-context-with-suspense';
import { HydrateClient } from '../../../lib/infrastructure/server/config/trpc/cms-server';
import { RuntimeConfigProvider } from '../../../lib/infrastructure/client/context/runtime-config-context';
import { Suspense } from 'react';
import getSession from '../../../lib/infrastructure/server/config/auth/get-session';
import { getRuntimeConfig } from '../../../lib/infrastructure/server/utils/get-runtime-config';
import NextTopLoaderWrapper from '../../../lib/infrastructure/client/components/next-top-loader-wrapper';
import DefaultLoadingWrapper from '../../../lib/infrastructure/client/wrappers/default-loading';
import { getPlatformCached } from '../../../lib/infrastructure/server/utils/get-platform-cached';
import { OTelBrowserProvider } from '../../../lib/infrastructure/client/telemetry';
import env from '../../../lib/infrastructure/server/config/env';

type MetadataProps = {
    params: Promise<{ locale: string }>;
};

const FALLBACK_OG_IMAGE = 'https://i.imgur.com/6CGQTz1.png';

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.platform' });

    const appName = env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME;
    const appUrl = env.NEXT_PUBLIC_APP_URL;

    // Get platform logo (cached for 15 min, same cache as layout)
    let ogImage = FALLBACK_OG_IMAGE;
    try {
        const platformData = await getPlatformCached(locale);
        if (platformData?.logo?.downloadUrl) {
            ogImage = platformData.logo.downloadUrl;
        }
    } catch {
        // Use fallback if platform data fetch fails
    }

    return {
        title: {
            default: t('title', { appName }),
            template: `%s | ${appName}`,
        },
        description: t('description'),
        metadataBase: new URL(appUrl),
        alternates: {
            languages: { en: '/en', de: '/de' },
        },
        openGraph: {
            title: t('title', { appName }),
            description: t('ogDescription'),
            url: appUrl,
            siteName: appName,
            locale,
            type: 'website',
            images: [{ url: ogImage, alt: appName }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title', { appName }),
            description: t('ogDescription'),
            images: [ogImage],
        },
    };
}

const nunito = Nunito({
    weight: ['300', '400', '700'],
    variable: '--font-nunito',
    subsets: ['latin'],
    display: 'swap',
});
const raleway = Raleway({
    weight: ['300', '400', '700'],
    variable: '--font-raleway',
    subsets: ['latin'],
    display: 'swap',
});
const roboto = Roboto({
    weight: ['300', '400', '700'],
    variable: '--font-roboto',
    subsets: ['latin'],
    display: 'swap',
});
const figtree = Figtree({
    weight: ['300', '400', '700'],
    variable: '--font-figtree',
    subsets: ['latin'],
    display: 'swap',
});

export default async function RootLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Performance tracking (development only)
    const perfStart = performance.now();
    const timings: Record<string, number> = {};

    // STEP 1: Locale Resolution and Validation
    const localeStart = performance.now();
    const { languages } = {
        languages: [
            {
                languageCode: 'en',
                name: 'English',
            },
            {
                languageCode: 'de',
                name: 'German',
            },
        ],
    };

    // Check if platform's languages are supported
    const availableLocales: TLocale[] = [];
    for (const language of languages) {
        const availableLocale = languageCodeToLocale[language.languageCode];
        if (availableLocale && i18nConfig.locales.includes(availableLocale)) {
            availableLocales.push(availableLocale);
        } else {
            // TODO: might be a soft error
            throw new Error('A platform language is not supported');
        }
    }

    // Check if the locale is supported
    const params = await paramsPromise;
    const locale = params.locale as TLocale;
    const language = languages.find(
        (value) => value.languageCode === localeToLanguageCode[locale],
    );

    if (!availableLocales.includes(locale) || !language) {
        notFound();
    }
    timings.localeValidation = performance.now() - localeStart;

    // STEP 2: Parallel Data Fetching
    // All data fetches are independent and can run concurrently
    const parallelStart = performance.now();
    const [messages, session] = await Promise.all([
        getMessages({ locale }), // Already cached by next-intl internally
        getSession(), // Uses React.cache() for request-level deduplication
    ]);

    // Fetch platform data (cached globally per locale for 15 minutes)
    // Platform data is public and identical for all users, so no session segmentation needed
    let platformData;
    try {
        platformData = await getPlatformCached(locale);

        if (!platformData) {
            throw new Error('Platform data is null or undefined');
        }
    } catch (error) {
        console.error('[Layout] Failed to fetch platform data:', error);
        // Throw a user-friendly error that Next.js can catch and display
        throw new Error(
            'Failed to load platform configuration. Please check if the CMS backend is running and try again.'
        );
    }

    timings.parallelFetch = performance.now() - parallelStart;

    // STEP 3: Runtime Config (synchronous, cached)
    // No connection() needed - getSession() already forces dynamic rendering
    const configStart = performance.now();
    const runtimeConfig = getRuntimeConfig();
    timings.runtimeConfig = performance.now() - configStart;

    // OpenTelemetry browser configuration
    // Note: propagateToUrls uses strings (not RegExp) because RegExp can't be serialized to Client Components
    const otelConfig = process.env.NEXT_PUBLIC_OTEL_ENABLED === 'true' ? {
        serviceName: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME || 'e-class-platform-browser',
        otlpEndpoint: process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT || '',
        enabled: true,
        appInstance: runtimeConfig.NEXT_PUBLIC_E_CLASS_RUNTIME || 'default',
        propagateToUrls: [
            // Propagate trace headers to CMS REST API (will be converted to RegExp on client side)
            runtimeConfig.NEXT_PUBLIC_E_CLASS_CMS_REST_URL,
        ],
    } : undefined;

    // Performance logging (development only)
    const totalTime = performance.now() - perfStart;
    if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Layout Performance:', {
            timings: {
                localeValidation: `${timings.localeValidation.toFixed(2)}ms`,
                parallelFetch: `${timings.parallelFetch.toFixed(2)}ms (messages + session + platform with validation)`,
                runtimeConfig: `${timings.runtimeConfig.toFixed(2)}ms`,
                total: `${totalTime.toFixed(2)}ms`,
            },
            breakdown: {
                parallelFetch: `${((timings.parallelFetch / totalTime) * 100).toFixed(1)}%`,
            },
            cache: {
                platform: 'Cached for 15 minutes server-side (with error handling)',
            }
        });
    }

    return (
        <html lang={locale}>
            <body
                className={`${nunito.variable} ${roboto.variable} ${raleway.variable} ${figtree.variable}`}
            >
                <NextTopLoaderWrapper />
                <SessionProvider session={session}>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <RuntimeConfigProvider config={runtimeConfig}>
                            <OTelBrowserProvider config={otelConfig}>
                                <CMSTRPCClientProviders>
                                    <HydrateClient>
                                        <Suspense fallback={<DefaultLoadingWrapper />}>
                                            <SessionMonitorWrapper locale={locale}>
                                                <PlatformProviderWithSuspense platform={platformData}>
                                                    <Layout availableLocales={availableLocales}>
                                                        {children}
                                                    </Layout>
                                                </PlatformProviderWithSuspense>
                                            </SessionMonitorWrapper>
                                        </Suspense>
                                    </HydrateClient>
                                </CMSTRPCClientProviders>
                            </OTelBrowserProvider>
                        </RuntimeConfigProvider>
                    </NextIntlClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
