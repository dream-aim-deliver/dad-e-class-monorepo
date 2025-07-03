'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultError } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';

// TODO: localize and style the error page
export default function Page({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const locale = useLocale() as TLocale;
    return <DefaultError locale={locale} onRetry={reset} />;
}
