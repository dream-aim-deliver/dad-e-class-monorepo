import { TLocale } from "@maany_shr/e-class-translations";
import LoginPageWithSuspense from "apps/platform/src/components/login";
import { getLocale } from "next-intl/server";
export default async function Login() {
  const platform = process.env.E_CLASS_PLATFORM_NAME || 'E-Class';
  const enableTestAccounts = process.env.AUTH_ENABLE_TEST_ACCOUNTS?.trim().toLowerCase() === 'true';
  const locale = await getLocale();
  return (
    <LoginPageWithSuspense platform={platform} locale={locale as TLocale} enableCredentials={enableTestAccounts}/>
  )
}