import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers'; 

export default getRequestConfig(async () => {
  const headerList = headers(); 
  const locale = (await headerList).get('X-NEXT-INTL-LOCALE') || 'en'; 

  const messages = await import(
    `../../../../packages/translations/src/lib/dictionaries/${locale}.json`
  );

  return {
    locale,
    messages: messages.default,
  };
});
