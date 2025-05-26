import { AgGridReact } from 'ag-grid-react';
import React, { RefObject, useState, useCallback, useMemo, useEffect } from 'react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { AllCommunityModule, IRowNode, ModuleRegistry, SortChangedEvent } from 'ag-grid-community';
import { Button } from '../button';
import { UserGridFilterModal, UserFilterModel } from './user-grid-filter-modal';
import { profile } from '@maany_shr/e-class-models';
import { Tabs, TabList, TabTrigger, TabContent } from '../tabs/tab';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconAdmin } from '../icons/icon-admin';
import { IconCourseCreator } from '../icons/icon-course-creator';
import { IconCoach } from '../icons/icon-coach';
import { IconStudent } from '../icons/icon-student';
import { IconAll } from '../icons/icon-all';
import { IconFilter } from '../icons/icon-filter';
import { IconSearch } from '../icons/icon-search';
import { InputField } from '../input-field';
import { StarRating } from '../star-rating';

ModuleRegistry.registerModules([AllCommunityModule]);

// Extended User model
export interface UserCMS extends profile.TBasePersonalProfile {
    userId: number;
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    rating?: number;
    platform: string;
    roles: { platformName: string; role: string }[];
    coachingSessionsCount?: number;
    coursesBought?: number;
    coursesCreated?: number;
    lastAccess: number; // timestamp
}

export interface UserGridProps extends isLocalAware {
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
        admin: <IconAdmin />,
        'course creator': <IconCourseCreator />,
        coach: <IconCoach />,
        student: <IconStudent />
    };

    return icons[role as keyof typeof icons] || <IconAll />;
};

