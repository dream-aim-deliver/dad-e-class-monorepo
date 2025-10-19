'use client';

import React, { useRef, useState, useMemo, useCallback, useEffect, RefObject } from 'react';
import { AllCommunityModule, IRowNode, ModuleRegistry, SortChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '../button';
import { InputField } from '../input-field';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { getDictionary } from '@maany_shr/e-class-translations';
import { CouponGridFilterModal, CouponFilterModel } from './coupon-grid-filter-modal';
import { IconFilter } from '../icons/icon-filter';
import { IconPlus } from '../icons/icon-plus';
import { IconSearch } from '../icons/icon-search';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface CouponRow {
    id: number;
    couponId: number;
    name: string;
    usagesLeft: number;
    maxUsages: number;
    creationDate: number;
    expirationDate: number;
    outcome: {
        type: 'free_courses' | 'discount' | 'coaching';
        courses: string[];
    };
    status: 'active' | 'revoked';
}

export interface CouponGridProps extends isLocalAware {
    gridRef: RefObject<AgGridReact | null>;
    coupons: CouponRow[];
    locale: TLocale;
    onRevokeCoupon: (couponId: number) => void;
    onCreateCoupon: () => void;
    onSortChanged?: (event: SortChangedEvent) => void;
    doesExternalFilterPass?: (node: IRowNode<CouponRow>) => boolean;
}

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
            field: 'usagesLeft',
            headerName: dictionary.usagesLeftColumn,
            sortable: true,
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any) => {
                const usagesLeft = params.data?.usagesLeft || 0;
                const maxUsages = params.data?.maxUsages || 0;
                return `${usagesLeft}/${maxUsages}`;
            },
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'creationDate',
            headerName: dictionary.creationDateColumn,
            sortable: true,
            flex: 1,
            minWidth: 130,
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
            cellRenderer: OutcomeCellRenderer
        },
        {
            field: 'status',
            headerName: dictionary.statusColumn,
            sortable: true,
            flex: 1,
            minWidth: 100,
            cellRenderer: StatusCellRenderer,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
        }
    ], [dictionary]);

    // For filter modal
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [appliedFilters, setAppliedFilters] = useState<Partial<CouponFilterModel>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Set up event listener for revoke button clicks
    useEffect(() => {
        const handleRevokeCoupon = (event: CustomEvent) => {
            props.onRevokeCoupon(event.detail);
        };

        window.addEventListener('revokeCoupon', handleRevokeCoupon as EventListener);
        return () => {
            window.removeEventListener('revokeCoupon', handleRevokeCoupon as EventListener);
        };
    }, [props.onRevokeCoupon]);

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


            {/* Empty State */}
            {props.coupons.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-text-secondary py-8">
                        {dictionary.emptyState}
                    </div>
                </div>
            )}
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
