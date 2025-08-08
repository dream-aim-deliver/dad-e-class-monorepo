'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultNotFound } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';

export default function NotFound() {
    const locale = useLocale() as TLocale;
    return <DefaultNotFound locale={locale} />;
}
