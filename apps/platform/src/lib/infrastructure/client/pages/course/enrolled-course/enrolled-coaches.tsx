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
    ConfirmationModal,
    Banner,
} from '@maany_shr/e-class-ui-kit';
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListCoachesPresenter } from '../../../hooks/use-coaches-presenter';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../../trpc/cms-client';
import useClientSidePagination from '../../../utils/use-client-side-pagination';
import CMSTRPCClientProviders from '../../../trpc/cms-client-provider';
import { useCoachMutations } from './hooks/use-coach-mutations';
import { TListCoachesSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';
import { useRouter } from 'next/navigation';

interface EnrolledCoachesProps {
    courseSlug: string;
    currentRole: string;
    isArchived?: boolean;
}
type Coach = TListCoachesSuccessResponse['data']['coaches'][0];

// Utility function to compute coach display name for avatar
function getCoachDisplayName(coach: Coach): string {
    if (coach.name && coach.surname) {
        return `${coach.name} ${coach.surname}`;
    }
    // For username-only coaches, use username so UserAvatar shows first 2 letters
    return coach.username;
}

function EnrolledCoachesContent(props: EnrolledCoachesProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.course.enrolledCoaches');
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [localAddedCoaches, setLocalAddedCoaches] = useState<number[]>([]);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'add' | 'remove';
        coachId: number | null;
        coachName: string | null;
    }>({
        isOpen: false,
        type: 'add',
        coachId: null,
        coachName: null,
    });

    // Success/Error message state
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const [courseCoachesResponse, { refetch: refetchCoaches }] =
        trpc.listCoaches.useSuspenseQuery({
            courseSlug: props.courseSlug,
        });

    const [availableCoachesResponse] = trpc.listCoaches.useSuspenseQuery({
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
        return availableCoaches.map((coach) => {
            // Use full name for display and avatar
            const fullName = getCoachDisplayName(coach);

            return {
                id: String(coach.id),
                coachName: fullName,
                coachAvatarUrl: coach.avatarUrl || '',
                totalRating: coach.reviewCount,
                rating: coach.averageRating || 0,
            };
        });
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
                (coach) => coach.id === coachId,
            );
            if (!alreadyExists) {
                // Find the full coach data from availableCoaches instead of reconstructing from mappedAvailableCoaches
                const availableCoach = availableCoaches.find(
                    (ac) => ac.id === coachId,
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
        const serverIds = serverCoaches.map((coach) => String(coach.id));
        const localIds = localAddedCoaches.map((id) => String(id));
        const allIds = Array.from(
            new Set([...serverIds, ...localIds]),
        );
        return allIds;
    }, [serverCoaches, localAddedCoaches]);

    // State for filtered coaches from search
    const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // State for sorting
    const [sortOrder, setSortOrder] = useState('sessions-desc');

    // Sorting function
    const sortCoaches = useCallback(
        (coaches: Coach[]) => {
            return [...coaches].sort((a, b) => {
                if (sortOrder === 'sessions-asc') {
                    return a.coachingSessionCount - b.coachingSessionCount;
                } else if (sortOrder === 'sessions-desc') {
                    return b.coachingSessionCount - a.coachingSessionCount;
                } else if (sortOrder === 'name-asc') {
                    const aName = getCoachDisplayName(a).toLowerCase();
                    const bName = getCoachDisplayName(b).toLowerCase();
                    return aName.localeCompare(bName);
                } else if (sortOrder === 'name-desc') {
                    const aName = getCoachDisplayName(a).toLowerCase();
                    const bName = getCoachDisplayName(b).toLowerCase();
                    return bName.localeCompare(aName);
                }
                return 0;
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
            setLocalAddedCoaches((prev) => [...prev, addedCoach.id]);
        },
        (removedCoachId) => {
            setLocalAddedCoaches((prev) =>
                prev.filter((id) => id !== removedCoachId),
            );
        },
    );

    // Handler to show confirmation modal before adding
    const handleAddCoachClick = (coachId: string) => {
        const numericCoachId = parseInt(coachId, 10);
        const coach = availableCoaches.find((c) => c.id === numericCoachId);
        if (!coach) {
            console.error('Coach not found in available coaches:', coachId);
            return;
        }

        const fullName = coach.name && coach.surname
            ? `${coach.name} ${coach.surname}`.trim()
            : coach.username;

        setConfirmModal({
            isOpen: true,
            type: 'add',
            coachId: numericCoachId,
            coachName: fullName,
        });
    };

    // Handler to show confirmation modal before removing
    const handleRemoveCoachClick = (coachId: number) => {
        const coach = coaches.find((c) => c.id === coachId);
        if (!coach) {
            console.error('Coach not found:', coachId);
            return;
        }

        const fullName = coach.name && coach.surname
            ? `${coach.name} ${coach.surname}`.trim()
            : coach.username;

        setConfirmModal({
            isOpen: true,
            type: 'remove',
            coachId,
            coachName: fullName,
        });
    };

    // Actual add coach handler after confirmation
    const handleConfirmAddCoach = async () => {
        if (!confirmModal.coachId) return;

        // Clear messages
        setSuccessMessage(null);
        setErrorMessage(null);
        clearError();

        // Close modals
        setConfirmModal({ isOpen: false, type: 'add', coachId: null, coachName: null });
        setIsAddModalOpen(false);

        const result = await addCoach(confirmModal.coachId);

        if (result.success) {
            setSuccessMessage(t('addSuccess'));
            setTimeout(() => setSuccessMessage(null), 5000);
        } else {
            setErrorMessage(result.message || t('addError'));
            setIsAddModalOpen(true);
        }
    };

    // Actual remove coach handler after confirmation
    const handleConfirmRemoveCoach = async () => {
        if (!confirmModal.coachId) return;

        // Clear messages
        setSuccessMessage(null);
        setErrorMessage(null);
        clearError();

        // Close modal
        setConfirmModal({ isOpen: false, type: 'remove', coachId: null, coachName: null });

        const result = await removeCoach(confirmModal.coachId);

        if (result.success) {
            setSuccessMessage(t('removeSuccess'));
            setTimeout(() => setSuccessMessage(null), 5000);
        } else {
            setErrorMessage(result.message || t('removeError'));
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
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('noCoachesAssigned')}
            />
        );
    }

    if (courseCoachesViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    // Check for mutation errors and show as full page errors
    if (
        addCoachViewModel?.mode === 'kaboom'
    ) {
        const errorMessage = addCoachViewModel.data.message;
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={errorMessage}
            />
        );
    }

    if (
        removeCoachViewModel?.mode === 'kaboom'
    ) {
        const errorMessage = removeCoachViewModel.data.message;
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={errorMessage}
            />
        );
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
                            const fullName = coach.name && coach.surname
                                ? `${coach.name} ${coach.surname}`.trim()
                                : coach.username;

                            const baseCardDetails = {
                                coachName: fullName,
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
                                    window.open(`/coaches/${coach.username}`, '_blank');
                                },
                                onClickCourse: (slug: string) => {
                                    window.open(`/courses/${slug}`, '_blank');
                                },
                            };

                            return (
                                <CoachCard
                                    key={coach.username}
                                    {...(canManageCoaches
                                        ? {
                                            ...baseProps,
                                            variant: 'courseCreator' as const,
                                            onClickRemoveFromCourse: () => {
                                                handleRemoveCoachClick(coach.id);
                                            },
                                        }
                                        : {
                                            ...baseProps,
                                            variant: 'coach' as const,
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

    const isAdmin = props.currentRole === 'admin' || props.currentRole === 'superadmin';
    const canManageCoaches = isAdmin && !props.isArchived;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h2>{t('title')}</h2>
                {canManageCoaches && (
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
                )}
            </header>
            <hr className="h-px bg-divider w-full border-0" />

            {/* Success Message Banner */}
            {successMessage && (
                <Banner
                    style="success"
                    title={successMessage}
                    closeable
                    onClose={() => setSuccessMessage(null)}
                />
            )}

            {/* Error Message Banner */}
            {errorMessage && (
                <Banner
                    style="error"
                    title={errorMessage}
                    closeable
                    onClose={() => setErrorMessage(null)}
                />
            )}

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
                    <div className="flex gap-2 items-center relative">
                        <label className="text-sm md:text-md text-base-white">
                            {t('sortByLabel')}
                        </label>
                        <Dropdown
                            type="simple"
                            options={[
                                {
                                    label: t('sortByNameAZ'),
                                    value: 'name-asc',
                                },
                                {
                                    label: t('sortByNameZA'),
                                    value: 'name-desc',
                                },
                                {
                                    label: t('sortBySessionsHighToLow'),
                                    value: 'sessions-desc',
                                },
                                {
                                    label: t('sortBySessionsLowToHigh'),
                                    value: 'sessions-asc',
                                },
                            ]}
                            defaultValue={sortOrder}
                            onSelectionChange={(selected) => {
                                if (typeof selected === 'string') {
                                    setSortOrder(selected);
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
                        onClose={() => setIsAddModalOpen(false)}
                        onAdd={handleAddCoachClick}
                        content={mappedAvailableCoaches}
                        addedCoachIds={addedCoachIds}
                    />
                </div>
            )}

            {/* Confirmation Modal for Add/Remove */}
            <ConfirmationModal
                type="accept"
                isOpen={confirmModal.isOpen}
                onClose={() =>
                    setConfirmModal({
                        isOpen: false,
                        type: 'add',
                        coachId: null,
                        coachName: null,
                    })
                }
                onConfirm={
                    confirmModal.type === 'add'
                        ? handleConfirmAddCoach
                        : handleConfirmRemoveCoach
                }
                title={
                    confirmModal.type === 'add'
                        ? t('confirmAddTitle')
                        : t('confirmRemoveTitle')
                }
                message={
                    confirmModal.type === 'add'
                        ? t('confirmAddMessage')
                        : t('confirmRemoveMessage')
                }
                confirmText={
                    isMutating
                        ? confirmModal.type === 'add'
                            ? t('addingCoach')
                            : t('removingCoach')
                        : t('confirmButton')
                }
                cancelText={t('cancelButton')}
                locale={locale}
                isLoading={isMutating}
            />
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
