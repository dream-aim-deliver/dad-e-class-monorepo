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

export default function OfferInformationPage() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.offerInformation');

    const [offerInformationResponse, { refetch: refetchOfferInformation }] = trpc.getPlatformLanguage.useSuspenseQuery({});
    const [offerInformationViewModel, setOfferInformationViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);
    const [richTextError, setRichTextError] = useState<boolean>(false);

    const { presenter } = useGetPlatformLanguagePresenter(
        setOfferInformationViewModel,
    );

    // @ts-ignore
    presenter.present(offerInformationResponse, offerInformationViewModel);

    const router = useRouter();

    // Loading state using discovered patterns
    if (!offerInformationViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error handling - kaboom
    if (offerInformationViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('loadError.title')}
                description={t('loadError.description')}
                onRetry={() => refetchOfferInformation()}
            />
        );
    }

    // Error handling - rich text deserialization error
    if (richTextError) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('contentError.title')}
                description={t('contentError.description')}
                onRetry={() => {
                    setRichTextError(false);
                    refetchOfferInformation();
                }}
            />
        );
    }

    // Success state - extract data using discovered pattern
    const offerInformationData = offerInformationViewModel.data;

    return (
        <div className="flex flex-col space-y-5 px-30">
            <h1>{t('title')}</h1>
            {offerInformationData.offerInformation && (
                <RichTextRenderer
                    content={offerInformationData.offerInformation}
                    onDeserializationError={(message, error) => {
                        console.error('Error deserializing offer information content:', message, error);
                        setRichTextError(true);
                    }}
                    className="prose max-w-none text-text-primary"
                />
            )}
        </div>
    );
}
