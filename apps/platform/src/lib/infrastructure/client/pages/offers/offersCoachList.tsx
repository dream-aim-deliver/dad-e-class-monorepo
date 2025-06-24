import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { useState } from 'react';
import { useListCoachesPresenter } from '../../hooks/use-coaches-presenter';
import {
    CardListLayout,
    CoachCard,
    DefaultError,
    DefaultLoading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

interface CoachListProps {
    selectedTopics: string[];
}

const COACHES_PER_PAGE = 6;

export default function OffersCoachList({ selectedTopics }: CoachListProps) {
    const [coachesResponse] = trpc.listCoaches.useSuspenseQuery({
        skillSlugs: selectedTopics,
        page: 1,
        pageSize: COACHES_PER_PAGE,
    });
    const [coachesViewModel, setCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);
    const { presenter } = useListCoachesPresenter(setCoachesViewModel);
    presenter.present(coachesResponse, coachesViewModel);

    const locale = useLocale() as TLocale;

    if (!coachesViewModel) {
        return <DefaultLoading />;
    }

    if (coachesViewModel.mode === 'not-found') {
        return <DefaultError errorMessage="No coaches found" />;
    }

    if (coachesViewModel.mode !== 'default') {
        return <DefaultError errorMessage={coachesViewModel.data.message} />;
    }

    const coaches = coachesViewModel.data.coaches;

    if (coaches.length === 0) {
        return <DefaultError errorMessage="No coaches found" />;
    }

    return (
        <CardListLayout>
            {coaches.map((coach) => (
                <CoachCard
                    key={`coach-${coach.username}`}
                    locale={locale}
                    cardDetails={{
                        coachName: coach.name + ' ' + coach.surname,
                        coachImage: coach.avatarUrl ?? undefined,
                        languages: coach.languages,
                        sessionCount: coach.coachingSessionCount,
                        description: coach.bio,
                        courses: coach.coursesTaught.map((course) => ({
                            title: course.title,
                            image: course.imageUrl ?? '',
                        })),
                        skills: coach.skills.map((skill) => skill.name),
                        rating: coach.averageRating ?? 0,
                        totalRatings: coach.reviewCount,
                    }}
                />
            ))}
        </CardListLayout>
    );
}
