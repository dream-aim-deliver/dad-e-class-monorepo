import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);
console.log("hello");

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\.[^/]+$).*)',
};
