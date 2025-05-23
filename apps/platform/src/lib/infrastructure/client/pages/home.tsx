'use client';
import { trpc } from '../trpc/client';
import { useLocale } from 'next-intl';
import { Hero } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';

export type HomeProps = {};

export default function Home(props: HomeProps) {
    const locale = useLocale() as TLocale;

    const [data] = trpc.getHomePage.useSuspenseQuery();

    return (
        <div className="flex flex-col">
            <Hero
                locale={locale}
                title={data.banner.title}
                description={data.banner.description}
                thumbnailUrl={data.banner.thumbnailUrl}
                videoId={data.banner.videoId}
            />
        </div>
    );
}
