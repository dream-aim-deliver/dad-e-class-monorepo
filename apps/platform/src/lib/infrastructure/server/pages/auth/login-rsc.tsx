import { TLocale } from '@maany_shr/e-class-translations';
import { getLocale } from 'next-intl/server';
import { connection } from 'next/server';
import LoginPageWithSuspense from '../../../client/pages/login';
import nextAuth from '../../config/auth/next-auth.config';
import env from '../../config/env';

export default async function LoginServerComponent() {
    // Opt into dynamic rendering for runtime environment variables
    // This causes env.ts to be evaluated at request time, not build time
    await connection();

    const signIn = nextAuth.signIn;

    // Get runtime configuration from env.ts (evaluated at request time due to connection() above)
    const runtimeConfig = {
        NEXT_PUBLIC_E_CLASS_RUNTIME: env.NEXT_PUBLIC_E_CLASS_RUNTIME,
        NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME,
        NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_E_CLASS_CMS_REST_URL: env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL,
        defaultTheme: env.DEFAULT_THEME,
    };

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
            isProduction={true}
            runtimeConfig={runtimeConfig}
        />
    );
}
