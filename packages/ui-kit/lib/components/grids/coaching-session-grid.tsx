'use client';
import { AgGridReact } from 'ag-grid-react';
import { RefObject, useState, useMemo, useEffect, useCallback } from 'react';
import { BaseGrid } from './base-grid';
import { AllCommunityModule, IRowNode, ModuleRegistry, SortChangedEvent } from 'ag-grid-community';
import { Button } from '../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { StarRating } from '../star-rating';
import { Badge } from '../badge';
import { viewModels } from '@maany_shr/e-class-models';
import { InputField } from '../input-field';
import { IconSearch } from '../icons/icon-search';

ModuleRegistry.registerModules([AllCommunityModule]);

// Single coaching session item type (from the success payload)
type CoachingSession = viewModels.TListCoachingSessionsSuccess['sessions'][number];

export interface CoachingSessionGridProps extends isLocalAware {
    gridRef: RefObject<AgGridReact | null>;
    onCoachClick: (coach: CoachingSession['coach'] | null) => void;
    onStudentClick?: (student: CoachingSession['student'] | null) => void;
    onCourseClick?: (course: CoachingSession['course'] | null) => void;
    sessions: CoachingSession[];
    onSortChanged?: (event: SortChangedEvent) => void;
    doesExternalFilterPass?: (node: IRowNode<any>) => boolean;
    enableSelection?: boolean;
    onSendReminders?: (sessionIds: string[]) => void;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: CoachingSession['status'] }) => {
    const statusConfig = {
        // 'info' used for neutral/unscheduled state (Badge doesn't have 'secondary')
        unscheduled: { variant: 'info' as const, text: 'Unscheduled' },
        requested: { variant: 'warningprimary' as const, text: 'Requested' },
        scheduled: { variant: 'info' as const, text: 'Scheduled' },
        completed: { variant: 'successprimary' as const, text: 'Completed' },
        canceled: { variant: 'errorprimary' as const, text: 'Canceled' }
    };

    const config = statusConfig[status] || { variant: 'secondary' as const, text: status || 'Unknown' };
    return <Badge size="medium" variant={config.variant} text={config.text} />;
};

const StudentCellRenderer = (props: any) => {
    const student = props.value;
    if (!student) return <span className="text-neutral-500">-</span>;

    const displayName = student.name && student.surname
        ? `${student.name} ${student.surname}`
        : student.name || student.username;

    return (
        <Button
            variant="text"
            text={displayName}
            className="text-sm px-0"
            title={student.username}
        />
    );
};

const CoachCellRenderer = (props: any) => {
    const coach = props.value;
    if (!coach) return <span className="text-neutral-500">-</span>;

    const displayName = coach.name && coach.surname
        ? `${coach.name} ${coach.surname}`
        : coach.username;

    return (
        <Button
            variant="text"
            text={displayName}
            className="text-sm px-0"
            title={coach.username}
        />
    );
};

const RatingCellRenderer = (props: any) => {
    const value = props.value;

    // Handle direct rating value or nested review.rating
    const rating = typeof value === 'object' ? (value?.rating ?? value?.review?.rating) : value;
    if (rating === undefined || rating === null) {
        return <span className="text-neutral-500">-</span>;
    }

    return (
        <div className="flex items-center space-x-2">
            <span>{rating.toFixed(1)}</span>
            <StarRating rating={rating} totalStars={5} size="sm" />
        </div>
    );
};

const DurationCellRenderer = (props: any) => {
    const duration = props.value;
    if (!duration) return <span className="text-neutral-500">-</span>;

    return <span>{duration}</span>;
};

const CourseCellRenderer = (props: any) => {
    const course = props.value;
    if (!course) return <span className="text-neutral-500">-</span>;

    return (
        <Button variant="text" className="truncate" title={course.title}>
            {course.title}
        </Button>
    );
};

const CouponCellRenderer = (props: any) => {
    const coupon = props.value;
    if (!coupon) return <span className="text-neutral-500">-</span>;

    return (
        <span className="truncate" title={`${coupon.code} (${coupon.discount}% off)`}>
            {coupon.code}
        </span>
    );
};

