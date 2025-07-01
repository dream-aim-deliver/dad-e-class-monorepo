import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/client';
import { useMemo, useState } from 'react';
import { useListCoachesPresenter } from '../../hooks/use-coaches-presenter';
import {
    Button,
    CardListLayout,
    CoachCard,
    DefaultError,
    DefaultLoading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import useClientSidePagination from '../../utils/use-client-side-pagination';

interface CoachListProps {
    selectedTopics: string[];
}

export default function CoachingCoachList({ selectedTopics }: CoachListProps) {
    const [coachesResponse] = trpc.listCoaches.useSuspenseQuery({});
    const [coachesViewModel, setCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);
    const { presenter } = useListCoachesPresenter(setCoachesViewModel);
    presenter.present(coachesResponse, coachesViewModel);

    const t = useTranslations('components.paginationButton');
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const coaches = useMemo(() => {
        if (!coachesViewModel || coachesViewModel.mode !== 'default') {
            return [];
        }

        return coachesViewModel.data.coaches.filter((coach) => {
            const matchesTopics =
                selectedTopics.length === 0 ||
                coach.skills.some((skill) =>
                    selectedTopics.includes(skill.slug),
                );

            return matchesTopics;
        });
    }, [coachesViewModel, selectedTopics]);

    const {
        displayedItems: displayedCoaches,
        hasMoreItems: hasMoreCourses,
        handleLoadMore,
    } = useClientSidePagination({ items: coaches });

    if (!coachesViewModel) {
        return <DefaultLoading />;
    }

    if (coachesViewModel.mode === 'not-found') {
        return <DefaultError errorMessage="No coaches found" />;
    }

    if (coachesViewModel.mode !== 'default') {
        return <DefaultError errorMessage={coachesViewModel.data.message} />;
    }

    if (displayedCoaches.length === 0) {
        return <DefaultError errorMessage="No coaches found" />;
    }

    return (
        <div className="flex flex-col space-y-5">
            <CardListLayout className="lg:grid-cols-2">
                {displayedCoaches.map((coach) => (
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
                                slug: course.slug,
                            })),
                            skills: coach.skills.map((skill) => skill.name),
                            rating: coach.averageRating ?? 0,
                            totalRatings: coach.reviewCount,
                        }}
                        onClickViewProfile={() => {
                            router.push(`/coaches/${coach.username}`);
                        }}
                        onClickCourse={(courseSlug: string) => {
                            router.push(`/courses/${courseSlug}`);
                        }}
                        onClickBookSession={() => {
                            // TODO: Implement booking session navigation
                        }}
                    />
                ))}
            </CardListLayout>
            {hasMoreCourses && (
                <Button
                    variant="text"
                    text={t('loadMore')}
                    onClick={handleLoadMore}
                />
            )}
        </div>
    );
}
