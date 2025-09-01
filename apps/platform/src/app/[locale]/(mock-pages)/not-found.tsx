'use client';

import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { DefaultNotFound } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);
    const router = useRouter();
    return (
        <div className="w-full mb-15">
        <DefaultNotFound
            locale={locale}
            onGoBack={() => router.push(`/${locale}`)}
            buttonLabel={dictionary.components.defaultNotFound.goBack}
        />
        </div>
    );
}
