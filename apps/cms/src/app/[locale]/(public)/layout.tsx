import { i18nConfig, TLocale } from '@maany_shr/e-class-translations';
import '../global.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Figtree, Nunito, Raleway, Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import env from '../../../lib/infrastructure/server/config/env';
import Layout from '../../../lib/infrastructure/client/pages/layout';

type MetadataProps = {
    params: Promise<{ locale: string }>;
};

const OG_IMAGE = 'https://i.imgur.com/6CGQTz1.png';

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.cms' });

    const appName = 'E-Class CMS';
    const appUrl = env.NEXT_PUBLIC_APP_URL;

    return {
        title: {
            default: t('title'),
            template: `%s | ${appName}`,
        },
        description: t('description'),
        metadataBase: new URL(appUrl),
        openGraph: {
            title: t('title'),
            description: t('ogDescription'),
            url: appUrl,
            siteName: appName,
            locale,
            type: 'website',
            images: [{ url: OG_IMAGE, alt: appName }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('ogDescription'),
            images: [OG_IMAGE],
        },
        robots: {
            index: false,
            follow: false,
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

export default async function PublicLayout({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const THEME = 'cms';

    const params = await paramsPromise;
    const locale = params.locale as TLocale;

    // Check if the locale is supported by i18n config (supports both en and de)
    if (!i18nConfig.locales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages({ locale });

    // Available locales for language switcher
    const availableLocales: TLocale[] = i18nConfig.locales;

    return (
        <html lang={locale}>
            <body
                className={`theme theme-${THEME} ${nunito.variable} ${roboto.variable} ${raleway.variable} ${figtree.variable}`}
            >
                <SessionProvider>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <Layout availableLocales={availableLocales}>
                            {children}
                        </Layout>
                    </NextIntlClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
