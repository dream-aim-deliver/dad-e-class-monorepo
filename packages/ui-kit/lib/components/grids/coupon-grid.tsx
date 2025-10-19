import React, { useRef, useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, IRowNode, SortChangedEvent } from 'ag-grid-community';
import { Button } from '../button';
import { InputField } from '../input-field';
import { TLocale } from '@maany_shr/e-class-translations';
import { getDictionary } from '@maany_shr/e-class-translations';
import { CouponGridFilterModal, CouponFilterModel } from './coupon-grid-filter-modal';
import { IconFilter } from '../icons/icon-filter';
import { IconPlus } from '../icons/icon-plus';

/**
 * Represents a coupon row in the grid with all necessary coupon data.
 */
export interface CouponRow {
    /** Unique identifier for the coupon */
    id: number;
    /** Coupon ID used for business logic */
    couponId: number;
    /** Display name of the coupon */
    name: string;
    /** Number of usages remaining */
    usagesLeft: number;
    /** Maximum number of usages allowed */
    maxUsages: number;
    /** Creation timestamp in milliseconds */
    creationDate: number;
    /** Expiration timestamp in milliseconds */
    expirationDate: number;
    /** Coupon outcome details */
    outcome: {
        /** Type of coupon outcome */
        type: 'free_courses' | 'discount' | 'coaching';
        /** List of course names associated with this coupon */
        courses: string[];
    };
    /** Current status of the coupon */
    status: 'active' | 'revoked';
}

/**
 * Props interface for the CouponGrid component.
 */
export interface CouponGridProps {
    /** A React ref object to access the AG Grid instance for programmatic control */
    gridRef: React.RefObject<AgGridReact>;
    /** An array of CouponRow objects representing the coupons to display in the grid */
    coupons: CouponRow[];
    /** The locale used for translations and localization */
    locale: TLocale;
    /** Callback function triggered when the "Revoke" button is clicked for a coupon. Receives the coupon ID */
    onRevokeCoupon: (couponId: number) => void;
    /** Callback function triggered when the "Create Coupon" button is clicked */
    onCreateCoupon: () => void;
    /** Optional callback function triggered when the grid's sort order changes. Receives the SortChangedEvent from AG Grid */
    onSortChanged?: (event: SortChangedEvent) => void;
    /** Optional function to define custom external filtering logic. Receives an IRowNode<CouponRow> and returns a boolean */
    doesExternalFilterPass?: (node: IRowNode<CouponRow>) => boolean;
}

// Cell Renderers
/**
 * Renders the usages left cell showing current usages vs maximum usages.
 */
const UsagesCellRenderer = (params: { value: { usagesLeft: number; maxUsages: number } }) => {
    const { usagesLeft, maxUsages } = params.value;
    return (
        <span className="text-text-primary">
            {usagesLeft}/{maxUsages}
        </span>
    );
};

/**
 * Renders the outcome cell showing the coupon type and associated courses.
 */
const OutcomeCellRenderer = (params: { value: CouponRow['outcome'] }) => {
    const { type, courses } = params.value;
    const dictionary = getDictionary('en').components.couponGrid; // TODO: Pass locale properly
    
    return (
        <div className="flex flex-col">
            <span className="text-text-primary text-sm">
                {type === 'free_courses' ? dictionary.freeCourses : dictionary.discountPercent}
            </span>
            <span className="text-text-secondary text-xs">
                {courses.join(', ')}
            </span>
        </div>
    );
};

/**
 * Renders the status cell showing either a "Revoked" badge or a "Revoke" button.
 */
