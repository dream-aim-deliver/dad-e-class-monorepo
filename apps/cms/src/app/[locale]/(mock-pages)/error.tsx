'use client';

import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { DefaultError } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { usePlatform } from '../../../lib/infrastructure/client/context/platform-context';

export default function Page({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);
    const platformContext = usePlatform();
    const supportEmail = platformContext?.platform.supportEmailAddress;

    return (
        <div className='px-15'>
            {supportEmail && supportEmail.trim() !== '' ? (
                <DefaultError
                    type="withSupportEmail"
                    locale={locale}
                    title={dictionary.components.defaultError.title}
                    description={error.message || dictionary.components.defaultError.description}
                    supportEmailAddress={supportEmail}
                    onRetry={reset}
                />
            ) : (
                <DefaultError
                    type="simple"
                    locale={locale}
                    title={dictionary.components.defaultError.title}
                    description={error.message || dictionary.components.defaultError.description}
                    onRetry={reset}
                />
            )}
        </div>
    );
}
