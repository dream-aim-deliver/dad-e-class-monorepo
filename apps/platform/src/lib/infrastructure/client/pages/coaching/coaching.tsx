'use client';

import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { useGetCoachingPagePresenter } from '../../hooks/use-coaching-page-presenter';
import { Suspense, useState } from 'react';
import DefaultLoading from '../../wrappers/default-loading';
import {
    CoachBanner,
    CoachCardListSkeleton,
    DefaultError,
    Outline,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import CategoryTopics from '../common/category-topics';
import CoachingCoachList from './coaching-coach-list';

interface CoachingsProps {
    initialSelectedTopics?: string[];
}

export default function Coaching({ initialSelectedTopics }: CoachingsProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const t = useTranslations('pages.coaching');

    const [selectedTopics, setSelectedTopics] = useState<string[]>(
        initialSelectedTopics ?? [],
    );

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
            <SectionHeading text={t('chooseCategory')} />
            <CategoryTopics
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
                filterText={t('filterByTopic')}
            />
            <Suspense fallback={<CoachCardListSkeleton />}>
                <CoachingCoachList selectedTopics={selectedTopics} />
            </Suspense>
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
