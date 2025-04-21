import { TLocale } from "@maany_shr/e-class-translations";
import ErrorPage from "../../../../components/login-error";
import { getLocale } from "next-intl/server";

export default async function Login() {
  const platform = process.env.E_CLASS_PLATFORM_SHORT_NAME || 'E-Class';
  const locale = await getLocale();
  return (
    <ErrorPage platform={platform} locale={locale as TLocale}/>
  )
}