'use client';

import React, { useRef, useState, useMemo, useCallback, useEffect, RefObject } from 'react';
import { AllCommunityModule, IRowNode, ModuleRegistry, SortChangedEvent, ProcessCellForExportParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '../button';
import { InputField } from '../input-field';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { getDictionary } from '@maany_shr/e-class-translations';
import { CouponGridFilterModal, CouponFilterModel } from './coupon-grid-filter-modal';
import { IconFilter } from '../icons/icon-filter';
import { IconPlus } from '../icons/icon-plus';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconSearch } from '../icons/icon-search';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';

ModuleRegistry.registerModules([AllCommunityModule]);

// Coupon outcome types based on listCoupons API
type CouponOutcome =
    | { type: 'groupCourse'; groupId: number; groupName: string; course: { id: number; title: string; slug: string } }
    | { type: 'freeCoachingSession'; coachingOffering: { id: number; title: string; duration: number }; course: { id: number; title: string; slug: string } | null }
    | { type: 'discountOnEverything'; percentage: number }
    | { type: 'freeCourses'; courses: { id: number; title: string; slug: string; withCoaching: boolean }[] }
    | { type: 'freeBundles'; packages: { id: number; title: string; withCoaching: boolean }[] };

export interface CouponRow {
    id: string; // Backend returns string ID
    name: string;
    status: 'active' | 'revoked';
    usageCount: number; // Current usage count
    usagesAllowed: number | null; // Max usages allowed (nullable)
    createdAt: string; // ISO date string
    expirationDate: string | null; // ISO date string (nullable)
    outcome: CouponOutcome;
}

export interface CouponGridProps extends isLocalAware {
    gridRef: RefObject<AgGridReact | null>;
    coupons: CouponRow[];
    locale: TLocale;
    onRevokeCoupon: (couponId: string) => void;
    onCreateCoupon: () => void;
    onSortChanged?: (event: SortChangedEvent) => void;
    doesExternalFilterPass?: (node: IRowNode<CouponRow>) => boolean;
}

const OutcomeCellRenderer = (params: { value: CouponRow['outcome']; locale: TLocale }) => {
    const outcome = params.value;
    const dictionary = getDictionary(params.locale).components.couponGrid;

    switch (outcome.type) {
        case 'groupCourse': {
            const title = outcome.course?.title ?? '';
            const group = outcome.groupName ?? '';
            return (
                <div className="flex flex-col">
                    <span className="text-text-primary text-sm">{dictionary.freeCourses}</span>
                    <span className="text-text-secondary text-xs">{title}{group ? ` — ${group}` : ''}</span>
                </div>
            );
        }
        case 'freeCoachingSession': {
            const offering = outcome.coachingOffering?.title ?? '';
            const maybeCourse = outcome.course?.title ? ` — ${outcome.course.title}` : '';
            return (
                <div className="flex flex-col">
                    <span className="text-text-primary text-sm">{dictionary.coachingLabel}</span>
                    <span className="text-text-secondary text-xs">{offering}{maybeCourse}</span>
                </div>
            );
        }
        case 'discountOnEverything': {
            return (
                <div className="flex flex-col">
                    <span className="text-text-primary text-sm">{dictionary.discountPercent}</span>
                    <span className="text-text-secondary text-xs">{`${outcome.percentage}%`}</span>
                </div>
            );
        }
        case 'freeCourses': {
            const titles = (outcome.courses ?? []).map(c => c.title).join(', ');
            return (
                <div className="flex flex-col">
                    <span className="text-text-primary text-sm">{dictionary.freeCourses}</span>
                    <span className="text-text-secondary text-xs">{titles}</span>
                </div>
            );
        }
        case 'freeBundles': {
            const titles = (outcome.packages ?? []).map(p => p.title).join(', ');
            return (
                <div className="flex flex-col">
                    <span className="text-text-primary text-sm">{dictionary.freeCourses}</span>
                    <span className="text-text-secondary text-xs">{titles}</span>
                </div>
            );
        }
        default: {
            return null;
        }
    }
};

