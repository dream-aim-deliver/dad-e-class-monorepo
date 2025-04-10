import { i18nConfig, TLocale } from '@maany_shr/e-class-translations';
import './global.css';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit/contexts';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Figtree, Nunito, Raleway, Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { SessionProvider } from "next-auth/react"
import { auth } from "@maany_shr/e-class-models"
import { NextAuthGateway } from "@maany_shr/e-class-auth"
import nextAuth from '../../auth/config';
import {
  createLanguages, createPlatformLanguages,
  createPlatforms,
  initializeCMSFastAPIClient, initializeHomePages, initializeTopics, registerFiles, uploadFilesToMinio
} from '../../lib/infrastructure/cms-fastapi/initialize-data';
import Header from '../../components/header';
import Footer from '../../components/footer';

await initializeCMSFastAPIClient();
// await createPlatforms();
// await createLanguages();
// await createPlatformLanguages();
// await registerFiles();
// -await uploadFilesToMinio();
// await initializeHomePages();
// await initializeTopics();

export const metadata = {
  title: 'Welcome to Platform',
  description: 'Generated by create-nx-workspace',
};

const nunito = Nunito({
  weight: ['300', '400', '700'],
  variable: '--font-nunito',
  subsets: ['latin'],
});
const raleway = Raleway({
  weight: ['300', '400', '700'],
  variable: '--font-raleway',
  subsets: ['latin'],
});
const roboto = Roboto({
  weight: ['300', '400', '700'],
  variable: '--font-roboto',
  subsets: ['latin'],
});
const figtree = Figtree({
  weight: ['300', '400', '700'],
  variable: '--font-figtree',
  subsets: ['latin'],
});

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {


  const authGateway = new NextAuthGateway(nextAuth);
  const sessionDTO = await authGateway.getSession();
  let session: auth.TSession | undefined;
  if (sessionDTO.success) {
    session = sessionDTO.data;
  }

  const params = await paramsPromise;
  const locale = params?.locale as TLocale;

  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  // TODO: prefetch platform logo & name to inject into header and footer
  return (
    <html lang={locale}>
    <body
      className={`${nunito.variable} ${roboto.variable} ${raleway.variable} ${figtree.variable}`}
    >
    <SessionProvider session={session}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>
          <div
            className="w-full min-h-screen bg-black bg-cover bg-repeat-y flex flex-col justify-center items-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://res.cloudinary.com/dnhiejjyu/image/upload/v1744280995/background-eln_fw9lpn.jpg')`
            }}
          >
            <Header locale={locale} availableLocales={i18nConfig.locales} session={session} />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
              {children}
            </main>
            <Footer availableLocales={i18nConfig.locales} locale={locale} />
          </div>
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
    </body>
    </html>
  );
}
