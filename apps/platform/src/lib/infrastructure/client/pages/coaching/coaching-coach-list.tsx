import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../trpc/cms-client';
import { useMemo, useState } from 'react';
import { useListCoachesPresenter } from '../../hooks/use-coaches-presenter';
import useClientSidePagination from '../../utils/use-client-side-pagination';
import {
    Button,
    CardListLayout,
    CoachCard,
    DefaultError,
    DefaultLoading,
    EmptyState,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface CoachListProps {
    selectedTopics: string[];
}

export default function CoachingCoachList({ selectedTopics }: CoachListProps) {
    const session = useSession();
    const isLoggedIn = !!session.data;

    const [coachesResponse] = trpc.listCoaches.useSuspenseQuery({
        publicCoaches: isLoggedIn ? false : true,
    });
    const [coachesViewModel, setCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);
    const { presenter } = useListCoachesPresenter(setCoachesViewModel);
        // @ts-ignore
        presenter.present(coachesResponse, coachesViewModel);

    const t = useTranslations('components.paginationButton');
    const coachingT = useTranslations('pages.coaching');
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const coaches = useMemo(() => {
        if (!coachesViewModel || coachesViewModel.mode !== 'default') {
            return [];
        }

        const currentUserUsername = session.data?.user?.name;

        return coachesViewModel.data.coaches.filter((coach) => {
            if (coach.username === currentUserUsername) {
                return false;
            }

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
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachesViewModel.mode === 'not-found') {
        return (
            <EmptyState
                locale={locale}
                message={coachingT('noCoachesFound')}
            />
        );
    }

    if (coachesViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={coachingT('error.title')}
                description={coachingT('error.description')}
            />
        );
    }

    if (displayedCoaches.length === 0) {
        return (
            <EmptyState
                locale={locale}
                message={coachingT('noCoachesFound')}
            />
        );
    }

    return (
        <div className="flex flex-col space-y-5">
            <CardListLayout className="md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 w-full">
                {displayedCoaches.map((coach) => (
                    <CoachCard
                        key={`coach-${coach.username}`}
                        locale={locale}
                        cardDetails={{
                            coachName: [coach.name, coach.surname].filter(Boolean).join(' ') || coach.username,
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
                            router.push(`/coaches/${coach.username}/book`);
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
