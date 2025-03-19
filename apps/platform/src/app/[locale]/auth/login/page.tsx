import { TLocale } from "@maany_shr/e-class-translations";
import LoginPageWithSuspense from "apps/platform/src/components/login";
import { getLocale } from "next-intl/server";
export default async function Login() {
  const platform = process.env.E_CLASS_PLATFORM_NAME || 'E-Class';
  const locale = await getLocale();
  return (
    <LoginPageWithSuspense platform={platform} locale={locale as TLocale}/>
  )
}