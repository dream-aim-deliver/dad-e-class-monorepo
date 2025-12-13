import { viewModels } from '@maany_shr/e-class-models';
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

interface OffersCarouselProps {
    items: viewModels.TGetOffersPageOutlineSuccess['items'];
}

export default function OffersCarousel({ items }: OffersCarouselProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    return (
        <Carousel locale={locale}>
            {items.map((item) => {
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
                        imageUrl={item.image?.downloadUrl ?? ''}
                        buttonText={item.buttonText}
                        buttonUrl={item.buttonUrl}
                        badge={item.badge ?? undefined}
                    />
                );
            })}
        </Carousel>
    );
}
