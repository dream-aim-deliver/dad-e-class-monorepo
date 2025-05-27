'use client';
import { trpc } from '../trpc/client';
import { useLocale, useTranslations } from 'next-intl';
import TopicList, {
    CarouselSkeleton,
    Divider,
    GeneralCard,
    Hero,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import dynamic from 'next/dynamic';

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
        </div>
    );
}
