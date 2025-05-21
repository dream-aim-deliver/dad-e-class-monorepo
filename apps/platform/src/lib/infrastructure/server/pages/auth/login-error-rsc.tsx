import { getLocale } from 'next-intl/server';
import ErrorPage from '../../../client/pages/login-error';
import { TLocale } from '@maany_shr/e-class-translations';

export default async function LoginErrorServerComponent() {
    // TODO: the platform name is passed from the backend
    const platform = 'E-Class';
    const locale = await getLocale();
    return <ErrorPage platform={platform} locale={locale as TLocale} />;
}
