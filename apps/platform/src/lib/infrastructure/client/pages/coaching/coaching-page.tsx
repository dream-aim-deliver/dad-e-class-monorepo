'use client';

import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/cms-client';
import { useGetCoachingPagePresenter } from '../../hooks/use-get-coaching-page-presenter';
import { Suspense, useState } from 'react';
import {
    CoachBanner,
    CoachCardListSkeleton,
    CoachesSkeleton,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    Outline,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import CategoryTopics from '../common/category-topics';
import CoachingCoachList from './coaching-coach-list';
import { useSession } from 'next-auth/react';
import CoachingOfferingsPanel from './coaching-offerings-panel';

interface CoachingPageProps {
    initialSelectedTopics?: string[];
}

export default function CoachingPage({ initialSelectedTopics }: CoachingPageProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const t = useTranslations('pages.coaching');

    const [selectedTopics, setSelectedTopics] = useState<string[]>(
        initialSelectedTopics ?? [],
    );

    const [coachingPageResponse] = trpc.getCoachingPage.useSuspenseQuery({});
    const [coachingPageViewModel, setCoachingPageViewModel] = useState<
        viewModels.TGetCoachingPageViewModel | undefined
    >(undefined);

    const { presenter } = useGetCoachingPagePresenter(setCoachingPageViewModel);
    // @ts-ignore
    presenter.present(coachingPageResponse, coachingPageViewModel);

    const sessionDTO = useSession();
    const session = sessionDTO.data;
    const isLoggedIn = !!session;

    if (!coachingPageViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachingPageViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (coachingPageViewModel.mode === 'not-found') {
        return <DefaultNotFound locale={locale} />;
    }

    const coachingPage = coachingPageViewModel.data;

    return (
        <div className="flex flex-col space-y-5 px-30">
            <Outline
                title={coachingPage.title}
                description={coachingPage.description}
            />
            <CategoryTopics
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
                chooseCategoryText={t('chooseCategory')}
                filterText={t('filterByTopic')}
            />
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
                <CoachingOfferingsPanel />
                <Suspense fallback={<CoachCardListSkeleton />}>
                    <CoachingCoachList selectedTopics={selectedTopics} />
                </Suspense>
            </div>
            {!isLoggedIn && (
                <div className="flex justify-center w-full">
                    <CoachesSkeleton
                        onRegister={() => {
                            router.push('/signup');
                        }}
                        locale={locale}
                    />
                </div>
            )}
            {coachingPage.banner.title &&
             coachingPage.banner.description &&
             coachingPage.banner.image?.downloadUrl && (
                <CoachBanner
                    locale={locale}
                    title={coachingPage.banner.title}
                    description={coachingPage.banner.description}
                    imageUrl={coachingPage.banner.image.downloadUrl}
                    buttonText={coachingPage.banner.buttonText}
                    subtitle=""
                    onClick={() => {
                        router.push(coachingPage.banner.buttonLink);
                    }}
                />
            )}
        </div>
    );
}
