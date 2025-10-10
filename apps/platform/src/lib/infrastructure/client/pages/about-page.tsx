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

export default function AboutPage() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.aboutPage');

    const [aboutPageResponse] = trpc.getPlatformLanguage.useSuspenseQuery({});
    const [aboutPageViewModel, setAboutPageViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);
    const [richTextError, setRichTextError] = useState<boolean>(false);

    const { presenter } = useGetPlatformLanguagePresenter(
        setAboutPageViewModel,
    );

    // @ts-ignore
    presenter.present(aboutPageResponse, aboutPageViewModel);

    const router = useRouter();

    // Loading state using discovered patterns
    if (!aboutPageViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error handling - kaboom
    if (aboutPageViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    // Error handling - rich text deserialization error
    if (richTextError) {
        return <DefaultError locale={locale} />;
    }

    // Success state - extract data using discovered pattern
    const aboutPageData = aboutPageViewModel.data;

    return (
        <div className="flex flex-col space-y-5 px-30">
            <h1>{t('title')}</h1>
            {aboutPageData.aboutPageContent && (
                <RichTextRenderer
                    content={aboutPageData.aboutPageContent}
                    onDeserializationError={(message, error) => {
                        console.error('Error deserializing about page content:', message, error);
                        setRichTextError(true);
                    }}
                    className="prose max-w-none text-text-primary"
                />
            )}
        </div>
    );
}
