import { AgGridReact } from 'ag-grid-react';
import React, { RefObject, useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { AllCommunityModule, IRowNode, ModuleRegistry, SortChangedEvent } from 'ag-grid-community';
import { Button } from '../button';
import { UserGridFilterModal, UserFilterModel } from './user-grid-filter-modal';
import { TBasePersonalProfile } from '../../../../models/src/profile';
import { Search, User, Book, Video, Shield } from 'lucide-react';
import { Tabs, TabList, TabTrigger, TabContent } from '../tabs/tab';

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
    roles: string[]; // Array of roles: admin, course creator, coach, student
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

// Role icon component
const RoleIcon = ({ role }: { role: string }) => {
    const icons = {
        admin: <Shield className="w-4 h-4" />,
        'course creator': <Book className="w-4 h-4" />,
        coach: <Video className="w-4 h-4" />,
        student: <User className="w-4 h-4" />
    };

    return icons[role as keyof typeof icons] || <User className="w-4 h-4" />;
};

// Get highest role based on hierarchy
const getHighestRole = (roles: string[]): string => {
    const hierarchy = ['admin', 'course creator', 'coach', 'student'];
    if (!roles || roles.length === 0) return 'student';
    return roles.reduce((highest, role) => {
        const currentIndex = hierarchy.indexOf(role);
        const highestIndex = hierarchy.indexOf(highest);
        return currentIndex < highestIndex ? role : highest;
    }, roles[0]);
};

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

    const rounded = Number(rating.toFixed(1));
    if (rating % 1 === 0) {
        return Math.floor(rating);
    }
    return rounded;
};

const PlatformCellRenderer = (props: any) => {
    const { platform, roles } = props.data;
    const highestRole = getHighestRole(roles);
    
    return (
        <div className="flex items-center gap-2">
            <RoleIcon role={highestRole} />
            <span>{platform}</span>
        </div>
    );
};