const StatusCellRenderer = (params: { value: CouponRow['status']; data: CouponRow }) => {
    const { value: status, data } = params;
    const dictionary = getDictionary('en').components.couponGrid; // TODO: Pass locale properly
    
    if (status === 'revoked') {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {dictionary.revokedBadge}
            </span>
        );
    }
    
    return (
        <button
            onClick={() => {
                // This will be handled by the parent component
                const event = new CustomEvent('revokeCoupon', { detail: data.couponId });
                window.dispatchEvent(event);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
            {dictionary.revokeButton}
        </button>
    );
};

/**
 * Renders the date cell formatting timestamps as localized date strings.
 */
const DateCellRenderer = (params: { value: number }) => {
    const date = new Date(params.value);
    return (
        <span className="text-text-primary text-sm">
            {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            })}
        </span>
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
export const CouponGrid: React.FC<CouponGridProps> = ({
    gridRef,
    coupons,
    locale,
    onRevokeCoupon,
    onCreateCoupon,
    onSortChanged,
    doesExternalFilterPass
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const dictionary = getDictionary(locale).components.couponGrid;

    // Set up event listener for revoke button clicks
    React.useEffect(() => {
        const handleRevokeCoupon = (event: CustomEvent) => {
            onRevokeCoupon(event.detail);
        };

        window.addEventListener('revokeCoupon', handleRevokeCoupon as EventListener);
        return () => {
            window.removeEventListener('revokeCoupon', handleRevokeCoupon as EventListener);
        };
    }, [onRevokeCoupon]);

    const columnDefs = useMemo((): ColDef<CouponRow>[] => [
        {
            field: 'name',
            headerName: dictionary.nameColumn,
            sortable: true,
            filter: 'agTextColumnFilter',
            width: 200,
            cellRenderer: (params) => (
                <span className="text-text-primary font-medium">
                    {params.value}
                </span>
            )
        },
        {
            field: 'usagesLeft',
            headerName: dictionary.usagesLeftColumn,
            sortable: true,
            width: 150,
            cellRenderer: UsagesCellRenderer,
            valueGetter: (params) => ({
                usagesLeft: params.data?.usagesLeft || 0,
                maxUsages: params.data?.maxUsages || 0
            })
        },
        {
            field: 'creationDate',
            headerName: dictionary.creationDateColumn,
            sortable: true,
            width: 150,
            cellRenderer: DateCellRenderer
        },
        {
            field: 'expirationDate',
            headerName: dictionary.expirationDateColumn,
            sortable: true,
            width: 150,
            cellRenderer: DateCellRenderer
        },
        {
            field: 'outcome',
            headerName: dictionary.outcomeColumn,
            sortable: false,
            width: 250,
            cellRenderer: OutcomeCellRenderer
        },
        {
            field: 'status',
            headerName: dictionary.statusColumn,
            sortable: true,
            width: 120,
            cellRenderer: StatusCellRenderer,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
        }
    ], [dictionary]);

    const defaultColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true,
    }), []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        if (gridRef.current?.api) {
            gridRef.current.api.setGridOption('quickFilterText', value);
        }
    }, [gridRef]);

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<Partial<CouponFilterModel>>({});

    // Client-side filtering logic
    const internalDoesExternalFilterPass = useCallback((node: IRowNode<CouponRow>) => {
        if (!node.data) return false;
        
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
        
        // Usages left range
        if (appliedFilters.minUsagesLeft !== undefined && coupon.usagesLeft < appliedFilters.minUsagesLeft) {
            return false;
        }
        if (appliedFilters.maxUsagesLeft !== undefined && coupon.usagesLeft > appliedFilters.maxUsagesLeft) {
            return false;
        }
        
        // Creation date range
        if (appliedFilters.createdAfter && coupon.creationDate < new Date(appliedFilters.createdAfter).getTime()) {
            return false;
        }
        if (appliedFilters.createdBefore && coupon.creationDate > new Date(appliedFilters.createdBefore).getTime()) {
            return false;
        }
        
        // Expiration date range
        if (appliedFilters.expiresAfter && coupon.expirationDate < new Date(appliedFilters.expiresAfter).getTime()) {
            return false;
        }
        if (appliedFilters.expiresBefore && coupon.expirationDate > new Date(appliedFilters.expiresBefore).getTime()) {
            return false;
        }
        
        // Outcome type filter
        if (appliedFilters.outcomeTypes?.length && !appliedFilters.outcomeTypes.includes(coupon.outcome.type)) {
            return false;
        }
        
        // If custom external filter is provided, apply it last
        if (doesExternalFilterPass) {
            return doesExternalFilterPass(node);
        }
        
        return true;
    }, [searchTerm, appliedFilters, doesExternalFilterPass]);

    // Force refresh the grid when the external filter changes
    const refreshGrid = useCallback(() => {
        if (gridRef.current?.api) {
            gridRef.current.api.setGridOption('doesExternalFilterPass', internalDoesExternalFilterPass);
            gridRef.current.api.onFilterChanged();
        }
    }, [gridRef, internalDoesExternalFilterPass]);

    // Apply filter when search or filters change
    React.useEffect(() => {
        refreshGrid();
    }, [refreshGrid, searchTerm, appliedFilters]);

    const handleFilterClick = useCallback(() => {
        setShowFilterModal(true);
    }, []);

    const handleLoadMore = useCallback(() => {
        // TODO: Implement pagination
        console.log('Load more coupons');
    }, []);

    const handleClearAllFilters = useCallback(() => {
        setSearchTerm(''); // Clear search input
        setAppliedFilters({}); // Clear applied filters
        
        // Reset grid filters
        if (gridRef.current?.api) {
            gridRef.current.api.setFilterModel(null);
            gridRef.current.api.onFilterChanged();
        }
    }, [gridRef]);

    // Initialize the grid with external filters enabled
    React.useEffect(() => {
        if (gridRef.current?.api) {
            gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
            gridRef.current.api.setGridOption('doesExternalFilterPass', internalDoesExternalFilterPass);
            refreshGrid();
        }
    }, [gridRef, internalDoesExternalFilterPass, refreshGrid]);

    return (
        <div className="flex flex-col h-full w-full">
            {/* Search and Action Bar */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1 mr-4">
                    <InputField
                        inputText={dictionary.searchPlaceholder}
                        value={searchTerm}
                        setValue={handleSearchChange}
                        state={searchTerm ? 'filling' : 'placeholder'}
                        type="text"
                        className="w-full"
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.filterButton}
                        onClick={handleFilterClick}
                        hasIconLeft
                        iconLeft={<IconFilter />}
                    />
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.clearFilters}
                        onClick={handleClearAllFilters}
                    />
                    <Button
                        variant="primary"
                        size="medium"
                        text={dictionary.createCouponButton}
                        onClick={onCreateCoupon}
                        hasIconLeft
                        iconLeft={<IconPlus />}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 min-h-0">
                <AgGridReact
                    ref={gridRef}
                    rowData={coupons}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onSortChanged={onSortChanged}
                    isExternalFilterPresent={() => true}
                    doesExternalFilterPass={internalDoesExternalFilterPass}
                    suppressRowClickSelection
                    rowHeight={60}
                    headerHeight={40}
                    className="ag-theme-alpine-dark w-full h-full"
                />
            </div>

            {/* Load More */}
            {coupons.length > 0 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleLoadMore}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        {dictionary.loadMore}
                    </button>
                </div>
            )}

            {/* Empty State */}
            {coupons.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-text-secondary py-8">
                        {dictionary.emptyState}
                    </div>
                </div>
            )}
            {showFilterModal && (
                <CouponGridFilterModal
                    onApplyFilters={(filters) => {
                        setAppliedFilters(filters);
                        setShowFilterModal(false);
                        if (gridRef.current?.api) {
                            gridRef.current.api.onFilterChanged();
                        }
                    }}
                    onClose={() => setShowFilterModal(false)}
                    initialFilters={appliedFilters}
                    locale={locale}
                />
            )}
        </div>
    );
};
