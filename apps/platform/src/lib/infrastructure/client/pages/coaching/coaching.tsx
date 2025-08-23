'use client';

import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { useGetCoachingPagePresenter } from '../../hooks/use-coaching-page-presenter';
import { Suspense, useState } from 'react';
import {
    CoachBanner,
    CoachCardListSkeleton,
    CoachesSkeleton,
    DefaultError,
    DefaultLoading,
    Outline,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import CategoryTopics from '../common/category-topics';
import CoachingCoachList from './coaching-coach-list';
import { useSession } from 'next-auth/react';
import CoachingOfferingsPanel from './coaching-offerings-panel';

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

    const sessionDTO = useSession();
    const session = sessionDTO.data;
    const isLoggedIn = !!session;

    if (!coachingPageViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachingPageViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const coachingPage = coachingPageViewModel.data;

    return (
        <div className="flex flex-col space-y-5 px-30">
            <Outline
                title={coachingPage.title}
                description={coachingPage.description}
            />
            <h2> {t('chooseCategory')} </h2>
            <CategoryTopics
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
                filterText={t('filterByTopic')}
            />
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
                <CoachingOfferingsPanel />
                <Suspense fallback={<CoachCardListSkeleton />}>
                    <CoachingCoachList selectedTopics={selectedTopics} />
                </Suspense>
            </div>
            {!isLoggedIn && (
                <CoachesSkeleton
                    onRegister={() => {
                        router.push('/signup');
                    }}
                    locale={locale}
                />
            )}
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