const StatusCellRenderer = (params: { value: CouponRow['status']; data: CouponRow; onRevoke: (id: string) => void; locale: TLocale }) => {
    const { value: status, data } = params;
    const dictionary = getDictionary(params.locale).components.couponGrid;
    
    if (status === 'revoked') {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {dictionary.revokedBadge}
            </span>
        );
    }
    
    return (
        <button
            onClick={() => params.onRevoke(data.id)}
            className="text-sm font-medium hover:opacity-80"
            style={{ color: '#A78BFA' }}
        >
            {dictionary.revokeButton}
        </button>
    );
};

/**
 * A reusable CouponGrid component for displaying and managing a grid of coupon data with filtering, sorting, and action capabilities.
 *
 * @param gridRef A React ref object to access the AG Grid instance for programmatic control.
 * @param coupons An array of CouponRow objects representing the coupons to display in the grid.
 * @param locale The locale used for translations and localization.
 * @param onRevokeCoupon Callback function triggered when the "Revoke" button is clicked for a coupon. Receives the coupon ID.
 * @param onCreateCoupon Callback function triggered when the "Create Coupon" button is clicked.
 * @param onSortChanged Optional callback function triggered when the grid's sort order changes. Receives the SortChangedEvent from AG Grid.
 * @param doesExternalFilterPass Optional function to define custom external filtering logic. Receives an IRowNode<CouponRow> and returns a boolean.
 *
 * @example
 * ```tsx
 * const gridRef = useRef<AgGridReact>(null);
 * const coupons = [
 *   {
 *     id: 1001,
 *     couponId: 1001,
 *     name: "SUMMER2024",
 *     usagesLeft: 5,
 *     maxUsages: 20,
 *     creationDate: 1704067200000,
 *     expirationDate: 1735689600000,
 *     outcome: {
 *       type: "free_courses",
 *       courses: ["Course A", "Course B"]
 *     },
 *     status: "active"
 *   },
 *   // Additional coupons...
 * ];
 *
 * <CouponGrid
 *   gridRef={gridRef}
 *   coupons={coupons}
 *   locale="en"
 *   onRevokeCoupon={(couponId) => console.log("Revoke coupon:", couponId)}
 *   onCreateCoupon={() => console.log("Create new coupon")}
 *   onSortChanged={(event) => console.log("Sort changed:", event)}
 *   doesExternalFilterPass={(node) => node.data.status === 'active'}
 * />
 * ```
 */
