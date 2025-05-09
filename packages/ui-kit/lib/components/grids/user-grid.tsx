import { AgGridReact } from 'ag-grid-react';
import React, { RefObject, useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { AllCommunityModule, IRowNode, ModuleRegistry, SortChangedEvent } from 'ag-grid-community';
import { StarRating } from '../star-rating';
import { Button } from '../button';
import { UserGridFilterModal, UserFilterModel } from './user-grid-filter-modal';
import { TBasePersonalProfile } from '../../../../models/src/profile';
import { Search } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

// Extended User model
export interface UserCMS extends TBasePersonalProfile {
    userId: number;
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    rating?: number;
    platform: string;
    coachingSessionsCount?: number;
    coursesBought?: number;
    coursesCreated?: number;
    lastAccess: number; // timestamp
}

export interface UserGridProps {
    gridRef: RefObject<AgGridReact | null>;
    onUserDetailsClick: (user: UserCMS) => void;
    onEmailClick: (email: string) => void;
    users: UserCMS[];
    onSortChanged?: (event: SortChangedEvent) => void;
    doesExternalFilterPass?: (node: IRowNode<UserCMS>) => boolean;
    enableSelection?: boolean;
    onSendNotifications?: (userIds: number[]) => void;
}

const DetailsCellRenderer = () => {
    return <Button variant="text" text="Details" className="text-sm px-0" />;
};

const EmailCellRenderer = (props: any) => {
    const email = props.value;
    return <Button variant="text" text={email} className="text-sm px-0" />;
};

const RatingCellRenderer = (props: any) => {
    const rating = props.value;
    if (rating === undefined || rating === null) {
        return <span>-</span>;
    }

    const rounded = Number(rating.toFixed(2));
    const value = rounded % 1 === 0 ? Math.floor(rounded) : rounded;

    return <div className="flex items-center space-x-2">
        <span>{value}</span>
        <StarRating rating={rating} totalStars={5} />
    </div>;
};

export const UserGrid = (props: UserGridProps) => {
    const [columnDefs, setColumnDefs] = useState([
        { 
            headerCheckboxSelection: props.enableSelection,
            checkboxSelection: props.enableSelection,
            width: props.enableSelection ? 50 : 0,
            hide: !props.enableSelection
        },
        { field: 'name', headerName: 'Name' },
        { field: 'surname', headerName: 'Surname' },
        {
            cellRenderer: DetailsCellRenderer,
            onCellClicked: (params: any) => {
                const user = params.data;
                props.onUserDetailsClick(user);
            },
            cellClass: 'cursor-pointer',
            width: 100,
            resizable: false,
            sortable: false
        },
        {
            field: 'email',
            headerName: 'Email',
            cellRenderer: EmailCellRenderer,
            onCellClicked: (params: any) => {
                const email = params.value;
                props.onEmailClick(email);
            }
        },
        { field: 'phone', headerName: 'Phone' },
        {
            field: 'rating',
            headerName: 'Rating',
            cellRenderer: RatingCellRenderer
        },
        { field: 'platform', headerName: 'Platform' },
        {
            field: 'coachingSessionsCount', headerName: '# coaching sessions',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            }
        },
        {
            field: 'coursesBought', headerName: 'Courses bought',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            }
        },
        {
            field: 'coursesCreated', headerName: 'Courses created',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            }
        },
        {
            field: 'lastAccess', headerName: 'Last access', valueFormatter: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            }
        }
    ]);

    // For filter modal
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [filters, setFilters] = useState<Partial<UserFilterModel>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // For tracking selected users
    const [selectedUserCount, setSelectedUserCount] = useState<number>(0);

    // For batch actions UI state
    const [showBatchActions, setShowBatchActions] = useState<boolean>(false);

    // For batch actions
    const getSelectedUserIds = useCallback(() => {
        if (!props.gridRef.current?.api) return [];
        const selectedRows = props.gridRef.current.api.getSelectedRows();
        return selectedRows.map(row => row.userId);
    }, [props.gridRef]);

    // Get total users count
    const totalUsersCount = useMemo(() => {
        return props.users?.length || 0;
    }, [props.users]);

    const handleSendNotifications = useCallback(() => {
        const selectedUserIds = getSelectedUserIds();
        if (selectedUserIds.length === 0) {
            // Show error message
            alert("Error: no users selected to send notification");
            return;
        }
        
        if (props.onSendNotifications) {
            // First show an alert confirming the action
            alert(`Sending notifications to ${selectedUserIds.length} selected users`);
            
            // Then call the handler
            props.onSendNotifications(selectedUserIds);
        }
    }, [getSelectedUserIds, props.onSendNotifications]);

    // Toggle batch actions visibility
    const toggleBatchActions = useCallback(() => {
        setShowBatchActions(prev => !prev);
    }, []);

    // Listen for selection changes
    useEffect(() => {
        if (props.gridRef.current?.api && props.enableSelection) {

            const selectionListener = () => {
                const selectedRows = props.gridRef.current?.api?.getSelectedRows() || [];
                setSelectedUserCount(selectedRows.length);
                console.log(`Selection changed: ${selectedRows.length} users selected`);
            };
            
            props.gridRef.current.api.addEventListener('selectionChanged', selectionListener);
            selectionListener(); // Check initial selection state
            
            return () => {
                props.gridRef.current?.api?.removeEventListener('selectionChanged', selectionListener);
            };
        }
    }, [props.gridRef, props.enableSelection]);

    // Client-side filtering logic
    const doesExternalFilterPass = useCallback((node: IRowNode<UserCMS>) => {
        if (!node.data) return false;
        const user = node.data;

        // Apply search term filter (fuzzy search)
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = user.name?.toLowerCase().includes(searchLower);
            const surnameMatch = user.surname?.toLowerCase().includes(searchLower);
            const emailMatch = user.email?.toLowerCase().includes(searchLower);
            const phoneMatch = user.phone?.toLowerCase().includes(searchLower);
            
            if (!(nameMatch || surnameMatch || emailMatch || phoneMatch)) {
                return false;
            }
        }

        // Apply modal filters
        if (filters.minRating !== undefined && (user.rating === undefined || user.rating < filters.minRating)) {
            return false;
        }
        if (filters.maxRating !== undefined && user.rating !== undefined && user.rating > filters.maxRating) {
            return false;
        }
        if (filters.platform && filters.platform.length > 0 && !filters.platform.includes(user.platform)) {
            return false;
        }
        if (filters.minCoachingSessions && user.coachingSessionsCount !== undefined && 
            user.coachingSessionsCount < parseInt(filters.minCoachingSessions)) {
            return false;
        }
        if (filters.maxCoachingSessions && user.coachingSessionsCount !== undefined && 
            user.coachingSessionsCount > parseInt(filters.maxCoachingSessions)) {
            return false;
        }
        if (filters.minCoursesBought && user.coursesBought !== undefined && 
            user.coursesBought < parseInt(filters.minCoursesBought)) {
            return false;
        }
        if (filters.maxCoursesBought && user.coursesBought !== undefined && 
            user.coursesBought > parseInt(filters.maxCoursesBought)) {
            return false;
        }
        if (filters.minCoursesCreated && user.coursesCreated !== undefined && 
            user.coursesCreated < parseInt(filters.minCoursesCreated)) {
            return false;
        }
        if (filters.maxCoursesCreated && user.coursesCreated !== undefined && 
            user.coursesCreated > parseInt(filters.maxCoursesCreated)) {
            return false;
        }
        if (filters.lastAccessAfter && user.lastAccess < new Date(filters.lastAccessAfter).getTime()) {
            return false;
        }
        if (filters.lastAccessBefore && user.lastAccess > new Date(filters.lastAccessBefore).getTime()) {
            return false;
        }

        // If custom external filter is provided, apply it last
        if (props.doesExternalFilterPass) {
            return props.doesExternalFilterPass(node);
        }

        return true;
    }, [searchTerm, filters, props.doesExternalFilterPass]);

    // Extract unique platforms for filter modal
    const platforms = useMemo(() => {
        if (!props.users) return [];
        const platformSet = new Set(props.users.map(user => user.platform));
        return Array.from(platformSet);
    }, [props.users]);

    // Apply filter when search or filters change
    const applyFilters = useCallback(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.onFilterChanged();
        }
    }, [props.gridRef]);

    // Apply filters when they change
    React.useEffect(() => {
        applyFilters();
    }, [searchTerm, filters, applyFilters]);

    return (
        <div className="flex flex-col h-full">
            {/* First row: Search bar and Filter button */}
            <div className="flex items-center justify-between mb-2">
                {/* Search bar */}
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border rounded bg-input-fill text-text-primary border-input-stroke focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-primary opacity-50" />
                </div>
                
                {/* Filter button */}
                <Button 
                    variant="secondary" 
                    size="medium" 
                    text="Filters" 
                    onClick={() => setShowFilterModal(true)} 
                />
            </div>
            
            {/* Second row: Batch actions controls */}
            {props.enableSelection && (
                <div className="flex items-center mb-4">
                    {!showBatchActions ? (
                        <Button 
                            variant="secondary" 
                            size="medium" 
                            text="Batch Actions" 
                            onClick={toggleBatchActions} 
                        />
                    ) : (
                        <div className="flex space-x-2 items-center">
                            <span className="text-sm text-white mr-2">
                                {selectedUserCount}/{totalUsersCount} selected
                            </span>
                            
                            {props.onSendNotifications && (
                                <Button 
                                    variant="primary" 
                                    size="medium" 
                                    text="Send Notifications" 
                                    onClick={handleSendNotifications}
                                    disabled={selectedUserCount === 0}
                                    className={selectedUserCount > 0 ? "opacity-100" : "opacity-50"}
                                />
                            )}
                            
                            <Button 
                                variant="secondary" 
                                size="medium" 
                                text="Hide Actions" 
                                onClick={toggleBatchActions} 
                            />
                        </div>
                    )}
                </div>
            )}

            <BaseGrid
                gridRef={props.gridRef}
                columnDefs={columnDefs}
                rowData={props.users}
                enableCellTextSelection={true}
                onSortChanged={props.onSortChanged}
                pagination={true}
                suppressPaginationPanel={true}
                paginationAutoPageSize={true}
                isExternalFilterPresent={() => true}
                doesExternalFilterPass={doesExternalFilterPass}
                rowSelection={props.enableSelection ? 'multiple' : undefined}
                onSelectionChanged={() => {
                    const selectedRows = props.gridRef.current?.api?.getSelectedRows() || [];
                    setSelectedUserCount(selectedRows.length);
                }}
            />

            {/* Filter Modal */}
            {showFilterModal && (
                <UserGridFilterModal
                    onApplyFilters={(newFilters) => {
                        setFilters(newFilters);
                        applyFilters();
                    }}
                    onClose={() => setShowFilterModal(false)}
                    initialFilters={filters}
                    platforms={platforms}
                />
            )}
        </div>
    );
};