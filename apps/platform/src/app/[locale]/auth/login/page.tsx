import { TLocale } from "@maany_shr/e-class-translations";
import LoginPageWithSuspense from "../../../../components/login";
import { getLocale } from "next-intl/server";
import nextAuth  from "../../../../auth/config";
export default async function Login() {
  const signIn = nextAuth.signIn;
  const platform = process.env.E_CLASS_PLATFORM_NAME || 'E-Class';
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevMode = process.env.E_CLASS_DEV_MODE?.trim().toLocaleLowerCase() === 'true';
  const enableTestAccounts = process.env.AUTH_ENABLE_TEST_ACCOUNTS?.trim().toLowerCase() === 'true';
  const prod = isProduction && !isDevMode;
  const locale = await getLocale();
  return (
    <LoginPageWithSuspense platform={platform} locale={locale as TLocale} enableCredentials={enableTestAccounts} isProduction={prod}/>
  )
}