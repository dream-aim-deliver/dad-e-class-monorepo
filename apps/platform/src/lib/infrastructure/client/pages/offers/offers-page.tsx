'use client';

import {
    CarouselSkeleton,
    CoachCardListSkeleton,
    CourseCardListSkeleton,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    Divider,
    Outline,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { Suspense, lazy, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetOffersPageOutlinePresenter } from '../../hooks/use-get-offers-page-outline-presenter';
import { useLocale, useTranslations } from 'next-intl';
import OffersFilters from './offers-filters';
import { OffersCourseHeading, OffersCourseList } from './offers-course-list';
import OffersCoachList from './offers-coach-list';
import { TLocale } from '@maany_shr/e-class-translations';

const PackageList = lazy(() => import('./offers-package-list'));
const Carousel = lazy(() => import('./offers-carousel'));

interface OffersPageProps {
    initialSelectedTopics?: string[];
}

export default function OffersPage(props: OffersPageProps) {
    // Data fetching and presentation logic
    const [outlineResponse] = trpc.getOffersPageOutline.useSuspenseQuery({});
    const [outlineViewModel, setOutlineViewModel] = useState<
        viewModels.TGetOffersPageOutlineViewModel | undefined
    >(undefined);

    const { presenter } = useGetOffersPageOutlinePresenter(setOutlineViewModel);
    // @ts-ignore
    presenter.present(outlineResponse, outlineViewModel);

    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.offers');

    // Filter
    const [selectedTopics, setSelectedTopics] = useState<string[]>(
        props.initialSelectedTopics ?? [],
    );
    const [coachingIncluded, setCoachingIncluded] = useState<boolean>(false);

    if (!outlineViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (outlineViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('loadError.title')}
                description={t('loadError.description')}
            />
        );
    }

    if (outlineViewModel.mode === 'not-found') {
        return <DefaultNotFound locale={locale} />;
    }

    const outline = outlineViewModel.data;

    return (
        <div className="flex flex-col space-y-5 px-30">
            <Outline title={outline.title} description={outline.description} />
            <OffersFilters
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
            />
            <Divider className="my-12" />
            <OffersCourseHeading
                coachingIncluded={coachingIncluded}
                setCoachingIncluded={setCoachingIncluded}
            />
            <Suspense fallback={<CourseCardListSkeleton />}>
                <OffersCourseList
                    selectedTopics={selectedTopics}
                    coachingIncluded={coachingIncluded}
                />
            </Suspense>
            <Divider className="my-12" />
            <h2> {t('ourPackages')} </h2>
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <PackageList />
            </Suspense>
            <Divider className="my-12" />
            <h2> {t('coachingOnDemand')} </h2>
            <Suspense fallback={<CoachCardListSkeleton />}>
                <OffersCoachList selectedTopics={selectedTopics} />
            </Suspense>
            <Divider className="my-12" />
            <h2> {t('haveNotFound')} </h2>
            <Suspense fallback={<CarouselSkeleton />}>
                <Carousel items={outline.items} />
            </Suspense>
        </div>
    );
}