// Get highest role based on hierarchy
const getHighestRole = (roles: { platformName: string; role: string }[]): string => {
    const hierarchy = ['admin', 'course creator', 'coach', 'student'];
    if (!roles || roles.length === 0) return 'student';
    return roles.reduce((highest, roleObj) => {
        const currentIndex = hierarchy.indexOf(roleObj.role);
        const highestIndex = hierarchy.indexOf(highest);
        return currentIndex < highestIndex ? roleObj.role : highest;
    }, roles[0].role);
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

    const rounded = Number(rating.toFixed(2));
    const value = rounded % 1 === 0 ? Math.floor(rounded) : rounded;

    return <div className="flex items-center space-x-2">
        <span>{value}</span>
        <StarRating rating={rating} totalStars={5} />
    </div>;
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

/**
 * A reusable UserGrid component for displaying and managing a grid of user data with filtering, sorting, and selection capabilities.
 *
 * @param gridRef A React ref object to access the AG Grid instance for programmatic control.
 * @param onUserDetailsClick Callback function triggered when the "Details" button is clicked for a user. Receives the selected `UserCMS` object.
 * @param onEmailClick Callback function triggered when an email is clicked. Receives the email string.
 * @param users An array of `UserCMS` objects representing the users to display in the grid.
 * @param onSortChanged Optional callback function triggered when the grid's sort order changes. Receives the `SortChangedEvent` from AG Grid.
 * @param doesExternalFilterPass Optional function to define custom external filtering logic. Receives an `IRowNode<UserCMS>` and returns a boolean.
 * @param enableSelection Optional boolean to enable row selection with checkboxes. Defaults to `false`.
 * @param onSendNotifications Optional callback function triggered when notifications are sent to selected users. Receives an array of selected user IDs.
 * @param locale The locale used for translations and localization.
 *
 * @example
 * ```tsx
 * const gridRef = useRef<AgGridReact>(null);
 * const users = [
 *   {
 *     userId: 1,
 *     id: 1,
 *     name: "John",
 *     surname: "Doe",
 *     email: "john.doe@example.com",
 *     phone: "+1234567890",
 *     rating: 4.5,
 *     platform: "Web",
 *     roles: [
 *       { platformName: "Web", role: "student" },
 *       { platformName: "Mobile", role: "coach" }
 *     ],
 *     coachingSessionsCount: 10,
 *     coursesBought: 3,
 *     coursesCreated: 0,
 *     lastAccess: 1697059200000
 *   },
 *   // Additional users...
 * ];
 *
 * <UserGrid
 *   gridRef={gridRef}
 *   onUserDetailsClick={(user) => console.log("User details:", user)}
 *   onEmailClick={(email) => console.log("Email clicked:", email)}
 *   users={users}
 *   onSortChanged={(event) => console.log("Sort changed:", event)}
 *   doesExternalFilterPass={(node) => node.data.rating > 3}
 *   enableSelection={true}
 *   onSendNotifications={(userIds) => console.log("Send notifications to:", userIds)}
 *   locale="en"
 * />
 * ```
 */
export const UserGrid = (props: UserGridProps) => {
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const dictionary = getDictionary(props.locale);
    const [columnDefs, setColumnDefs] = useState([
        // {
        //     headerCheckboxSelection: props.enableSelection,
        //     checkboxSelection: props.enableSelection,
        //     width: props.enableSelection ? 50 : 0,
        //     hide: !props.enableSelection,
        //     filter: false
        // },
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

    // Filter users based on selected role
    const filteredUsers = useMemo(() => {
        if (!props.users) return [];
        if (selectedRole === 'all') return props.users;

        return props.users.filter(user =>
            user.roles && user.roles.some(roleObj => roleObj.role === selectedRole)
        );
    }, [props.users, selectedRole]);

    // Get filtered users counts for each role category
    const userCounts = useMemo(() => {
        if (!props.users) return { all: 0, student: 0, coach: 0, 'course creator': 0, admin: 0 };

        return props.users.reduce((counts: Record<string, number>, user) => {
            counts.all++;

            if (user.roles) {
                user.roles.forEach(roleObj => {
                    if (counts[roleObj.role] !== undefined) {
                        counts[roleObj.role]++;
                    }
                });
            }

            return counts;
        }, { all: 0, student: 0, coach: 0, 'course creator': 0, admin: 0 });
    }, [props.users]);

    const handleSendNotifications = useCallback(() => {
        const selectedUserIds = getSelectedUserIds();
        if (selectedUserIds.length === 0) {
            alert('Error: no users selected to send notification');
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
            user.coachingSessionsCount < filters.minCoachingSessions) {
            return false;
        }
        if (filters.maxCoachingSessions && user.coachingSessionsCount !== undefined &&
            user.coachingSessionsCount > filters.maxCoachingSessions) {
            return false;
        }
        if (filters.minCoursesBought && user.coursesBought !== undefined &&
            user.coursesBought < filters.minCoursesBought) {
            return false;
        }
        if (filters.maxCoursesBought && user.coursesBought !== undefined &&
            user.coursesBought > filters.maxCoursesBought) {
            return false;
        }
        if (filters.minCoursesCreated && user.coursesCreated !== undefined &&
            user.coursesCreated < filters.minCoursesCreated) {
            return false;
        }
        if (filters.maxCoursesCreated && user.coursesCreated !== undefined &&
            user.coursesCreated > filters.maxCoursesCreated) {
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

    // Force refresh the grid when the external filter changes
    const refreshGrid = useCallback(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            props.gridRef.current.api.onFilterChanged();
        }
    }, [props.gridRef, doesExternalFilterPass]);

    // Apply filter when search or filters change
    useEffect(() => {
        refreshGrid();
    }, [refreshGrid, searchTerm, filters]);

    // Handle tab change for role filtering
    const handleTabChange = (value: string) => {
        console.log(`Tab changed to: ${value}`);
        setSelectedRole(value);
    };

    const handleClearAllFilters = useCallback(() => {
        setSearchTerm(''); // Clear search input

        // Reset modal filters to initial state
        setFilters({
            minRating: undefined,
            maxRating: undefined,
            platform: [],
            minCoachingSessions: undefined,
            maxCoachingSessions: undefined,
            minCoursesBought: undefined,
            maxCoursesBought: undefined,
            minCoursesCreated: undefined,
            maxCoursesCreated: undefined,
            lastAccessAfter: undefined,
            lastAccessBefore: undefined,
        });

        // Reset grid filters
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setFilterModel(null);
            props.gridRef.current.api.onFilterChanged();
        }

    }, [props.gridRef]);


    // Initialize the grid with external filters enabled
    useEffect(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            refreshGrid();
        }
    }, [props.gridRef, doesExternalFilterPass, refreshGrid]);

    // Render the common UI parts for all tab contents
    const renderGridWithActions = (roleUsers: UserCMS[]) => (
        <div className="h-full flex flex-col">
            {/* Search bar, Filter button, and Export button */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between mb-2">
                <InputField
                    className="flex-grow relative md:mr-2"
                    setValue={setSearchTerm} value={searchTerm}
                    inputText={dictionary.components.userGrid.searchPlaceholder}
                    hasLeftContent
                    leftContent={<IconSearch />}
                />
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1.5">
                    <Button
                        variant="text"
                        size="medium"
                        text={dictionary.components.userGrid.exportCurrentView}
                        hasIconLeft
                        iconLeft={<IconCloudDownload />}
                        onClick={handleExportCurrentView}
                        className="w-full md:w-auto"
                    />
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.components.userGrid.filterButton}
                        onClick={() => setShowFilterModal(true)}
                        hasIconLeft
                        iconLeft={<IconFilter />}
                        className="w-full md:w-auto"
                    />
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.components.userGrid.clearFilters}
                        onClick={handleClearAllFilters}
                        className="w-full md:w-auto"
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
                            text={dictionary.components.userGrid.batchActions}
                            onClick={toggleBatchActions}
                        />
                    ) : (
                        <div className="flex space-x-2 items-center">
                            <span className="text-sm text-white mr-2">
                                {selectedUserCount}/{roleUsers.length} {dictionary.components.userGrid.selected}
                            </span>

                            {props.onSendNotifications && (
                                <Button
                                    variant="primary"
                                    size="medium"
                                    text={dictionary.components.userGrid.sendNotification}
                                    onClick={handleSendNotifications}
                                    disabled={selectedUserCount === 0}
                                    className={selectedUserCount > 0 ? 'opacity-100' : 'opacity-50'}
                                />
                            )}

                            <Button
                                variant="secondary"
                                size="medium"
                                text={dictionary.components.userGrid.hideActions}
                                onClick={toggleBatchActions}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col grow">
                <BaseGrid
                    gridRef={props.gridRef}
                    columnDefs={columnDefs}
                    rowData={roleUsers}
                    enableCellTextSelection={true}
                    onSortChanged={props.onSortChanged}
                    pagination={true}
                    suppressPaginationPanel={true}
                    paginationAutoPageSize={true}
                    isExternalFilterPresent={() => true}
                    doesExternalFilterPass={doesExternalFilterPass}
                    rowSelection={props.enableSelection ? { mode: 'multiRow' } : undefined}
                    onSelectionChanged={() => {
                        const selectedRows = props.gridRef.current?.api?.getSelectedRows() || [];
                        setSelectedUserCount(selectedRows.length);
                    }}
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Role Tabs */}
            <div className="w-full h-full">
                <Tabs.Root
                    defaultTab="all"
                    onValueChange={handleTabChange}
                    className="h-full flex flex-col"
                >
                    <TabList
                        className="flex bg-base-neutral-800 rounded-medium gap-2 text-sm whitespace-nowrap flex-shrink-0"
                        variant="small"
                    >
                        <TabTrigger value="all" icon={<IconAll />} className="cursor-pointer">
                            {dictionary.components.userGrid.all} ({userCounts.all})
                        </TabTrigger>
                        <TabTrigger
                            value="student"
                            icon={<RoleIcon role="student" />}
                            className="cursor-pointer"
                        >
                            {dictionary.components.userGrid.students} ({userCounts.student})
                        </TabTrigger>
                        <TabTrigger
                            value="coach"
                            icon={<RoleIcon role="coach" />}
                            className="cursor-pointer"
                        >
                            {dictionary.components.userGrid.coaches} ({userCounts.coach})
                        </TabTrigger>
                        <TabTrigger
                            value="course creator"
                            icon={<RoleIcon role="course creator" />}
                            className="cursor-pointer"
                        >
                            {dictionary.components.userGrid.courseCreators} ({userCounts['course creator']})
                        </TabTrigger>
                        <TabTrigger
                            value="admin"
                            icon={<RoleIcon role="admin" />}
                            className="cursor-pointer"
                        >
                            {dictionary.components.userGrid.admin} ({userCounts.admin})
                        </TabTrigger>
                    </TabList>

                    <div className="mt-4 grow">
                        {/* Tab content with individual grid instances for each role */}
                        <TabContent value="all">
                            {renderGridWithActions(props.users || [])}
                        </TabContent>

                        <TabContent value="student">
                            {renderGridWithActions(props.users?.filter(user => user.roles?.some(roleObj => roleObj.role === 'student')) || [])}
                        </TabContent>

                        <TabContent value="coach">
                            {renderGridWithActions(props.users?.filter(user => user.roles?.some(roleObj => roleObj.role === 'coach')) || [])}
                        </TabContent>

                        <TabContent value="course creator">
                            {renderGridWithActions(props.users?.filter(user => user.roles?.some(roleObj => roleObj.role === 'course creator')) || [])}
                        </TabContent>

                        <TabContent value="admin">
                            {renderGridWithActions(props.users?.filter(user => user.roles?.some(roleObj => roleObj.role === 'admin')) || [])}
                        </TabContent>
                    </div>
                </Tabs.Root>
            </div>

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
