import { getLocale } from 'next-intl/server';
import ErrorPage from '../../../client/pages/login-error';
import { TLocale } from '@maany_shr/e-class-translations';

export default async function LoginErrorServerComponent() {
    const platform = process.env.E_CLASS_PLATFORM_SHORT_NAME || 'E-Class';
    const locale = await getLocale();
    return <ErrorPage platform={platform} locale={locale as TLocale} />;
}
