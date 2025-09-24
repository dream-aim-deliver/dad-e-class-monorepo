import { TLocale } from '@maany_shr/e-class-translations';
import { getLocale } from 'next-intl/server';
import LoginPageWithSuspense from '../../../client/pages/login';
import nextAuth from '../../config/auth/next-auth.config';
import env from '../../config/env';

export default async function LoginServerComponent() {
    const signIn = nextAuth.signIn;
    const platform = env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME;
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevMode = env.E_CLASS_DEV_MODE;
    const enableTestAccounts = env.AUTH_ENABLE_TEST_ACCOUNTS;
    const prod = isProduction && !isDevMode;
    const locale = await getLocale();
    return (
        <LoginPageWithSuspense
            platform={platform}
            locale={locale as TLocale}
            enableCredentials={enableTestAccounts}
            isProduction={prod}
        />
    );
}
