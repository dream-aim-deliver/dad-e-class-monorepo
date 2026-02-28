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
    matchesTopicFilter,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface CoachListProps {
    selectedTopics: string[];
}

export default function OffersCoachList({ selectedTopics }: CoachListProps) {
    const [coachesResponse] = trpc.listCoaches.useSuspenseQuery({});
    const [coachesViewModel, setCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);
    const { presenter } = useListCoachesPresenter(setCoachesViewModel);
    // @ts-ignore
    presenter.present(coachesResponse, coachesViewModel);

    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );
    const offersTranslations = useTranslations('pages.offers');

    const locale = useLocale() as TLocale;
    const router = useRouter();
    const { data: session } = useSession();
    const isLoggedIn = !!session;

    const coaches = useMemo(() => {
        if (!coachesViewModel || coachesViewModel.mode !== 'default') {
            return [];
        }
        return coachesViewModel.data.coaches.filter((coach) =>
            matchesTopicFilter(
                selectedTopics,
                coach.skills.map((skill) => skill.slug),
            ),
        );
    }, [coachesViewModel, selectedTopics]);

    const {
        displayedItems: displayedCoaches,
        hasMoreItems: hasMoreCoaches,
        handleLoadMore,
    } = useClientSidePagination({ items: coaches });

    if (!coachesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachesViewModel.mode === 'not-found') {
        return (
            <EmptyState
                locale={locale}
                message={offersTranslations(
                    isLoggedIn ? 'coachesNotFound.description' : 'coachesNotFoundGuest.description'
                )}
            />
        );
    }

    if (coachesViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={offersTranslations('loadError.title')}
                description={offersTranslations('loadError.description')}
            />
        );
    }

    if (displayedCoaches.length === 0) {
        return (
            <EmptyState
                locale={locale}
                message={offersTranslations(
                    isLoggedIn ? 'coachesNotFound.description' : 'coachesNotFoundGuest.description'
                )}
            />
        );
    }

    const handleViewAll = () => {
        router.push(`/${locale}/coaching`);
    };

    return (
        <div className="flex flex-col space-y-5">
            <CardListLayout>
                {displayedCoaches.map((coach) => (
                    <CoachCard
                        key={`coach-${coach.username}`}
                        locale={locale}
                        cardDetails={{
                            coachName: [coach.name, coach.surname].filter(Boolean).join(' '),
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
                            router.push(`/${locale}/coaches/${coach.username}`);
                        }}
                        onClickCourse={(courseSlug: string) => {
                            router.push(`/${locale}/courses/${courseSlug}`);
                        }}
                        onClickBookSession={() => {
                            router.push(`/${locale}/coaches/${coach.username}/book`);
                        }}
                    />
                ))}
            </CardListLayout>
            {hasMoreCoaches ? (
                <Button
                    variant="text"
                    text={paginationTranslations('loadMore')}
                    onClick={handleLoadMore}
                />
            ) : isLoggedIn ? (
                <Button
                    variant="text"
                    text={paginationTranslations('viewAll')}
                    onClick={handleViewAll}
                />
            ) : null}
        </div>
    );
}
