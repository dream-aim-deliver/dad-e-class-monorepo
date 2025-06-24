import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { useState } from 'react';
import { useGetOffersPageCarouselPresenter } from '../../hooks/use-offers-page-carousel-presenter';
import {
    CarouselSkeleton,
    DefaultError,
    DefaultLoading,
    GeneralCard,
} from '@maany_shr/e-class-ui-kit';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';

const Carousel = dynamic(
    () =>
        import('../../wrappers/carousel-wrapper').then(
            (mod) => mod.CarouselWrapper,
        ),
    {
        ssr: false,
        loading: () => <CarouselSkeleton />,
    },
);

export default function OffersCarousel() {
    const [carouselResponse] = trpc.getOffersPageCarousel.useSuspenseQuery({});
    const [carouselViewModel, setCarouselViewModel] = useState<
        viewModels.TOffersPageCarouselViewModel | undefined
    >(undefined);
    const { presenter } =
        useGetOffersPageCarouselPresenter(setCarouselViewModel);
    presenter.present(carouselResponse, carouselViewModel);
    const locale = useLocale() as TLocale;
    const router = useRouter();

    if (!carouselViewModel) {
        return <DefaultLoading />;
    }

    if (carouselViewModel.mode !== 'default') {
        return <DefaultError errorMessage={carouselViewModel.data.message} />;
    }

    const carousel = carouselViewModel.data;

    return (
        <Carousel locale={locale}>
            {carousel.items.map((item) => {
                const onClick = () => {
                    router.push(item.buttonUrl);
                };
                return (
                    <GeneralCard
                        key={item.title}
                        locale={locale}
                        onButtonClick={onClick}
                        title={item.title}
                        description={item.description}
                        imageUrl={item.imageUrl ?? ''}
                        buttonText={item.buttonText}
                        buttonUrl={item.buttonUrl}
                        badge={item.badge ?? undefined}
                    />
                );
            })}
        </Carousel>
    );
}
