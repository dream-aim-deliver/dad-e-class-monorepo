import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
    const headerList = headers();
    const locale = (await headerList).get('X-NEXT-INTL-LOCALE') || 'en';

    const messages = getDictionary(locale as TLocale);

    return {
        locale,
        messages: messages,
    };
});
