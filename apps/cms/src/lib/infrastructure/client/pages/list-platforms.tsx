'use client';
import { trpc } from '../trpc/cms-client';
import { useLocale, useTranslations } from 'next-intl';
import {
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    PlatformCard,
    PlatformCardList,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import dynamic from 'next/dynamic';
import { viewModels } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { useListPlatformsPresenter } from '../hooks/use-list-platforms-presenter';
import { useRouter } from 'next/navigation';


export default function ListPlatforms() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.listPlatforms');
    const router = useRouter();

    const [platformsResponse, { refetch }] = trpc.listPlatforms.useSuspenseQuery({});
    const [platformsViewModel, setPlatformsViewModel] = useState<
        viewModels.TPlatformListViewModel | undefined
    >(undefined);
    const { presenter } = useListPlatformsPresenter(setPlatformsViewModel);
    // @ts-ignore
    presenter.present(platformsResponse, platformsViewModel);

    if (!platformsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (platformsViewModel.mode === 'not-found') {
        return <DefaultNotFound locale={locale} />;
    }

    if (platformsViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
                onRetry={() => {
                    refetch();
                }}
            />
        );
    }

    const platforms = platformsViewModel.data.platforms;

    const onClickManage = (platformSlug: string, platformLanguage: string) => {
        router.push(`/platform/${platformSlug}/${platformLanguage}`);
    };

    return (
        <div className="flex flex-col items-center">
            <PlatformCardList locale={locale}>
                {platforms.map((platform) => (
                    <PlatformCard
                        key={platform.id}
                        imageUrl={platform.logoUrl || ''}
                        platformName={platform.name}
                        courseCount={platform.courseCount}
                        onClickManage={() => onClickManage(platform.slug, platform.defaultLanguageCode || 'en')}
                        locale={locale}
                    />
                ))}
            </PlatformCardList>
        </div>
    );
}
