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
import { UsercentricsSecondLayerLink } from '../analytics';

export default function PrivacyPolicyPage() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.privacyPolicy');

    const [privacyPolicyResponse, { refetch: refetchPrivacyPolicy }] = trpc.getPlatformLanguage.useSuspenseQuery({});
    const [privacyPolicyViewModel, setPrivacyPolicyViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);
    const [richTextError, setRichTextError] = useState<boolean>(false);

    const { presenter } = useGetPlatformLanguagePresenter(
        setPrivacyPolicyViewModel,
    );

    // @ts-ignore
    presenter.present(privacyPolicyResponse, privacyPolicyViewModel);

    const router = useRouter();

    // Loading state using discovered patterns
    if (!privacyPolicyViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Error handling - API/data fetch failed
    if (privacyPolicyViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('loadError.title')}
                description={t('loadError.description')}
                onRetry={() => refetchPrivacyPolicy()}
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
                    refetchPrivacyPolicy();
                }}
            />
        );
    }

    // Success state - extract data using discovered pattern
    const privacyPolicyData = privacyPolicyViewModel.data;

    return (
        <div className="flex flex-col space-y-5 px-30">
            <h1>{t('title')}</h1>
            {privacyPolicyData.privacyPolicyContent && (
                <RichTextRenderer
                    content={privacyPolicyData.privacyPolicyContent}
                    onDeserializationError={(message, error) => {
                        console.error('Error deserializing privacy policy content:', message, error);
                        setRichTextError(true);
                    }}
                    className="prose max-w-none text-text-primary"
                />
            )}
            {/*
             * Link that opens Usercentrics' second layer (detailed settings +
             * cookie declaration). Required by GDPR Art. 13 and Swiss FMG
             * Art. 45c. Renders nothing when the tenant has no
             * NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID configured.
             */}
            <UsercentricsSecondLayerLink className="underline text-base-brand-500 self-start">
                Manage cookies and view the full cookie list
            </UsercentricsSecondLayerLink>
        </div>
    );
}
