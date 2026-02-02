'use client';
import { AgGridReact } from 'ag-grid-react';
import { RefObject, useState, useCallback, useMemo, useEffect } from 'react';
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
export interface UserRow extends profile.TBasePersonalProfile {
    userId: number;
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    username: string;
    rating?: number;
    roles: { platformName: string; role: string }[];
    coachingSessionsCount?: number;
    coursesBought?: number;
    coursesCreated?: number;
    lastAccess: number; // timestamp
}

export interface UserGridProps extends isLocalAware {
    gridRef: RefObject<AgGridReact | null>;
    onUserDetailsClick: (user: UserRow) => void;
    onEmailClick: (email: string) => void;
    emailTooltip?: string;
    users: UserRow[];
    onSortChanged?: (event: SortChangedEvent) => void;
    doesExternalFilterPass?: (node: IRowNode<UserRow>) => boolean;
    enableSelection?: boolean;
    onSendNotifications?: (userIds: number[]) => void;
    showDetailsColumn: boolean;
    variant: 'platform' | 'all';
}

// Role icon component
const RoleIcon = ({ role, className }: { role: string; className?: string }) => {
    const icons = {
        admin: <IconAdmin classNames={className} />,
        superadmin: <IconAdmin classNames={className} />,
        'course creator': <IconCourseCreator classNames={className} />,
        coach: <IconCoach classNames={className} />,
        student: <IconStudent classNames={className} />

    };

    return icons[role as keyof typeof icons] || <IconAll classNames={className} />;
};

const DetailsCellRenderer = () => {
    return <Button variant="text" text="Details" className="text-sm px-0" />;
};

const EmailCellRenderer = (props: any) => {
    const email = props.value;
    const tooltip = props.colDef?.cellRendererParams?.emailTooltip;
    return <Button variant="text" text={email} className="text-sm px-0" title={tooltip} />;
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
    const data: UserRow = props.data;
    const roles = data.roles;
    if (!roles || roles.length === 0) return <span>-</span>;

    const title = roles.map(({ platformName, role }) => `${platformName}: ${role}`).join(', ');

    return (
        <div className="truncate" title={title}>
            {roles.map(({ platformName, role }, idx) => (
                <span
                    key={platformName + role}
                    className="inline-flex items-center text-xs align-middle"
                >
                    <RoleIcon role={role} className="w-4 h-4" />
                    <span className="ml-1">{platformName}</span>
                    {idx < roles.length - 1 && <span>,&nbsp;</span>}
                </span>
            ))}
        </div>
    );
};


const ROLE_HIERARCHY = ['superadmin', 'admin', 'course_creator', 'coach', 'student'];

function getHighestRole(roles: { platformName: string; role: string }[]): string {
    for (const role of ROLE_HIERARCHY) {
        if (roles.some(r => r.role === role)) return role;
    }
    return roles[0]?.role ?? '';
}

