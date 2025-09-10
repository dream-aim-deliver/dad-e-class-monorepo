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
import { viewModels } from '@maany_shr/e-class-models';
import { useListCourseCoachesPresenter } from '../../../hooks/use-course-coaches-presenter';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc as trpcMock } from '../../../trpc/client';
import useClientSidePagination from '../../../utils/use-client-side-pagination';
import MockTRPCClientProviders from '../../../trpc/mock-client-providers';
import { useCoachMutations } from './hooks/use-coach-mutations';

interface EnrolledCoachesProps {
    courseSlug: string;
    currentRole: string;
}

function EnrolledCoachesContent(props: EnrolledCoachesProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.course.enrolledCoaches');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addedCoachIds, setAddedCoachIds] = useState<string[]>([]);

    // Fetch course-specific coaches data using TRPC Mock Client
    const [courseCoachesResponse, { refetch: refetchCoaches }] = trpcMock.listCourseCoaches.useSuspenseQuery({
        courseSlug: props.courseSlug
    });

    // Set up presenter for transforming the response to view model
    const [courseCoachesViewModel, setCourseCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);

    // Local state to track added coaches for immediate UI updates (optimistic updates)
    const [localAddedCoaches, setLocalAddedCoaches] = useState<string[]>([]);

    const { presenter } = useListCourseCoachesPresenter(setCourseCoachesViewModel);


    presenter.present(courseCoachesResponse, courseCoachesViewModel);


    // Get coaches data from view model
    const serverCoaches = courseCoachesViewModel?.mode === 'default' ? courseCoachesViewModel.data.coaches : [];

    // Mock data for available coaches to add - using usernames that match the mock data
    const availableCoaches = [
        {
            id: 'sarah_creative',
            coachName: 'Dr. Sarah Johnson',
            coachAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            totalRating: 89,
            rating: 4.8,
        },
        {
            id: 'sophia_type',
            coachName: 'Sophia Anderson',
            coachAvatarUrl: '',
            totalRating: 134,
            rating: 4.9,
        },
        {
            id: 'maria_color',
            coachName: 'Maria Rodriguez',
            coachAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            totalRating: 76,
            rating: 4.7,
        },
        {
            id: 'james_ux',
            coachName: 'James Wilson',
            coachAvatarUrl: '',
            totalRating: 103,
            rating: 4.8,
        },
        {
            id: 'david_ux',
            coachName: 'David Chen',
            coachAvatarUrl: '',
            totalRating: 156,
            rating: 4.9,
        },
        {
            id: 'lisa_ai',
            coachName: 'Lisa Park',
            coachAvatarUrl: '',
            totalRating: 0,
            rating: 0,
        },
        {
            id: 'michael_pitch',
            coachName: 'Michael Davis',
            coachAvatarUrl: '',
            totalRating: 95,
            rating: 4.7,
        },
        {
            id: 'alex_social',
            coachName: 'Alex Thompson',
            coachAvatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            totalRating: 112,
            rating: 4.6,
        },
        {
            id: 'emma_sound',
            coachName: 'Emma Williams',
            coachAvatarUrl: '',
            totalRating: 67,
            rating: 4.9,
        },
    ];

    // Combine server coaches with locally added coaches for immediate UI update
    const coaches = useMemo(() => {
        const baseCoaches = [...serverCoaches];

        // Add locally added coaches that aren't already in the server data
        localAddedCoaches.forEach(coachId => {
            const alreadyExists = baseCoaches.some(coach => coach.username === coachId);
            if (!alreadyExists) {
                const availableCoach = availableCoaches.find(ac => ac.id === coachId);
                if (availableCoach) {
                    // Create a mock coach object that matches the expected structure
                    const mockCoach = {
                        username: coachId,
                        name: availableCoach.coachName.split(' ')[0] || 'Unknown',
                        surname: availableCoach.coachName.split(' ').slice(1).join(' ') || 'Coach',
                        languages: ['English'],
                        avatarUrl: availableCoach.coachAvatarUrl || null,
                        coachingSessionCount: 0,
                        skills: [{ name: 'General Coaching', slug: 'general-coaching' }],
                        averageRating: availableCoach.rating,
                        reviewCount: availableCoach.totalRating,
                        bio: `${availableCoach.coachName} is a professional coach.`,
                        coursesTaught: []
                    };
                    baseCoaches.push(mockCoach);
                }
            }
        });

        return baseCoaches;
    }, [serverCoaches, localAddedCoaches, availableCoaches]);

    // State for filtered coaches from search
    const [filteredCoaches, setFilteredCoaches] = useState<any[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // State for sorting
    const [sortOrder, setSortOrder] = useState('desc');

    // Sorting function
    const sortCoaches = useCallback((coaches: any[]) => {
        return [...coaches].sort((a, b) => {
            const aVal = a.coachingSessionCount;
            const bVal = b.coachingSessionCount;
            const result = sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            return result;
        });
    }, [sortOrder]);

    // Update filtered coaches whenever coaches data changes
    useEffect(() => {
        // If no active search, show all coaches
        if (searchQuery.trim() === '') {
            setFilteredCoaches(sortCoaches(coaches));
        }
        // If there's an active search, the SearchInput will handle updating filteredCoaches
    }, [coaches, searchQuery, sortCoaches]);

    useEffect(() => {
        setFilteredCoaches(prev => {
            const sorted = sortCoaches(prev);
            return sorted;
        });
    }, [sortOrder, sortCoaches]);

    // Update addedCoachIds when coaches data changes
    useEffect(() => {
        if (coaches.length > 0) {
            const coachIds = coaches.map(coach => coach.username);
            setAddedCoachIds(coachIds);
        }
    }, [coaches]);

    // Use the coach mutations hook with callbacks for direct state updates
    const {
        addCoach,
        removeCoach,
        isLoading: isMutating,
        clearError,
        addCoachViewModel,
        removeCoachViewModel
    } = useCoachMutations(
        props.courseSlug,
        // No longer need refetch - we're doing direct state updates!
        undefined,
        // Callback when coach is added - update state directly
        (addedCoach) => {
            setLocalAddedCoaches(prev => [...prev, addedCoach.username]);
            setAddedCoachIds(prev => [...prev, addedCoach.username]);
        },
        // Callback when coach is removed - update state directly
        (removedCoachUsername) => {
            setLocalAddedCoaches(prev => prev.filter(id => id !== removedCoachUsername));
            setAddedCoachIds(prev => prev.filter(id => id !== removedCoachUsername));
        }
    );

    // Handler functions with enhanced error handling using presenter
    const handleAddCoach = async (coachId: string) => {
        // Find the coach from available coaches
        const coachToAdd = availableCoaches.find(coach => coach.id === coachId);
        if (!coachToAdd) {
            console.error('Coach not found in available coaches:', coachId);
            return;
        }

        // Clear any previous errors
        clearError();

        // Close modal immediately for better UX
        setIsAddModalOpen(false);

        // Perform the backend operation - hook will handle state updates directly
        const result = await addCoach(coachId);

        if (!result.success) {
            setIsAddModalOpen(true);

        }
    };

    const handleRemoveCoach = async (coachId: string) => {
        clearError();

        // Perform backend operation - hook will handle state updates directly
        const result = await removeCoach(coachId);

        // Note: Current mock always succeeds, but we keep minimal error handling for future real API
        if (!result.success) {
            console.error('Error removing coach:', result.message);
            // Error details are shown via removeCoachViewModel in the UI
        }
    };

    // Use client-side pagination - call this hook consistently on every render
    const { displayedItems: displayedCoaches, hasMoreItems, handleLoadMore } = useClientSidePagination({
        items: filteredCoaches,
        itemsPerPage: 6,
        itemsPerPage2xl: 9,
    });

    if (!courseCoachesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (courseCoachesViewModel.mode === 'not-found') {
        return <DefaultError locale={locale} description={t('noCoachesAssigned')} />;
    }

    if (courseCoachesViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    // Check for mutation errors and show as full page errors
    if (addCoachViewModel?.mode === 'error' || addCoachViewModel?.mode === 'kaboom') {
        const errorMessage = addCoachViewModel.data.message;
        return <DefaultError locale={locale} description={errorMessage} />;
    }

    if (removeCoachViewModel?.mode === 'error' || removeCoachViewModel?.mode === 'kaboom') {
        const errorMessage = removeCoachViewModel.data.message;
        return <DefaultError locale={locale} description={errorMessage} />;
    }

    if (coaches.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-accent-500">{t('noCoachesAssigned')}</p>
            </div>
        );
    }

    if (filteredCoaches.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-accent-500">{t('noCoachesFound')}</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h2 className="text-base-white">{t('title')}</h2>
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
            {props.currentRole !== "coach" && (
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
                        <label className="text-sm md:text-md text-base-white">{t('sortByLabel')}</label>
                        <Dropdown
                            type="simple"
                            options={[
                                { label: t('sortBySessionsHighToLow'), value: 'sessions-desc' },
                                { label: t('sortBySessionsLowToHigh'), value: 'sessions-asc' },
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



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isSearchLoading ? (
                    <CoachCardListSkeleton cardCount={displayedCoaches.length || 6} />
                ) : (
                    displayedCoaches.map((coach) => {
                        const isCoach = props.currentRole === "coach";
                        const canRemoveCoaches = props.currentRole === "admin" || props.currentRole === "courseCreator";

                        const baseCardDetails = {
                            coachName: `${coach.name} ${coach.surname}`,
                            coachImage: coach.avatarUrl || undefined,
                            languages: coach.languages,
                            sessionCount: coach.coachingSessionCount,
                            skills: (coach.skills as any[]).map((skill) => skill.name), // Map skill objects to names
                            description: coach.bio,
                            courses: (coach.coursesTaught as any[]).map((course) => ({
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
                                // Navigate to coach profile or show modal
                            },
                            onClickCourse: (slug: string) => {
                                // Navigate to course page
                            }
                        };

                        return (
                            <CoachCard
                                key={coach.username}
                                {...(isCoach
                                    ? {
                                        ...baseProps,
                                        variant: "coach" as const
                                    }
                                    : {
                                        ...baseProps,
                                        variant: "courseCreator" as const,
                                        onClickRemoveFromCourse: () => {
                                            handleRemoveCoach(coach.username);
                                        }
                                    }
                                )}
                            />
                        );
                    })
                )}
            </div>

            {hasMoreItems && (
                <div className="flex justify-center mt-8">
                    <Button
                        variant="text"
                        size="medium"
                        onClick={handleLoadMore}
                        text={t('loadMoreButton')}
                    />
                </div>
            )}

            {/* Add Coach Modal */}
            {isAddModalOpen && (
                <div className="top-0 left-0 w-full h-full fixed bg-black/30 z-50 flex items-center justify-center p-4">
                    <AddCoachModal
                        locale={locale}
                        onClose={() => {
                            setIsAddModalOpen(false);
                        }}
                        onAdd={handleAddCoach}
                        content={availableCoaches}
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
        <MockTRPCClientProviders>
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <EnrolledCoachesContent {...props} />
            </Suspense>
        </MockTRPCClientProviders>
    );
}
