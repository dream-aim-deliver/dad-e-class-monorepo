import createMiddleware from 'next-intl/middleware';
import { i18nConfig } from '@maany_shr/e-class-translations';
import AuthContext from './auth/config';
import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

const auth = AuthContext.auth;

const i18n = createMiddleware({
  locales: i18nConfig.locales,
  defaultLocale: i18nConfig.defaultLocale
});

export default async function middleware(req: NextRequest, res: NextApiResponse) {
  const apiReq = req as unknown as NextApiRequest;
  // const { pathname } = req.nextUrl;
  // const isPathAllowed = ['/img', 'img', '/api'].some((allowedPath) =>
  //   pathname.startsWith(`${allowedPath}`),
  // );
  // const pathnameHasLocale = locales.some(
  //   (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  // );
  // if (!isPathAllowed && !pathnameHasLocale) {
  //   const locale = HOW TO GET LOCALE HERE? Is there a cookie?
  //   req.nextUrl.pathname = `/${locale}${pathname}`;
  //   return res.redirect(req.nextUrl);
  // }
  await auth(apiReq, res);
  return i18n(req);
} 
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