export const CoachingSessionGrid = (props: CoachingSessionGridProps) => {
    const dictionary = getDictionary(props.locale).pages.coachingSessions;

    // Search state
    const [searchTerm, setSearchTerm] = useState<string>('')
    const columnDefs = useMemo(() => [
        {
            field: 'startTime',
            headerName: 'Date & Time',
            filter: 'agDateColumnFilter',
            valueFormatter: (params: any) => {
                if (!params.value) return '-';
                const date = new Date(params.value);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                const timeStr = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                return `${dateStr} at ${timeStr}`;
            },
            width: 180
        },
        {
            field: 'coachingOfferingTitle',
            headerName: 'Title',
            minWidth: 200,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'coachingOfferingDuration',
            headerName: 'Duration (min)',
            cellRenderer: DurationCellRenderer,
            width: 120,
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'coach',
            headerName: 'Coach',
            cellRenderer: CoachCellRenderer,
            onCellClicked: (params: any) => {
                const coach = params.value;
                if (coach) props.onCoachClick(coach);
            },
            minWidth: 150,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'student',
            headerName: 'Student',
            cellRenderer: StudentCellRenderer,
            onCellClicked: (params: any) => {
                const student = params.value;
                if (student && props.onStudentClick) props.onStudentClick(student);
            },
            cellClass: 'cursor-pointer',
            minWidth: 150,
            filter: 'agTextColumnFilter'
        },

        {
            field: 'rating',
            headerName: 'Rating',
            cellRenderer: RatingCellRenderer,
            width: 140,
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'status',
            headerName: 'Status',
            cellRenderer: (params: any) => <StatusBadge status={params.value} />,
            width: 130,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'course',
            headerName: 'Course',
            cellRenderer: CourseCellRenderer,
            onCellClicked: (params: any) => {
                const course = params.value;
                if (course && props.onCourseClick) props.onCourseClick(course);
            },
            cellClass: 'cursor-pointer',
            minWidth: 180,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'coupon',
            headerName: 'Coupon',
            cellRenderer: CouponCellRenderer,
            width: 120,
            filter: 'agTextColumnFilter'
        }
    ], [props.onCoachClick]);

    // Client-side filtering logic for search
    const doesExternalFilterPass = useCallback((node: IRowNode<any>) => {
        if (!node.data) {
            return false;
        }
        const session = node.data;

        // Apply search term filter (fuzzy search across multiple fields)
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = session.coachingOfferingTitle?.toLowerCase().includes(searchLower);
            const coachNameMatch = session.coach?.name?.toLowerCase().includes(searchLower) ||
                session.coach?.surname?.toLowerCase().includes(searchLower) ||
                session.coach?.username?.toLowerCase().includes(searchLower);
            const studentNameMatch = session.student?.name?.toLowerCase().includes(searchLower) ||
                session.student?.surname?.toLowerCase().includes(searchLower) ||
                session.student?.username?.toLowerCase().includes(searchLower);
            const courseTitleMatch = session.course?.title?.toLowerCase().includes(searchLower);
            const couponCodeMatch = session.coupon?.code?.toLowerCase().includes(searchLower);

            if (!(titleMatch || coachNameMatch || studentNameMatch || courseTitleMatch || couponCodeMatch)) {
                return false;
            }
        }

        // If custom external filter is provided, apply it last
        if (props.doesExternalFilterPass) {
            return props.doesExternalFilterPass(node);
        }

        return true;
    }, [searchTerm, props.doesExternalFilterPass]);

    // Force refresh the grid when the search changes
    const refreshGrid = useCallback(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            props.gridRef.current.api.onFilterChanged();
        }
    }, [props.gridRef, doesExternalFilterPass]);

    // Apply filter when search changes
    useEffect(() => {
        refreshGrid();
    }, [refreshGrid, searchTerm]);


    useEffect(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            refreshGrid();
        }
    }, [props.gridRef, doesExternalFilterPass, refreshGrid]);

    // Listen for selection changes
    useEffect(() => {
        if (props.gridRef.current?.api && props.enableSelection) {
            const selectionListener = () => {
                const selectedRows = props.gridRef.current?.api?.getSelectedRows() || [];
            };

            props.gridRef.current.api.addEventListener('selectionChanged', selectionListener);
            selectionListener();

            return () => {
                props.gridRef.current?.api?.removeEventListener('selectionChanged', selectionListener);
            };
        }
    }, [props.gridRef, props.enableSelection]);

    return (
        <div className="h-full flex flex-col">

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <InputField
                    className="flex-grow relative m-0 md:mr-2 h-10"
                    setValue={setSearchTerm} value={searchTerm}
                    inputText={dictionary.searchPlaceholder || 'Search...'}
                    hasLeftContent
                    leftContent={<IconSearch />}
                />

            </div>

            <div className="flex flex-col grow">
                <BaseGrid
                    gridRef={props.gridRef}
                    locale={props.locale}
                    columnDefs={columnDefs}
                    rowData={props.sessions}
                    enableCellTextSelection={true}
                    onSortChanged={props.onSortChanged}
                    pagination={true}
                    suppressPaginationPanel={true}
                    paginationAutoPageSize={true}
                    rowSelection={props.enableSelection ? { mode: 'multiRow' } : undefined}
                    onSelectionChanged={() => {
                        const selectedRows = props.gridRef.current?.api?.getSelectedRows() || [];
                    }}
                />
            </div>

            {/* filter modal removed */}
        </div>
    );
};

