'use client';

import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../trpc/client';
import { useGetCoachingPagePresenter } from '../hooks/use-coaching-page-presenter';
import { useState } from 'react';
import DefaultLoading from '../wrappers/default-loading';
import { CoachBanner, DefaultError, Outline } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';

interface CoachingsProps {
    initialSelectedTopics?: string[];
}

export default function Coaching({ initialSelectedTopics }: CoachingsProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const [coachingPageResponse] = trpc.getCoachingPage.useSuspenseQuery({});
    const [coachingPageViewModel, setCoachingPageViewModel] = useState<
        viewModels.TCoachingPageViewModel | undefined
    >(undefined);

    const { presenter } = useGetCoachingPagePresenter(setCoachingPageViewModel);
    presenter.present(coachingPageResponse, coachingPageViewModel);

    // Loading state
    if (!coachingPageViewModel) {
        return <DefaultLoading />;
    }

    // Error state
    if (coachingPageViewModel.mode !== 'default') {
        return (
            <DefaultError errorMessage={coachingPageViewModel.data.message} />
        );
    }

    const coachingPage = coachingPageViewModel.data;

    return (
        <div className="flex flex-col space-y-5">
            <Outline
                title={coachingPage.title}
                description={coachingPage.description}
            />
            <CoachBanner
                locale={locale}
                title={coachingPage.banner.title}
                description={coachingPage.banner.description}
                imageUrl={coachingPage.banner.imageUrl ?? ''}
                buttonText={coachingPage.banner.buttonText}
                subtitle=""
                onClick={() => {
                    router.push(coachingPage.banner.buttonLink);
                }}
            />
        </div>
    );
}
