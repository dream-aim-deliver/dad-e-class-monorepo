import './global.css';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit/contexts';
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from 'next-intl/server';
import { Figtree, Nunito, Raleway, Roboto } from 'next/font/google';

export const metadata = {
  title: 'Welcome to platform',
  description: 'Generated by create-nx-workspace',
};

const nunito = Nunito({
  weight: ["400", "700"],
  variable: "--font-nunito",
  subsets: ["latin"],
});

const raleway = Raleway({
  weight: ["400", "700"],
  variable: "--font-raleway",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["400", "700"],
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  weight: ["400", "700"],
  variable: "--font-figtree",
  subsets: ["latin"],
})



export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string }
}) {
  const locale = params.locale;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${nunito.variable} ${roboto.variable} ${raleway.variable} ${figtree.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="w-full min-h-screen bg-card-fill flex flex-col items-center">
              <main className="flex-grow w-full max-w-screen-2xl  pt-24">
                {children}
              </main>
              
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
