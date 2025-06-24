'use client';

import {
    CourseCardListSkeleton,
    DefaultError,
    DefaultLoading,
    Divider,
    Outline,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/client';
import { Suspense, lazy, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetOffersPageOutlinePresenter } from '../../hooks/use-offers-page-outline-presenter';
import { useTranslations } from 'next-intl';
import OffersFilters from './offersFilters';
import { OffersCourseHeading, OffersCourseList } from './offersCourseList';

const PackageList = lazy(() => import('./offersPackageList'));

interface OffersProps {
    initialSelectedTopics?: string[];
}

export default function Offers(props: OffersProps) {
    // Data fetching and presentation logic
    const [outlineResponse] = trpc.getOffersPageOutline.useSuspenseQuery({});
    const [outlineViewModel, setOutlineViewModel] = useState<
        viewModels.TOffersPageOutlineViewModel | undefined
    >(undefined);

    const { presenter } = useGetOffersPageOutlinePresenter(setOutlineViewModel);
    presenter.present(outlineResponse, outlineViewModel);

    const t = useTranslations('pages.offers');

    // Filter
    const [selectedTopics, setSelectedTopics] = useState<string[]>(
        props.initialSelectedTopics ?? [],
    );
    const [coachingIncluded, setCoachingIncluded] = useState<boolean>(false);

    // Loading state
    if (!outlineViewModel) {
        return <DefaultLoading />;
    }

    // Error state
    if (outlineViewModel.mode === 'kaboom') {
        return <DefaultError errorMessage={outlineViewModel.data.message} />;
    }

    const outline = outlineViewModel.data;

    return (
        <div className="flex flex-col space-y-5">
            <Outline title={outline.title} description={outline.description} />
            <SectionHeading text={t('chooseCategory')} />
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
            <SectionHeading text={t('ourPackages')} />
            <Suspense fallback={<DefaultLoading />}>
                <PackageList />
            </Suspense>
        </div>
    );
}
