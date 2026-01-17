'use client';

import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../trpc/cms-client';
import { useGetPlatformLanguagePresenter } from '../hooks/use-platform-language-presenter';
import { useState, useEffect } from 'react';
import {
    DefaultLoading,
    DefaultError,
    DefaultNotFound,
    RichTextRenderer,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';

export default function ImpressumPage() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.impressum');

    const [impressumResponse, { refetch: refetchImpressum }] = trpc.getPlatformLanguage.useSuspenseQuery({});
    const [impressumViewModel, setImpressumViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);
    const [richTextError, setRichTextError] = useState<boolean>(false);

    const { presenter } = useGetPlatformLanguagePresenter(
        setImpressumViewModel,
    );

    // @ts-ignore
    presenter.present(impressumResponse, impressumViewModel);

    const router = useRouter();

    // Loading state using discovered patterns
    if (!impressumViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error handling - API/data fetch failed
    if (impressumViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('loadError.title')}
                description={t('loadError.description')}
                onRetry={() => refetchImpressum()}
            />
        );
    }

    // Error handling - content parsing/display failed
    if (richTextError) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('contentError.title')}
                description={t('contentError.description')}
                onRetry={() => {
                    setRichTextError(false);
                    refetchImpressum();
                }}
            />
        );
    }

    // Success state - extract data using discovered pattern
    const impressumData = impressumViewModel.data;

    return (
        <div className="flex flex-col space-y-5 px-30">
            <h1>{t('title')}</h1>
            {impressumData.impressumContent && (
                <RichTextRenderer
                    content={impressumData.impressumContent}
                    onDeserializationError={(message, error) => {
                        console.error('Error deserializing impressum content:', message, error);
                        setRichTextError(true);
                    }}
                    className="prose max-w-none text-text-primary"
                />
            )}
        </div>
    );
}
