'use client';

import {
    DefaultError,
    DefaultLoading,
    CoachCard,
    Button,
    IconPlus,
    AddCoachModal,
    SearchInput,
    CoachCardListSkeleton,
    Dropdown,
} from '@maany_shr/e-class-ui-kit';
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useListCoachesPresenter } from '../../../hooks/use-coaches-presenter';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../../trpc/cms-client';
import useClientSidePagination from '../../../utils/use-client-side-pagination';
import CMSTRPCClientProviders from '../../../trpc/cms-client-provider';
import { useCoachMutations } from './hooks/use-coach-mutations';

interface EnrolledCoachesProps {
    courseSlug: string;
    currentRole: string;
}
type Coach = useCaseModels.TListCoachesSuccessResponse['data']['coaches'][0];

function EnrolledCoachesContent(props: EnrolledCoachesProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.course.enrolledCoaches');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [localAddedCoaches, setLocalAddedCoaches] = useState<string[]>([]);

    // Fetch course-specific coaches data using real TRPC Client
    const [courseCoachesResponse, { refetch: refetchCoaches }] =
        // TODO: Add courseSlug as input parameter when implemented in backend
        trpc.listCoaches.useSuspenseQuery({
            pagination: { pageSize: 50, page: 1 },
            skillSlugs: null
        });

    const [availableCoachesResponse] = trpc.listCoaches.useSuspenseQuery({
        pagination: { pageSize: 100, page: 1 },
        skillSlugs: null
    });

    // Set up presenter for transforming the response to view model
    const [courseCoachesViewModel, setCourseCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);
    const [availableCoachesViewModel, setAvailableCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);

    // Set up presenters
    const { presenter: courseCoachesPresenter } = useListCoachesPresenter(
        setCourseCoachesViewModel,
    );
    const { presenter: availableCoachesPresenter } = useListCoachesPresenter(
        setAvailableCoachesViewModel,
    );

    // @ts-ignore
    courseCoachesPresenter.present(courseCoachesResponse, courseCoachesViewModel);

    // @ts-ignore
    availableCoachesPresenter.present(availableCoachesResponse, availableCoachesViewModel);

    // Get available coaches from the presenter (this has the full coach data structure)
    const availableCoaches = useMemo(() => {
        if (availableCoachesViewModel?.mode === 'default') {
            return availableCoachesViewModel.data.coaches;
        }
        return [];
    }, [availableCoachesViewModel]);

    // Map available coaches to CoachContent format for AddCoachModal
    const mappedAvailableCoaches = useMemo(() => {
        return availableCoaches.map((coach) => ({
            id: coach.username,
            coachName: `${coach.name} ${coach.surname}`,
            coachAvatarUrl: coach.avatarUrl || '',
            totalRating: coach.reviewCount,
            rating: coach.averageRating || 0,
        }));
    }, [availableCoaches]);

    const serverCoaches =
        courseCoachesViewModel?.mode === 'default'
            ? courseCoachesViewModel.data.coaches
            : [];

    // Combine server coaches with locally added coaches for immediate UI update
    const coaches = useMemo(() => {
        const baseCoaches = [...serverCoaches];

        // Add locally added coaches that aren't already in the server data
        localAddedCoaches.forEach((coachId) => {
            const alreadyExists = baseCoaches.some(
                (coach) => coach.username === coachId,
            );
            if (!alreadyExists) {
                // Find the full coach data from availableCoaches instead of reconstructing from mappedAvailableCoaches
                const availableCoach = availableCoaches.find(
                    (ac) => ac.username === coachId,
                );
                if (availableCoach) {
                    baseCoaches.push(availableCoach);
                }
            }
        });

        return baseCoaches;
    }, [serverCoaches, localAddedCoaches, availableCoaches]);

    // Derive addedCoachIds from server coaches and locally added coach ids so the UI reflects newly added coaches immediately
    const addedCoachIds = useMemo(() => {
        const serverIds = serverCoaches.map((coach) => coach.username);
        const allIds = Array.from(
            new Set([...serverIds, ...localAddedCoaches]),
        );
        return allIds;
    }, [serverCoaches, localAddedCoaches]);

    // State for filtered coaches from search
    const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // State for sorting
    const [sortOrder, setSortOrder] = useState('desc');

    // Sorting function
    const sortCoaches = useCallback(
        (coaches: Coach[]) => {
            return [...coaches].sort((a, b) => {
                const aVal = a.coachingSessionCount;
                const bVal = b.coachingSessionCount;
                const result = sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                return result;
            });
        },
        [sortOrder],
    );

    // Update filtered coaches whenever coaches data changes
    useEffect(() => {
        // If no active search, show all coaches
        if (searchQuery.trim() === '') {
            setFilteredCoaches(sortCoaches(coaches));
        }
        // If there's an active search, the SearchInput will handle updating filteredCoaches
    }, [coaches, searchQuery, sortCoaches]);

    useEffect(() => {
        setFilteredCoaches((prev) => {
            const sorted = sortCoaches(prev);
            return sorted;
        });
    }, [sortOrder, sortCoaches]);

    // Use the coach mutations hook with callbacks for direct state updates
    const {
        addCoach,
        removeCoach,
        isLoading: isMutating,
        clearError,
        addCoachViewModel,
        removeCoachViewModel,
    } = useCoachMutations(
        props.courseSlug,
        undefined,
        (addedCoach) => {
            setLocalAddedCoaches((prev) => [...prev, addedCoach.username]);
        },
        (removedCoachUsername) => {
            setLocalAddedCoaches((prev) =>
                prev.filter((id) => id !== removedCoachUsername),
            );
        },
    );

    // Handler functions with enhanced error handling using presenter
    const handleAddCoach = async (coachId: string) => {
        // Find the coach from available coaches (full data)
        const coachToAdd = availableCoaches.find(
            (coach) => coach.username === coachId,
        );
        if (!coachToAdd) {
            console.error('Coach not found in available coaches:', coachId);
            return;
        }

        // Clear any previous errors
        clearError();

        setIsAddModalOpen(false);

        const result = await addCoach(coachId);

        if (!result.success) {
            setIsAddModalOpen(true);
        }
    };

    const handleRemoveCoach = async (coachId: string) => {
        clearError();

        const result = await removeCoach(coachId);

        if (!result.success) {
            console.error('Error removing coach:', result.message);
            // Error details are shown via removeCoachViewModel in the UI
        }
    };

    // Use client-side pagination - call this hook consistently on every render
    const {
        displayedItems: displayedCoaches,
        hasMoreItems,
        handleLoadMore,
    } = useClientSidePagination({
        items: filteredCoaches,
        itemsPerPage: 6,
        itemsPerPage2xl: 9,
    });

    if (!courseCoachesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (courseCoachesViewModel.mode === 'not-found') {
        return (
            <DefaultError
                locale={locale}
                description={t('noCoachesAssigned')}
            />
        );
    }

    if (courseCoachesViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    // Check for mutation errors and show as full page errors
    if (
        addCoachViewModel?.mode === 'error' ||
        addCoachViewModel?.mode === 'kaboom'
    ) {
        const errorMessage = addCoachViewModel.data.message;
        return <DefaultError locale={locale} description={errorMessage} />;
    }

    if (
        removeCoachViewModel?.mode === 'error' ||
        removeCoachViewModel?.mode === 'kaboom'
    ) {
        const errorMessage = removeCoachViewModel.data.message;
        return <DefaultError locale={locale} description={errorMessage} />;
    }


    // Helper to render content based on coaches and search state
    const renderCoachContent = (coaches: Coach[], displayedCoaches: Coach[], hasMore: boolean, handleLoadMore: () => void) => {
        // If there's a search query and no results, show "No coaches found"
        if (searchQuery.trim() !== '' && coaches.length === 0) {
            return (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem] animate-pulse">
                    <p className="text-text-primary text-md">
                        {t('noCoachesFound')}
                    </p>
                </div>
            );
        }

        // If there are no coaches at all (and no search), show "No coaches assigned"
        if (coaches.length === 0) {
            return (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                    <p className="text-text-primary text-md">
                        {t('noCoachesAssigned')}
                    </p>
                </div>
            );
        }

        // Otherwise, render the coach grid
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isSearchLoading ? (
                        <CoachCardListSkeleton
                            cardCount={displayedCoaches.length || 6}
                        />
                    ) : (
                        displayedCoaches.map((coach) => {
                            const isCoach = props.currentRole === 'coach';
                            const baseCardDetails = {
                                coachName: `${coach.name} ${coach.surname}`,
                                coachImage: coach.avatarUrl || undefined,
                                languages: coach.languages,
                                sessionCount: coach.coachingSessionCount,
                                skills: coach.skills.map((skill) => skill.name), // Map skill objects to names
                                description: coach.bio,
                                courses: coach.coursesTaught.map((course) => ({
                                    image: course.imageUrl || '',
                                    title: course.title,
                                    slug: course.slug,
                                })),
                                rating: coach.averageRating || 0,
                                totalRatings: coach.reviewCount,
                            };

                            const baseProps = {
                                cardDetails: baseCardDetails,
                                locale,
                                onClickViewProfile: () => {
                                    // TODO:Navigate to coach profile or show modal
                                },
                                onClickCourse: (slug: string) => {
                                    // TODO: Navigate to course page
                                },
                            };

                            return (
                                <CoachCard
                                    key={coach.username}
                                    {...(isCoach
                                        ? {
                                            ...baseProps,
                                            variant: 'coach' as const,
                                        }
                                        : {
                                            ...baseProps,
                                            variant: 'courseCreator' as const,
                                            onClickRemoveFromCourse: () => {
                                                handleRemoveCoach(coach.username);
                                            },
                                        })}
                                />
                            );
                        })
                    )}
                </div>

                {hasMore && (
                    <div className="flex justify-center mt-8">
                        <Button
                            variant="text"
                            size="medium"
                            onClick={handleLoadMore}
                            text={t('loadMoreButton')}
                        />
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h2>{t('title')}</h2>
                <Button
                    hasIconLeft
                    iconLeft={<IconPlus />}
                    text={t('addCoachButton')}
                    variant="primary"
                    disabled={isMutating}
                    onClick={() => {
                        setIsAddModalOpen(true);
                    }}
                />
            </header>
            <hr className="h-px bg-divider w-full border-0" />

            {/* Search Coaches */}
            {props.currentRole !== 'coach' && coaches.length > 0 && (
                <div className="flex flex-col md:flex-row  gap-2 p-2 bg-card-fill rounded-medium border border-card-stroke">
                    <div className="flex-1">
                        <SearchInput
                            key={`search-${sortOrder}`}
                            items={coaches}
                            keys={['name', 'surname']}
                            onResults={(results) => {
                                setFilteredCoaches(sortCoaches(results));
                            }}
                            onLoading={(loading) => {
                                setIsSearchLoading(loading);
                            }}
                            placeholder={t('searchPlaceholder')}
                            onQueryChange={setSearchQuery}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-sm md:text-md text-base-white">
                            {t('sortByLabel')}
                        </label>
                        <Dropdown
                            type="simple"
                            options={[
                                {
                                    label: t('sortBySessionsHighToLow'),
                                    value: 'sessions-desc',
                                },
                                {
                                    label: t('sortBySessionsLowToHigh'),
                                    value: 'sessions-asc',
                                },
                            ]}
                            defaultValue={`sessions-${sortOrder}`}
                            onSelectionChange={(selected) => {
                                if (typeof selected === 'string') {
                                    const order = selected.split('-')[1];
                                    setSortOrder(order);
                                }
                            }}
                            text={{ simpleText: t('sortByDropdownText') }}
                        />
                    </div>
                </div>
            )}

            {renderCoachContent(filteredCoaches, displayedCoaches, hasMoreItems, handleLoadMore)}

            {/* Add Coach Modal */}
            {isAddModalOpen && (
                <div
                    className="top-0 left-0 w-full h-full fixed bg-black/30 z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsAddModalOpen(false);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setIsAddModalOpen(false);
                        }
                    }}
                    tabIndex={-1}
                >
                    <AddCoachModal
                        locale={locale}
                        onClose={() => {
                            setIsAddModalOpen(false);
                        }}
                        onAdd={handleAddCoach}
                        content={mappedAvailableCoaches}
                        addedCoachIds={addedCoachIds}
                    />
                </div>
            )}
        </div>
    );
}

export default function EnrolledCoaches(props: EnrolledCoachesProps) {
    const locale = useLocale() as TLocale;

    return (
        //we  need remove if we have real trpc client
        <CMSTRPCClientProviders>
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <EnrolledCoachesContent {...props} />
            </Suspense>
        </CMSTRPCClientProviders>
    );
}
