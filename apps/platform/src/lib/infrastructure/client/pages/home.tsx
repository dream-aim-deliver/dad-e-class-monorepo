'use client';
import { trpc } from '../trpc/client';
import { useLocale, useTranslations } from 'next-intl';
import {
    CarouselSkeleton,
    CoachingOnDemandBanner,
    DefaultError,
    DefaultLoading,
    Divider,
    GeneralCard,
    Hero,
    HomeAccordion,
    TopicList,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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

export default function Home() {
    const locale = useLocale() as TLocale;

    const [homePageResponse] = trpc.getHomePage.useSuspenseQuery({});
    const [homePageViewModel, setHomePageViewModel] = useState<
        viewModels.THomePageViewModel | undefined
    >(undefined);
    const { presenter: homePagePresenter } =
        useGetHomePagePresenter(setHomePageViewModel);
    homePagePresenter.present(homePageResponse, homePageViewModel);

    const router = useRouter();

    if (!homePageViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (homePageViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const homePage = homePageViewModel.data;

    return (
        <div className="flex flex-col items-center">
            <div className="gap-4 px-30 mb-15">
                <Hero
                    locale={locale}
                    title={homePage.banner.title}
                    description={homePage.banner.description}
                    thumbnailUrl={homePage.banner.thumbnailUrl}
                    videoId={homePage.banner.videoId}
                />
                <Divider />
                <Carousel locale={locale}>
                    {homePage.carousel.map((item: viewModels.TGeneralCard) => {
                        const onClick = () => {
                            router.push(item.buttonUrl);
                        };
                        return (
                            <GeneralCard
                                key={item.title}
                                locale={locale}
                                onButtonClick={onClick}
                                {...item}
                            />
                        );
                    })}
                </Carousel>
                <Divider />
                <Topics />
            </div>
            {/* Breakpoints might be adjusted here */}
            <div className="bg-base-neutral-950 px-30 py-10 mb-15">
                <CoachingOnDemandBanner
                    title={homePage.coachingOnDemand.title}
                    description={homePage.coachingOnDemand.description}
                    images={
                        <>
                            <Image
                                src={homePage.coachingOnDemand.mobileImageUrl}
                                alt="Coaching on Demand"
                                width={640}
                                height={640}
                                className="w-full h-auto sm:hidden"
                                sizes="(max-width: 640px) 100vw, 0px"
                            />
                            <Image
                                src={homePage.coachingOnDemand.tabletImageUrl}
                                alt="Coaching on Demand"
                                width={1024}
                                height={1024}
                                className="w-full h-auto max-sm:hidden lg:hidden"
                                sizes="(min-width: 768px) and (max-width: 1023px) 100vw, 0px"
                            />
                            <Image
                                src={homePage.coachingOnDemand.desktopImageUrl}
                                alt="Coaching on Demand"
                                width={1920}
                                height={1080}
                                className="w-full h-auto hidden lg:block"
                                sizes="(min-width: 1024px) 100vw, 0px"
                            />
                        </>
                    }
                />
            </div>
            <div className="w-full px-30">
                <HomeAccordion
                    title={homePage.accordion.title}
                    showNumbers={homePage.accordion.showNumbers}
                    items={homePage.accordion.items}
                />
            </div>
        </div>
    );
}
