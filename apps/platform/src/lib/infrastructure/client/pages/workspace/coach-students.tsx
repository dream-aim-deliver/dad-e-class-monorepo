'use client';

import {
    Breadcrumbs,
    Button,
    StudentCardFilterModal,
    StudentCardFilterModel,
    SearchInput,
    IconClose,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import CoachStudentsList from './coach-students-list';
import { useEffect, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListCoachStudentsPresenter } from '../../hooks/use-list-coach-students-presenter';
import { useRouter } from 'next/navigation';
import { trpc } from '../../trpc/cms-client';

interface CoachStudentsProps {
    roles: string[];
}

export default function CoachStudents(props: CoachStudentsProps) {
    const isCoach = props.roles.includes('coach');
    const isCourseCreator = props.roles.includes('course_creator');
    const locale = useLocale() as TLocale;

    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const pageTranslations = useTranslations('pages.coachStudents');

    // Filter states
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] =
        useState<StudentCardFilterModel>({});
    const [filteredStudents, setFilteredStudents] = useState<
        viewModels.TListCoachStudentsSuccess['students'] | undefined
    >(undefined);

    // Search state
    const [searchResults, setSearchResults] = useState<
        viewModels.TListCoachStudentsSuccess['students'] | undefined
    >(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: studentsResponse,
        isFetching,
        error,
    } = trpc.listCoachStudents.useQuery({
        pagination: {
            page: 1,
            pageSize: 20,
        },
    });

    const [studentsViewModel, setStudentsViewModel] = useState<
        viewModels.TListCoachStudentsViewModel | undefined
    >(undefined);

    const { presenter } = useListCoachStudentsPresenter(setStudentsViewModel);

    useEffect(() => {
        if (studentsResponse) {
            // @ts-ignore
            presenter.present(studentsResponse, studentsViewModel);
        }
    }, [studentsResponse, presenter, studentsViewModel]);

    // Apply filters to students
    useEffect(() => {
        if (!studentsViewModel?.mode || studentsViewModel.mode !== 'default') {
            setFilteredStudents(undefined);
            return;
        }

        const students = studentsViewModel.data.students;

        // Start with search results if search is active, otherwise use all students
        const baseStudents =
            searchResults !== undefined ? searchResults : students;
        let filtered = [...baseStudents];

        // Filter by student name (only if not already searching - search handles this)
        if (
            appliedFilters.studentName &&
            appliedFilters.studentName.trim() &&
            searchQuery.trim() === ''
        ) {
            const searchTerm = appliedFilters.studentName.toLowerCase().trim();
            filtered = filtered.filter((student) =>
                `${student.name} ${student.surname}`
                    .toLowerCase()
                    .includes(searchTerm),
            );
        }

        // Filter by course name
        if (appliedFilters.courseName && appliedFilters.courseName.trim()) {
            const searchTerm = appliedFilters.courseName.toLowerCase().trim();
            filtered = filtered.filter((student) =>
                student.courses.some((course) =>
                    course.title.toLowerCase().includes(searchTerm),
                ),
            );
        }

        // Filter by assignment status
        if (
            appliedFilters.assignmentStatus &&
            appliedFilters.assignmentStatus.length > 0
        ) {
            filtered = filtered.filter((student) => {
                return student.courses.some((course) => {
                    if (
                        !course.longestAwaitAssignment &&
                        appliedFilters.assignmentStatus!.includes(
                            'no-assignment',
                        )
                    ) {
                        return true;
                    }
                    if (course.longestAwaitAssignment) {
                        const status = mapAssignmentStatusToCourseStatus(
                            course.longestAwaitAssignment.status,
                        );
                        return appliedFilters.assignmentStatus!.includes(
                            status,
                        );
                    }
                    return false;
                });
            });
        }

        setFilteredStudents(filtered);
    }, [studentsViewModel, appliedFilters, searchResults, searchQuery]);

    const mapAssignmentStatusToCourseStatus = (status: string | null): string => {
        switch (status) {
            case 'Passed':
                return 'passed';
            case 'AwaitingReview':
                return 'waiting-feedback';
            case 'AwaitingForLongTime':
                return 'long-wait';
            default:
                return 'no-assignment';
        }
    };

    const handleApplyFilters = (filters: StudentCardFilterModel) => {
        setAppliedFilters(filters);
        setIsFilterModalOpen(false);
    };

    const handleOpenFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    const handleCloseFilterModal = () => {
        setIsFilterModalOpen(false);
    };

    const handleClearAllFilters = () => {
        setAppliedFilters({});
        setSearchQuery('');
        setSearchResults(undefined);
    };

    const handleSearchResults = (
        results: viewModels.TListCoachStudentsSuccess['students'],
    ) => {
        setSearchResults(results);
    };

    const handleSearchQueryChange = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults(undefined);
        }
    };

    // Check if any filters or search are active
    const hasActiveFiltersOrSearch =
        Object.keys(appliedFilters).some((key) => {
            const value = appliedFilters[key as keyof StudentCardFilterModel];
            return Array.isArray(value)
                ? value.length > 0
                : value && value.toString().trim() !== '';
        }) || searchQuery.trim() !== '';

    const router = useRouter();

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    {
                        label: breadcrumbsTranslations('home'),
                        onClick: () => router.push('/'),
                    },
                    {
                        label: breadcrumbsTranslations('workspace'),
                        onClick: () => router.push('/workspace/'),
                    },
                    {
                        label: breadcrumbsTranslations('students'),
                        onClick: () => {
                            // Nothing should happen on clicking the current page
                        },
                    },
                ]}
            />
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                <div className="flex flex-col mb-4">
                    <h1>{pageTranslations('yourStudents')}</h1>
                    {hasActiveFiltersOrSearch && (
                        <Button
                            variant="text"
                            size="small"
                            onClick={handleClearAllFilters}
                            text={pageTranslations('clearAllFilters')}
                            className="self-start mt-1"
                            hasIconLeft
                            iconLeft={<IconClose />}
                        />
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div className="w-full sm:w-64">
                        <SearchInput
                            items={
                                studentsViewModel?.mode === 'default'
                                    ? studentsViewModel.data.students
                                    : []
                            }
                            keys={['fullName']}
                            onResults={handleSearchResults}
                            onQueryChange={handleSearchQueryChange}
                            placeholder={pageTranslations('search')}
                            className="w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="medium"
                            onClick={handleOpenFilterModal}
                            text={pageTranslations('filter')}
                        />
                    </div>
                </div>
            </div>
            <CoachStudentsList
                students={
                    filteredStudents !== undefined
                        ? filteredStudents
                        : studentsViewModel?.mode === 'default'
                            ? studentsViewModel.data.students
                            : []
                }
                isLoading={isFetching}
                error={error}
                hasActiveFiltersOrSearch={hasActiveFiltersOrSearch}
            />

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <StudentCardFilterModal
                    onApplyFilters={handleApplyFilters}
                    onClose={handleCloseFilterModal}
                    initialFilters={appliedFilters}
                    locale={locale}
                />
            )}
        </div>
    );
}
