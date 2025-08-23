'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';

export default function DefaultLoadingWrapper() {
    const locale = useLocale() as TLocale;
    return <DefaultLoading locale={locale} variant="minimal" />;
}