export const CouponGrid = (props: CouponGridProps) => {
    const dictionary = getDictionary(props.locale).components.couponGrid;

    const columnDefs = useMemo(() => [
        {
            field: 'name',
            headerName: dictionary.nameColumn,
            sortable: true,
            filter: 'agTextColumnFilter',
            flex: 2, // Takes up more space
            minWidth: 150,
            cellRenderer: (params: { value: string }) => (
                <span className="text-text-primary font-medium">
                    {params.value}
                </span>
            )
        },
        {
            field: 'usageCount',
            headerName: dictionary.usagesLeftColumn,
            sortable: true,
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any) => {
                const usageCount = params.data?.usageCount || 0;
                const usagesAllowed = params.data?.usagesAllowed;
                if (usagesAllowed === null) {
                    return `${usageCount}/∞`;
                }
                return `${usageCount}/${usagesAllowed}`;
            },
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'createdAt',
            headerName: dictionary.creationDateColumn,
            sortable: true,
            flex: 1,
            minWidth: 130,
            sort: 'desc' as const, // Default sort: newest first
            valueFormatter: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
            filter: 'agDateColumnFilter'
        },
        {
            field: 'expirationDate',
            headerName: dictionary.expirationDateColumn,
            sortable: true,
            flex: 1,
            minWidth: 130,
            valueFormatter: (params: any) => {
                if (!params.value) return '-';
                const date = new Date(params.value);
                return formatDate(date);
            },
            filter: 'agDateColumnFilter'
        },
        {
            field: 'outcome',
            headerName: dictionary.outcomeColumn,
            sortable: false,
            flex: 2, // Takes up more space for course names
            minWidth: 200,
            valueFormatter: (params: any) => {
                // Return empty string since we use cellRenderer for display
                return '';
            },
            cellRenderer: (params: any) => <OutcomeCellRenderer {...params} locale={props.locale} />
        },
        {
            field: 'status',
            headerName: dictionary.statusColumn,
            sortable: true,
            flex: 1,
            minWidth: 100,
            cellRenderer: (params: any) => <StatusCellRenderer {...params} onRevoke={props.onRevokeCoupon} locale={props.locale} />,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
        }
    ], [dictionary, props.locale]);

    // For filter modal
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [appliedFilters, setAppliedFilters] = useState<Partial<CouponFilterModel>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Client-side filtering logic
    const doesExternalFilterPass = useCallback((node: IRowNode<CouponRow>) => {
        if (!node.data) {
            return false;
        }
        const coupon = node.data;

        // Apply search term filter (fuzzy search)
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = coupon.name?.toLowerCase().includes(searchLower);

            if (!nameMatch) {
                return false;
            }
        }

        // Apply modal filters
        // Status filter
        if (appliedFilters.status?.length && !appliedFilters.status.includes(coupon.status)) {
            return false;
        }
        
        // Usages left range (using usageCount and usagesAllowed)
        const usagesLeft = coupon.usagesAllowed ? coupon.usagesAllowed - coupon.usageCount : Infinity;
        if (appliedFilters.minUsagesLeft !== undefined && usagesLeft < appliedFilters.minUsagesLeft) {
            return false;
        }
        if (appliedFilters.maxUsagesLeft !== undefined && usagesLeft > appliedFilters.maxUsagesLeft) {
            return false;
        }
        
        // Creation date range
        if (appliedFilters.createdAfter && coupon.createdAt < appliedFilters.createdAfter) {
            return false;
        }
        if (appliedFilters.createdBefore && coupon.createdAt > appliedFilters.createdBefore) {
            return false;
        }
        
        // Expiration date range
        if (appliedFilters.expiresAfter && coupon.expirationDate && coupon.expirationDate < appliedFilters.expiresAfter) {
            return false;
        }
        if (appliedFilters.expiresBefore && coupon.expirationDate && coupon.expirationDate > appliedFilters.expiresBefore) {
            return false;
        }
        
        // Outcome type filter
        if (appliedFilters.outcomeTypes?.length && !appliedFilters.outcomeTypes.includes(coupon.outcome.type)) {
            return false;
        }

        // If custom external filter is provided, apply it last
        if (props.doesExternalFilterPass) {
            return props.doesExternalFilterPass(node);
        }

        return true;
    }, [searchTerm, appliedFilters, props.doesExternalFilterPass]);

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
    }, [refreshGrid, searchTerm, appliedFilters]);

    const handleClearAllFilters = useCallback(() => {
        setSearchTerm(''); // Clear search input
        setAppliedFilters({}); // Clear applied filters
        
        // Reset grid filters
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setFilterModel(null);
            props.gridRef.current.api.onFilterChanged();
        }
    }, [props.gridRef]);

    const outcomeToString = useCallback((outcome: CouponRow['outcome']): string => {
        switch (outcome.type) {
            case 'groupCourse': {
                const title = outcome.course?.title ?? '';
                const group = outcome.groupName ?? '';
                return `${dictionary.freeCourses}${title ? `: ${title}` : ''}${group ? ` — ${group}` : ''}`;
            }
            case 'freeCoachingSession': {
                const offering = outcome.coachingOffering?.title ?? '';
                const maybeCourse = outcome.course?.title ? ` — ${outcome.course.title}` : '';
                return `${dictionary.coachingLabel}${offering ? `: ${offering}` : ''}${maybeCourse}`;
            }
            case 'discountOnEverything': {
                return `${dictionary.discountPercent}: ${outcome.percentage}%`;
            }
            case 'freeCourses': {
                const titles = (outcome.courses ?? []).map(c => c.title).join(', ');
                return `${dictionary.freeCourses}${titles ? `: ${titles}` : ''}`;
            }
            case 'freeBundles': {
                const titles = (outcome.packages ?? []).map(p => p.title).join(', ');
                return `${dictionary.freeCourses}${titles ? `: ${titles}` : ''}`;
            }
            default:
                return '';
        }
    }, [dictionary]);

    // Export current view to CSV
    const handleExportCurrentView = useCallback(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.exportDataAsCsv({
                fileName: `coupon_grid_export_${new Date().toISOString()}.csv`,
                onlySelected: false,
                skipPinnedTop: true,
                skipPinnedBottom: true,
                processCellCallback: (params: ProcessCellForExportParams) => {
                    const colId = params.column.getColId();
                    const data = params.node?.data as CouponRow | undefined;
                    if (!data) return params.value;

                    if (colId === 'outcome') {
                        return outcomeToString(data.outcome);
                    }
                    if (colId === 'usageCount') {
                        const usageCount = data.usageCount ?? 0;
                        const usagesAllowed = data.usagesAllowed;
                        return usagesAllowed === null || usagesAllowed === undefined
                            ? `${usageCount}/∞`
                            : `${usageCount}/${usagesAllowed}`;
                    }
                    if (colId === 'createdAt') {
                        const date = new Date(data.createdAt);
                        return formatDate(date);
                    }
                    if (colId === 'expirationDate') {
                        if (!data.expirationDate) return '-';
                        const date = new Date(data.expirationDate);
                        return formatDate(date);
                    }
                    return params.value;
                },
            });
        }
    }, [props.gridRef, outcomeToString]);

    // Initialize the grid with external filters enabled
    useEffect(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            refreshGrid();
        }
    }, [props.gridRef, doesExternalFilterPass, refreshGrid]);

    return (
        <div className="flex flex-col h-full w-full">
            {/* Search bar, Filter button, Export button, and Create button */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between mb-4">
                <InputField
                    className="flex-grow relative m-0 md:mr-2 h-10"
                    setValue={setSearchTerm}
                    value={searchTerm}
                    inputText={dictionary.searchPlaceholder}
                    hasLeftContent
                    leftContent={<IconSearch />}
                />
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1.5">
                    <Button
                        variant="text"
                        size="medium"
                        text={dictionary.exportCurrentView}
                        onClick={handleExportCurrentView}
                        hasIconLeft
                        iconLeft={<IconCloudDownload />}
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
                    <Button
                        variant="primary"
                        size="medium"
                        text={dictionary.createCouponButton}
                        onClick={props.onCreateCoupon}
                        hasIconLeft
                        iconLeft={<IconPlus />}
                        className="w-full md:w-auto"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="flex flex-col grow">
                <BaseGrid
                    gridRef={props.gridRef}
                    locale={props.locale}
                    columnDefs={columnDefs}
                    rowData={props.coupons}
                    enableCellTextSelection={true}
                    onSortChanged={props.onSortChanged}
                    pagination={true}
                    suppressPaginationPanel={true}
                    paginationAutoPageSize={true}
                    isExternalFilterPresent={() => true}
                    doesExternalFilterPass={doesExternalFilterPass}
                />
            </div>

            {showFilterModal && (
                <CouponGridFilterModal
                    onApplyFilters={(newFilters) => {
                        setAppliedFilters(newFilters);
                    }}
                    onClose={() => setShowFilterModal(false)}
                    initialFilters={appliedFilters}
                    locale={props.locale}
                />
            )}
        </div>
    );
};
