'use client';
import { trpc } from '../trpc/cms-client';
import { useLocale, useTranslations } from 'next-intl';
import {
    CarouselSkeleton,
    DefaultError,
    DefaultLoading,
    PlatformCard,
    PlatformCardList,
    TopicList,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import dynamic from 'next/dynamic';
import { viewModels } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { useGetHomePagePresenter } from '../hooks/use-home-page-presenter';
import { useListTopicsPresenter } from '../hooks/use-topics-presenter';
import { useRouter } from 'next/navigation';

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

function Topics() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.home');

    const [topicsResponse, { refetch }] = trpc.listTopics.useSuspenseQuery({});
    const [topicsViewModel, setTopicsViewModel] = useState<
        viewModels.TTopicListViewModel | undefined
    >(undefined);
    const { presenter: topicsPresenter } =
        useListTopicsPresenter(setTopicsViewModel);
    // @ts-ignore
    topicsPresenter.present(topicsResponse, topicsViewModel);

    if (!topicsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (topicsViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                locale={locale}
                onRetry={() => {
                    refetch();
                }}
            />
        );
    }

    const topics = topicsViewModel.data.topics;

    return <TopicList list={topics} title={t('topicsTitle')} />;
}

export default function ListPlatforms() {
    const locale = useLocale() as TLocale;


    return (
        <div className="flex flex-col items-center">
                <PlatformCardList locale={locale}>
                    <PlatformCard
                        imageUrl={process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_LOGO_URL}
                        platformName={'Bewerbeagentur Mock'}
                        courseCount={10} 
                        onClickManage={function (): void {
                            throw new Error('Function not implemented.');
                        }} 
                        locale={locale}/>
                </PlatformCardList>
            
        </div>
    );
}
