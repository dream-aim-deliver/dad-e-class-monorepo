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

export default function RulesPage() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.rules');

    const [rulesResponse, { refetch: refetchRules }] = trpc.getPlatformLanguage.useSuspenseQuery({});
    const [rulesViewModel, setRulesViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);
    const [richTextError, setRichTextError] = useState<boolean>(false);

    const { presenter } = useGetPlatformLanguagePresenter(
        setRulesViewModel,
    );

    // @ts-ignore
    presenter.present(rulesResponse, rulesViewModel);

    const router = useRouter();

    // Loading state using discovered patterns
    if (!rulesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error handling - API/data fetch failed
    if (rulesViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('loadError.title')}
                description={t('loadError.description')}
                onRetry={() => refetchRules()}
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
                    refetchRules();
                }}
            />
        );
    }

    // Success state - extract data using discovered pattern
    const rulesData = rulesViewModel.data;

    return (
        <div className="flex flex-col space-y-5 px-30">
            <h1>{t('title')}</h1>
            {rulesData.rules && (
                <RichTextRenderer
                    content={rulesData.rules}
                    onDeserializationError={(message, error) => {
                        console.error('Error deserializing rules content:', message, error);
                        setRichTextError(true);
                    }}
                    className="prose max-w-none text-text-primary"
                />
            )}
        </div>
    );
}
