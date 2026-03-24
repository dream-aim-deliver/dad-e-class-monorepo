'use client';

import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../trpc/cms-client';
import { useGetPlatformLanguagePresenter } from '../hooks/use-platform-language-presenter';
import { useState } from 'react';
import {
    DefaultLoading,
    DefaultError,
    RichTextRenderer,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

export default function AboutPage() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.aboutPage');

    const [aboutPageResponse, { refetch: refetchAboutPage }] = trpc.getPlatformLanguage.useSuspenseQuery({});
    const [aboutPageViewModel, setAboutPageViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);
    const [richTextError, setRichTextError] = useState<boolean>(false);

    const { presenter } = useGetPlatformLanguagePresenter(
        setAboutPageViewModel,
    );

    // @ts-ignore
    presenter.present(aboutPageResponse, aboutPageViewModel);

    // Loading state using discovered patterns
    if (!aboutPageViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error handling - API/data fetch failed
    if (aboutPageViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('loadError.title')}
                description={t('loadError.description')}
                onRetry={() => refetchAboutPage()}
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
                    refetchAboutPage();
                }}
            />
        );
    }

    // Success state - extract data using discovered pattern
    const aboutPageData = aboutPageViewModel.data;

    return (
        <div className="flex flex-col space-y-5 max-w-[45rem] mx-auto">
            <h1>{t('title')}</h1>
            {aboutPageData.aboutPageContent && (
                <RichTextRenderer
                    content={aboutPageData.aboutPageContent}
                    onDeserializationError={(message, error) => {
                        console.error('Error deserializing about page content:', message, error);
                        setRichTextError(true);
                    }}
                    className="prose text-text-primary"
                />
            )}
        </div>
    );
}