function formatRoleDisplay(role: string): string {
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getRoleValueForVariant(variant: 'platform' | 'all', roles: { platformName: string; role: string }[]): string {
    if (!roles || roles.length === 0) return '';

    if (variant === 'platform') {
        return formatRoleDisplay(getHighestRole(roles));
    }

    // variant === 'all'
    if (roles.some(r => r.role === 'superadmin')) {
        return 'Superadmin';
    }

    // Group roles by platform, pick highest role per platform
    const platformMap = new Map<string, { platformName: string; role: string }[]>();
    for (const r of roles) {
        const existing = platformMap.get(r.platformName) ?? [];
        existing.push(r);
        platformMap.set(r.platformName, existing);
    }

    const parts: string[] = [];
    for (const [platformName, platformRoles] of platformMap) {
        const highest = getHighestRole(platformRoles);
        parts.push(`${platformName}: ${formatRoleDisplay(highest)}`);
    }
    return parts.join(', ');
}

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
    const dictionary = getDictionary(props.locale).components.userGrid;

    const columnDefs = useMemo(() => [
        {
            field: 'name',
            headerName: dictionary.nameColumn,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'surname',
            headerName: dictionary.surnameColumn,
            filter: 'agTextColumnFilter'
        },
        ...(props.showDetailsColumn ? [{
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
        }] : []),
        {
            field: 'email',
            headerName: dictionary.emailColumn,
            cellRenderer: EmailCellRenderer,
            cellRendererParams: {
                emailTooltip: props.emailTooltip
            },
            onCellClicked: (params: any) => {
                const email = params.value;
                props.onEmailClick(email);
            },
            filter: 'agTextColumnFilter'
        },
        {
            headerName: dictionary.roleColumn,
            valueGetter: (params: any) => {
                const data: UserRow = params.data;
                if (!data?.roles) return '';
                return getRoleValueForVariant(props.variant, data.roles);
            },
            filter: 'agTextColumnFilter'
        },
        {
            field: 'phone',
            headerName: dictionary.phoneNumberColumn,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'rating',
            headerName: dictionary.ratingColumn,
            cellRenderer: RatingCellRenderer,
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'platform',
            headerName: dictionary.platformColumn,
            cellRenderer: PlatformCellRenderer,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'coachingSessionsCount',
            headerName: dictionary.coachingSessionsColumn,
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            },
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'coursesBought',
            headerName: dictionary.coursesBoughtColumn,
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            },
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'coursesCreated',
            headerName: dictionary.coursesCreatedColumn,
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            },
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'lastAccess',
            headerName: dictionary.lastAccessColumn,
            valueFormatter: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
            filter: 'agDateColumnFilter'
        }
    ], [dictionary, props.emailTooltip, props.showDetailsColumn, props.onUserDetailsClick, props.variant]);

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

    // Get filtered users counts for each role category
    const userCounts = useMemo(() => {
        if (!props.users) return { all: 0, student: 0, coach: 0, 'course creator': 0, admin: 0 };

        return props.users.reduce((counts: Record<string, number>, user) => {
            counts.all++;

            if (user.roles) {
                user.roles.forEach(roleObj => {
                    // Map course_creator to 'course creator' for display
                    const displayRole = roleObj.role === 'course_creator' ? 'course creator' : roleObj.role;
                    if (counts[displayRole] !== undefined) {
                        counts[displayRole]++;
                    }
                });
            }

            return counts;
        }, { all: 0, student: 0, coach: 0, 'course creator': 0, admin: 0 });
    }, [props.users]);

    const handleSendNotifications = useCallback(() => {
        const selectedUserIds = getSelectedUserIds();
        if (selectedUserIds.length === 0) {
            alert(dictionary.sendNotificationNoUsersError);
            return;
        }

        if (props.onSendNotifications) {
            props.onSendNotifications(selectedUserIds);
        }
    }, [getSelectedUserIds, props.onSendNotifications, dictionary]);

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

    // Export selected rows to CSV
    const handleExportSelected = useCallback(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.exportDataAsCsv({
                fileName: `user_grid_selected_export_${new Date().toISOString()}.csv`,
                onlySelected: true,
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
            };

            props.gridRef.current.api.addEventListener('selectionChanged', selectionListener);
            selectionListener();

            return () => {
                props.gridRef.current?.api?.removeEventListener('selectionChanged', selectionListener);
            };
        }
    }, [props.gridRef, props.enableSelection]);

    // Client-side filtering logic
    const doesExternalFilterPass = useCallback((node: IRowNode<UserRow>) => {
        if (!node.data) {
            return false;
        }
        const user = node.data;
        const userPlatforms = user.roles?.map(roleObj => roleObj.platformName) || [];

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
        if (
            (filters.platform?.length ?? 0) > 0 &&
            !userPlatforms.some(platform => filters.platform!.includes(platform))
        ) {
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

        const platformSet = new Set<string>();
        props.users.forEach(user => {
            user.roles?.forEach(roleObj => {
                if (roleObj.platformName) {
                    platformSet.add(roleObj.platformName);
                }
            });
        });

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
    const renderGridWithActions = (roleUsers: UserRow[]) => (
        <div className="h-full flex flex-col">
            {/* Search bar, Filter button, and Export button */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between mb-4">
                <InputField
                    className="flex-grow relative m-0 md:mr-2 h-10"
                    setValue={setSearchTerm} value={searchTerm}
                    inputText={dictionary.searchPlaceholder}
                    hasLeftContent
                    leftContent={<IconSearch />}
                />
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1.5">
                    <Button
                        variant="text"
                        size="medium"
                        text={dictionary.exportCurrentView}
                        hasIconLeft
                        iconLeft={<IconCloudDownload />}
                        onClick={handleExportCurrentView}
                        className="w-full md:w-auto"
                    />
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.filterButton}
                        onClick={() => setShowFilterModal(true)}
                        hasIconLeft
                        iconLeft={<IconFilter />}
                        className="w-full md:w-auto"
                    />
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.clearFilters}
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
                            text={dictionary.batchActions}
                            onClick={toggleBatchActions}
                        />
                    ) : (
                        <div className="flex space-x-2 items-center overflow-x-auto">
                            <span className="text-sm text-white mr-2">
                                {selectedUserCount}/{roleUsers.length} {dictionary.selected}
                            </span>

                            {props.onSendNotifications && (
                                <Button
                                    variant="primary"
                                    size="medium"
                                    text={dictionary.sendNotification}
                                    onClick={handleSendNotifications}
                                    disabled={selectedUserCount === 0}
                                    className={selectedUserCount > 0 ? 'opacity-100' : 'opacity-50'}
                                />
                            )}

                            <Button
                                variant="primary"
                                size="medium"
                                text={dictionary.exportSelection}
                                hasIconLeft
                                iconLeft={<IconCloudDownload />}
                                onClick={handleExportSelected}
                                disabled={selectedUserCount === 0}
                                className={selectedUserCount > 0 ? 'opacity-100' : 'opacity-50'}
                            />

                            <Button
                                variant="secondary"
                                size="medium"
                                text={dictionary.hideActions}
                                onClick={toggleBatchActions}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col grow">
                <BaseGrid
                    gridRef={props.gridRef}
                    locale={props.locale}
                    columnDefs={columnDefs}
                    rowData={roleUsers}
                    getRowId={(params) => String(params.data.userId)}
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
                        <TabTrigger value="all" icon={<IconAll />} className="cursor-pointer" isLast={false}>
                            {dictionary.all} ({userCounts.all})
                        </TabTrigger>
                        <TabTrigger
                            value="student"
                            icon={<RoleIcon role="student" />}
                            className="cursor-pointer"
                            isLast={false}
                        >
                            {dictionary.students} ({userCounts.student})
                        </TabTrigger>
                        <TabTrigger
                            value="coach"
                            icon={<RoleIcon role="coach" />}
                            className="cursor-pointer"
                            isLast={false}
                        >
                            {dictionary.coaches} ({userCounts.coach})
                        </TabTrigger>
                        <TabTrigger
                            value="course creator"
                            icon={<RoleIcon role="course creator" />}
                            className="cursor-pointer"
                            isLast={false}
                        >
                            {dictionary.courseCreators} ({userCounts['course creator']})
                        </TabTrigger>
                        <TabTrigger
                            value="admin"
                            icon={<RoleIcon role="admin" />}
                            className="cursor-pointer"
                            isLast={true}
                        >
                            {dictionary.admin} ({userCounts.admin})
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
                            {renderGridWithActions(props.users?.filter(user => user.roles?.some(roleObj => roleObj.role === 'course_creator')) || [])}
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
                    locale={props.locale}
                />
            )}
        </div>
    );
};
