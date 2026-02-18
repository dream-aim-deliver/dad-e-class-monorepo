import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(['en', 'de'], requested) ? requested : 'en';
    const messages = getDictionary(locale as TLocale);
    return {
        locale,
        messages: messages,
    };
});
