'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultError } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { usePlatform } from '../../../lib/infrastructure/client/context/platform-context';

export default function Page({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.errorBoundary');
    const platformContext = usePlatform();
    const supportEmail = platformContext?.platform.supportEmailAddress;

    return (
        <div className='px-15'>
            {supportEmail && supportEmail.trim() !== '' ? (
                <DefaultError
                    type="withSupportEmail"
                    locale={locale}
                    title={t('title')}
                    description={error.message || t('description')}
                    supportEmailAddress={supportEmail}
                    onRetry={reset}
                />
            ) : (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={t('title')}
                    description={error.message || t('description')}
                    onRetry={reset}
                />
            )}
        </div>
    );
}
