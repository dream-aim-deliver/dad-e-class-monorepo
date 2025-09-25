'use client';
import { trpc } from '../trpc/cms-client';
import { useLocale, useTranslations } from 'next-intl';
import {
    CarouselSkeleton,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    PlatformCard,
    PlatformCardList,
    TopicList,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import dynamic from 'next/dynamic';
import { viewModels } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { useListPlatformsPresenter } from '../hooks/use-list-platforms-presenter';

const Carousel = dynamic(
    () =>
        import('../wrappers/carousel-wrapper').then(
            (mod) => mod.CarouselWrapper,
        ),
    {
        ssr: false,
        loading: () => <CarouselSkeleton />,
    },
);


export default function ListPlatforms() {
    const locale = useLocale() as TLocale;

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
                locale={locale}
                onRetry={() => {
                    refetch();
                }}
            />
        );
    }

    const platforms = platformsViewModel.data.platforms;

    const onClickManage = (platformId: number, platformName: string) => {
        // TODO: Navigate to platform management page
        console.log(`Managing platform ${platformId}: ${platformName}`);
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
                        onClickManage={() => onClickManage(platform.id, platform.name)}
                        locale={locale}
                    />
                ))}
            </PlatformCardList>
        </div>
    );
}
