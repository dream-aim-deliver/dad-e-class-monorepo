'use client';
import { trpc } from '../trpc/client';
import { useLocale, useTranslations } from 'next-intl';
import TopicList, {
    CarouselSkeleton,
    CoachingOnDemandBanner,
    Divider,
    GeneralCard,
    Hero,
    HomeAccordion,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Carousel = dynamic(
    () => import('@maany_shr/e-class-ui-kit').then((mod) => mod.Carousel),
    {
        ssr: false,
        loading: () => <CarouselSkeleton />,
    },
);

export type HomeProps = {};

export default function Home(props: HomeProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.home');

    const [homePage] = trpc.getHomePage.useSuspenseQuery();
    const [topics] = trpc.getHomePageTopics.useSuspenseQuery();

    return (
        <div className="flex flex-col">
            <Hero
                locale={locale}
                title={homePage.banner.title}
                description={homePage.banner.description}
                thumbnailUrl={homePage.banner.thumbnailUrl}
                videoId={homePage.banner.videoId}
            />
            <Divider />
            <Carousel locale={locale}>
                {homePage.carousel.map((item) => {
                    const onClick = () => {};
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
            <TopicList list={topics} title={t('topicsTitle')} />
            {/* Breakpoints might be adjusted here */}
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
            <HomeAccordion
                title={homePage.accordion.title}
                showNumbers={homePage.accordion.showNumbers}
                items={homePage.accordion.items}
            />
        </div>
    );
}