export const UserGrid = (props: UserGridProps) => {
    const [selectedRole, setSelectedRole] = useState<string>('all');

    const [columnDefs, setColumnDefs] = useState([
        { 
            headerCheckboxSelection: props.enableSelection,
            checkboxSelection: props.enableSelection,
            width: props.enableSelection ? 50 : 0,
            hide: !props.enableSelection,
            filter: false
        },
        { 
            field: 'name', 
            headerName: 'Name', 
            filter: 'agTextColumnFilter' 
        },
        { 
            field: 'surname', 
            headerName: 'Surname', 
            filter: 'agTextColumnFilter' 
        },
        {
            cellRenderer: DetailsCellRenderer,
            onCellClicked: (params: any) => {
                const user = params.data;
                props.onUserDetailsClick(user);
            },
            cellClass: 'cursor-pointer',
            width: 100,
            resizable: false,
            sortable: false,
            filter: false
        },
        {
            field: 'email',
            headerName: 'Email',
            cellRenderer: EmailCellRenderer,
            onCellClicked: (params: any) => {
                const email = params.value;
                props.onEmailClick(email);
            },
            filter: 'agTextColumnFilter'
        },
        { 
            field: 'phone', 
            headerName: 'Phone', 
            filter: 'agTextColumnFilter' 
        },
        {
            field: 'rating',
            headerName: 'Rating',
            cellRenderer: RatingCellRenderer,
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'platform',
            headerName: 'Platform',
            cellRenderer: PlatformCellRenderer,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'coachingSessionsCount', 
            headerName: '# coaching sessions',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            },
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'coursesBought', 
            headerName: 'Courses bought',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            },
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'coursesCreated', 
            headerName: 'Courses created',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            },
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'lastAccess', 
            headerName: 'Last access', 
            valueFormatter: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
            filter: 'agDateColumnFilter'
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
            alert("Error: no users selected to send notification");
            return;
        }

        if (props.onSendNotifications) {
            alert(`Sending notifications to ${selectedUserIds.length} selected users`);
            props.onSendNotifications(selectedUserIds);
        }
    }, [getSelectedUserIds, props.onSendNotifications]);

    // Export current view to CSV
    const handleExportCurrentView = useCallback(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.exportDataAsCsv({
                fileName: `user_grid_export_${new Date().toISOString()}.csv`,
                onlySelected: false,
                skipPinnedTop: true,
                skipPinnedBottom: true
            });
        }
    }, [props.gridRef]);

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
            selectionListener();

            return () => {
                props.gridRef.current?.api?.removeEventListener('selectionChanged', selectionListener);
            };
        }
    }, [props.gridRef, props.enableSelection]);

    // Client-side filtering logic
    const doesExternalFilterPass = useCallback((node: IRowNode<UserCMS>) => {
        if (!node.data) {
            return false;
        }
        const user = node.data;

        // Apply role filter from tabs
        if (selectedRole !== 'all') {
            if (!user.roles || !user.roles.includes(selectedRole)) {
                return false;
            }
        }

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
    }, [searchTerm, filters, selectedRole, props.doesExternalFilterPass]);

    // Extract unique platforms for filter modal
    const platforms = useMemo(() => {
        if (!props.users) return [];
        const platformSet = new Set(props.users.map(user => user.platform));
        return Array.from(platformSet);
    }, [props.users]);

    // Force refresh the grid when the external filter changes
    const refreshGrid = useCallback(() => {
        if (props.gridRef.current?.api) {
            // Ensure the external filter is set
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            // Trigger filter re-evaluation
            props.gridRef.current.api.onFilterChanged();
        }
    }, [props.gridRef, doesExternalFilterPass]);

    // Apply filter when search, filters, or role changes
    useEffect(() => {
        refreshGrid();
    }, [refreshGrid, searchTerm, filters, selectedRole]);

    // Handle tab change for role filtering
    const handleTabChange = (value: string) => {
        console.log(`Tab changed to: ${value}`);
        setSelectedRole(value);
        // Explicitly refresh the grid to apply the new role filter
        refreshGrid();
    };

    // Initialize the grid with external filters enabled
    useEffect(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            refreshGrid();
        }
    }, [props.gridRef, doesExternalFilterPass, refreshGrid]);

    return (
        <div className="flex flex-col h-full">
            {/* Role Tabs */}
            <div className="overflow-auto">
                <Tabs.Root 
                    defaultTab="all" 
                    onValueChange={handleTabChange}
                >
                    <TabList 
                        className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2"
                    >
                        <TabTrigger value="all">
                            All
                        </TabTrigger>
                        <TabTrigger
                            value="student"
                            icon={<RoleIcon role="student" />}
                        >
                            Students
                        </TabTrigger>
                        <TabTrigger
                            value="coach"
                            icon={<RoleIcon role="coach" />}
                        >
                            Coaches
                        </TabTrigger>
                        <TabTrigger
                            value="course creator"
                            icon={<RoleIcon role="course creator" />}
                        >
                            Course Creators
                        </TabTrigger>
                        <TabTrigger
                            value="admin"
                            icon={<RoleIcon role="admin" />}
                        >
                            Admins
                        </TabTrigger>
                    </TabList>
                </Tabs.Root>
            </div>

            {/* Search bar, Filter button, and Export button */}
            <div className="flex items-center justify-between mb-2 mt-4">
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
                
                <div className="flex space-x-2">
                    <Button 
                        variant="text" 
                        size="medium" 
                        text="Export View" 
                        onClick={handleExportCurrentView} 
                    />
                    <Button 
                        variant="secondary" 
                        size="medium" 
                        text="Filters" 
                        onClick={() => setShowFilterModal(true)} 
                    />
                </div>
            </div>
            
            {/* Batch actions controls */}
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

            {showFilterModal && (
                <UserGridFilterModal
                    onApplyFilters={(newFilters) => {
                        setFilters(newFilters);
                    }}
                    onClose={() => setShowFilterModal(false)}
                    initialFilters={filters}
                    platforms={platforms}
                />
            )}
        </div>
    );
};