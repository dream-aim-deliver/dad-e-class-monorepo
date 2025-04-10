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

await initializeCMSFastAPIClient();
await createPlatforms();
await createLanguages();
await createPlatformLanguages();
await registerFiles();
await uploadFilesToMinio();
await initializeHomePages();



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
  let session: auth.TSession | null = null;
  if (!sessionDTO.success) {
    session = null;
  } else {
    session = sessionDTO.data;
  }

  const params = await paramsPromise;
  const locale = params?.locale;


  if (!i18nConfig.locales.includes(locale as TLocale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${nunito.variable} ${roboto.variable} ${raleway.variable} ${figtree.variable}`}
      >
        <SessionProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
              <div className="w-full min-h-screen bg-black flex flex-col items-center">
                <main className="flex-grow w-full max-w-screen-2xl pt-24">
                  {children}
                </main>
              </div>
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}