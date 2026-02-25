'use client';

import React, { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { AllCommunityModule, IRowNode, ModuleRegistry, ProcessCellForExportParams, SortChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '../button';
import { InputField } from '../input-field';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { IconFilter } from '../icons/icon-filter';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconSearch } from '../icons/icon-search';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconFile } from '../icons/icon-file';
import { TransactionsGridFilterModal, TransactionFilterModel } from './transactions-grid-filter-modal';

ModuleRegistry.registerModules([AllCommunityModule]);

type CoachPaymentContent = {
    type: 'coachPayment';
    direction: 'outgoing';
    items: { description: string; unitPrice: number; quantity: number }[];
};

type CourseContent = {
    type: 'course';
    direction: 'incoming';
    unitPrice: number;
    course: { imageUrl: string | null; title: string; id: string; slug: string; coachingSessionCount: number | null };
};

type CoachingOffersContent = {
    type: 'coachingOffers';
    direction: 'incoming';
    items: { title: string; duration: string; unitPrice: number; quantity: number }[];
    course: { name: string; imageUrl: string | null; id: number; slug: string } | null;
};

type PackageContent = {
    type: 'package';
    direction: 'incoming';
    unitPrice: number;
    package: { description: string; imageUrl: string | null; title: string; id: number; courseCount: number };
    coursesIncluded: { imageUrl: string | null; title: string; id: number; slug: string }[];
    coachingSessionCount: number | null;
};

export type TransactionContent = CoachPaymentContent | CourseContent | CoachingOffersContent | PackageContent;

export interface TransactionRow {
    id: string | number;
    status: string;
    state: 'created';
    currency: string;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
    settledAt: string | null; // ISO date
    invoiceUrl?: string | null;
    user: { name: string; surname: string; id: number; username: string; avatarUrl?: string | null };
    content: TransactionContent;
    tags?: { id: string | number; name: string }[];
}

export interface TransactionsGridProps extends isLocalAware {
    gridRef: RefObject<AgGridReact | null>;
    transactions: TransactionRow[];
    locale: TLocale;
    onDeleteTransaction: (transactionId: string | number) => void;
    onOpenInvoice: (transactionId: string | number, invoiceUrl?: string | null) => void;
    onCreateTransaction?: () => void;
    onSortChanged?: (event: SortChangedEvent) => void;
    doesExternalFilterPass?: (node: IRowNode<TransactionRow>) => boolean;
    availableTagsForFilter?: { id: string | number; name: string }[];
}

const DetailsCellRenderer = (params: { value: TransactionContent; data: TransactionRow; locale: TLocale }) => {
    const content = params.value;
    const dictionary = getDictionary(params.locale).components.transactionsGrid;

    switch (content.type) {
        case 'coachPayment': {
            const totalItems = content.items.length;
            const currency = params.data?.currency || '';
            const itemsBreakdown = content.items.map(item =>
                `${item.description} - ${item.quantity}x ${(item.unitPrice ?? 0).toFixed(2)} ${currency}`
            ).join('\n');
            return (
                <div className="flex flex-col" title={itemsBreakdown}>
                    <span className="text-text-primary text-sm">{dictionary.coachingLabel}</span>
                    <span className="text-text-secondary text-xs">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                </div>
            );
        }
        case 'course': {
            return (
                <div className="flex flex-col">
                    <span className="text-text-primary text-sm">{content.course.title}</span>
                    <span className="text-text-secondary text-xs">/{content.course.slug}</span>
                </div>
            );
        }
        case 'coachingOffers': {
            const titles = content.items.map(i => i.title).join(', ');
            return (
                <div className="flex flex-col">
                    <span className="text-text-primary text-sm">{content.course?.name ?? 'Coaching offers'}</span>
                    <span className="text-text-secondary text-xs">{titles}</span>
                </div>
            );
        }
        case 'package': {
            const titles = content.coursesIncluded.map(c => c.title).join(', ');
            return (
                <div className="flex flex-col">
                    <span className="text-text-primary text-sm">{content.package.title}</span>
                    <span className="text-text-secondary text-xs">{titles}</span>
                </div>
            );
        }
        default:
            return null;
    }
};

const ActionsCellRenderer = (params: { data: TransactionRow; onDelete: (id: string | number) => void; onInvoice: (id: string | number, url?: string | null) => void; locale: TLocale }) => {
    const { data } = params;
    const dictionary = getDictionary(params.locale).components.transactionsGrid;

    return (
        <div className="flex items-center gap-2 justify-center">
            <button
                onClick={() => params.onInvoice(data.id, data.invoiceUrl)}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                <span className="mr-1 inline-flex"><IconFile width={16} height={16} /></span>
                {dictionary.invoiceButton}
            </button>
            <button
                onClick={() => params.onDelete(data.id)}
                className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
            >
                <span className="mr-1 inline-flex"><IconTrashAlt width={16} height={16} /></span>
                {dictionary.deleteButton}
            </button>
        </div>
    );
};

const calculateAmount = (content: TransactionContent): number => {
    switch (content.type) {
        case 'course':
            return content.unitPrice;
        case 'package':
            return content.unitPrice;
        case 'coachPayment':
            return content.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        case 'coachingOffers':
            return content.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        default:
            return 0;
    }
};

/**
 * A reusable TransactionsGrid component for displaying a list of platform transactions
 * with sorting, search, CSV export, external filtering, and action buttons.
 *
 * @param gridRef A React ref object to access the AG Grid instance for programmatic control.
 * @param transactions An array of TransactionRow objects representing the transactions to display.
 * @param locale The locale used for translations and localization.
 * @param onDeleteTransaction Callback when the "Delete" action is clicked for a transaction. Receives the transaction ID.
 * @param onOpenInvoice Callback when the "Invoice" action is clicked. Receives the transaction ID and the optional invoice URL.
 * @param onSortChanged Optional callback when the grid's sort order changes.
 * @param doesExternalFilterPass Optional function to define custom external filtering logic. Receives an IRowNode<TransactionRow> and returns a boolean.
 *
 * @example
 * ```tsx
 * const gridRef = useRef<AgGridReact>(null);
 * const transactions: TransactionRow[] = [
 *   {
 *     id: 'tx-1',
 *     status: 'paid',
 *     state: 'created',
 *     currency: 'EUR',
 *     createdAt: new Date().toISOString(),
 *     updatedAt: new Date().toISOString(),
 *     settledAt: new Date().toISOString(),
 *     invoiceUrl: 'https://example.com/invoice/tx-1',
 *     user: { id: 1, username: 'john', name: 'John', surname: 'Doe' },
 *     content: { type: 'course', direction: 'incoming', unitPrice: 199, course: { id: 'c-1', slug: 'course-1', title: 'Course One', imageUrl: null, coachingSessionCount: 2 } }
 *   },
 * ];
 *
 * <TransactionsGrid
 *   gridRef={gridRef}
 *   transactions={transactions}
 *   locale="en"
 *   onDeleteTransaction={(id) => console.log('Delete:', id)}
 *   onOpenInvoice={(id, url) => console.log('Invoice:', id, url)}
 *   onSortChanged={(event) => console.log('Sort changed:', event)}
 *   doesExternalFilterPass={(node) => node.data?.status === 'paid'}
 * />
 * ```
 */
export const TransactionsGrid = (props: TransactionsGridProps) => {
    const dictionary = getDictionary(props.locale).components.transactionsGrid;

    const columnDefs = useMemo(() => [
        {
            field: 'user',
            headerName: dictionary.userColumn,
            sortable: true,
            flex: 2,
            minWidth: 180,
            valueGetter: (params: any) => {
                const u = params.data?.user;
                return u ? `${u.name} ${u.surname} (@${u.username})` : '';
            },
        },
        {
            field: 'content.type',
            headerName: dictionary.typeColumn,
            sortable: true,
            flex: 1,
            minWidth: 120,
            valueGetter: (p: any) => p.data?.content?.type,
        },
        {
            field: 'content.direction',
            headerName: dictionary.directionColumn,
            sortable: true,
            flex: 1,
            minWidth: 120,
            valueGetter: (p: any) => p.data?.content?.direction,
        },
        {
            field: 'status',
            headerName: dictionary.statusColumn,
            sortable: true,
            flex: 1,
            minWidth: 120,
        },
        {
            field: 'state',
            headerName: dictionary.stateColumn,
            sortable: true,
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'currency',
            headerName: dictionary.currencyColumn,
            sortable: true,
            flex: 1,
            minWidth: 110,
        },
        {
            field: 'amount',
            headerName: dictionary.amountColumn,
            sortable: true,
            flex: 1,
            minWidth: 120,
            valueGetter: (p: any) => calculateAmount(p.data?.content),
        },
        {
            field: 'createdAt',
            headerName: dictionary.creationDateColumn,
            sortable: true,
            flex: 1,
            minWidth: 140,
            valueFormatter: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
            filter: 'agDateColumnFilter'
        },
        {
            field: 'settledAt',
            headerName: dictionary.settledDateColumn,
            sortable: true,
            flex: 1,
            minWidth: 140,
            valueFormatter: (params: any) => {
                if (!params.value) return '-';
                const date = new Date(params.value);
                return formatDate(date);
            },
            filter: 'agDateColumnFilter'
        },
        {
            field: 'updatedAt',
            headerName: dictionary.updatedDateColumn,
            sortable: true,
            flex: 1,
            minWidth: 140,
            valueFormatter: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
            filter: 'agDateColumnFilter'
        },
        {
            field: 'content',
            headerName: dictionary.detailsColumn,
            sortable: false,
            flex: 2,
            minWidth: 220,
            cellRenderer: (params: any) => <DetailsCellRenderer {...params} locale={props.locale} />
        },
        {
            field: 'tags',
            headerName: dictionary.tagsColumn,
            sortable: false,
            flex: 1,
            minWidth: 150,
            valueGetter: (params: any) => {
                const tags = params.data?.tags || [];
                return tags.map((t: any) => t.name).join(', ');
            },
            cellRenderer: (params: any) => {
                const tags = params.data?.tags || [];
                if (tags.length === 0) return <span className="text-text-secondary text-sm">-</span>;
                const tagNames = tags.map((t: any) => t.name).join(', ');
                return (
                    <div className="flex items-center h-full">
                        <span
                            className="text-text-primary text-sm truncate"
                            title={tagNames}
                        >
                            {tagNames}
                        </span>
                    </div>
                );
            }
        },
        {
            field: 'actions',
            headerName: dictionary.actionsColumn,
            sortable: false,
            flex: 1,
            minWidth: 220,
            cellRenderer: (params: any) => (
                <ActionsCellRenderer
                    {...params}
                    onDelete={props.onDeleteTransaction}
                    onInvoice={props.onOpenInvoice}
                    locale={props.locale}
                />
            ),
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
        }
    ], [dictionary, props.locale, props.onDeleteTransaction, props.onOpenInvoice]);

    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [appliedFilters, setAppliedFilters] = useState<Partial<TransactionFilterModel>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    const doesExternalFilterPass = useCallback((node: IRowNode<TransactionRow>) => {
        if (!node.data) return false;
        const tx = node.data;

        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            const userMatch = `${tx.user.name} ${tx.user.surname} ${tx.user.username}`.toLowerCase().includes(s);
            const contentTitle = (() => {
                switch (tx.content.type) {
                    case 'course':
                        return tx.content.course.title;
                    case 'package':
                        return tx.content.package.title;
                    case 'coachingOffers':
                        return tx.content.items.map(i => i.title).join(' ');
                    case 'coachPayment':
                        return tx.content.items.map(i => i.description).join(' ');
                    default:
                        return '';
                }
            })().toLowerCase();
            if (!userMatch && !contentTitle.includes(s)) return false;
        }

        // Modal filters
        if (appliedFilters.status?.length && !appliedFilters.status.includes(tx.status)) return false;
        if (appliedFilters.state?.length && !appliedFilters.state.includes(tx.state)) return false;
        if (appliedFilters.types?.length && !appliedFilters.types.includes(tx.content.type)) return false;
        if (appliedFilters.direction && tx.content.direction !== appliedFilters.direction) return false;
        if (appliedFilters.currencies?.length && !appliedFilters.currencies.includes(tx.currency)) return false;

        const amount = calculateAmount(tx.content);
        if (appliedFilters.minAmount !== undefined && amount < appliedFilters.minAmount) return false;
        if (appliedFilters.maxAmount !== undefined && amount > appliedFilters.maxAmount) return false;

        if (appliedFilters.createdAfter && tx.createdAt < appliedFilters.createdAfter) return false;
        if (appliedFilters.createdBefore && tx.createdAt > appliedFilters.createdBefore) return false;
        if (appliedFilters.settledAfter && tx.settledAt && tx.settledAt < appliedFilters.settledAfter) return false;
        if (appliedFilters.settledBefore && tx.settledAt && tx.settledAt > appliedFilters.settledBefore) return false;

        if (appliedFilters.tagIds?.length) {
            const txTagIds = (tx.tags || []).map(t => String(t.id));
            const hasMatchingTag = appliedFilters.tagIds.some(tagId => txTagIds.includes(String(tagId)));
            if (!hasMatchingTag) return false;
        }

        if (props.doesExternalFilterPass) {
            return props.doesExternalFilterPass(node);
        }

        return true;
    }, [searchTerm, appliedFilters, props.doesExternalFilterPass]);

    const refreshGrid = useCallback(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            props.gridRef.current.api.onFilterChanged();
        }
    }, [props.gridRef, doesExternalFilterPass]);

    useEffect(() => {
        refreshGrid();
    }, [refreshGrid, searchTerm, appliedFilters]);

    const handleClearAllFilters = useCallback(() => {
        setSearchTerm('');
        setAppliedFilters({});
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setFilterModel(null);
            props.gridRef.current.api.onFilterChanged();
        }
    }, [props.gridRef]);

    const detailsToString = useCallback((content: TransactionContent): string => {
        switch (content.type) {
            case 'coachPayment':
                return `Coach payment: ${content.items.length} items`;
            case 'course':
                return `Course: ${content.course.title}`;
            case 'coachingOffers':
                return `Coaching offers: ${content.items.map(i => i.title).join(', ')}`;
            case 'package':
                return `Package: ${content.package.title}`;
            default:
                return '';
        }
    }, []);

    const handleExportCurrentView = useCallback(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.exportDataAsCsv({
                fileName: `transactions_export_${new Date().toISOString()}.csv`,
                onlySelected: false,
                skipPinnedTop: true,
                skipPinnedBottom: true,
                processCellCallback: (params: ProcessCellForExportParams) => {
                    const colId = params.column.getColId();
                    const data = params.node?.data as TransactionRow | undefined;
                    if (!data) return params.value;

                    if (colId === 'content') return detailsToString(data.content);
                    if (colId === 'amount') return calculateAmount(data.content);
                    if (colId === 'tags') {
                        const tags = data.tags || [];
                        return tags.map((t: any) => t.name).join(', ') || '-';
                    }
                    if (colId === 'createdAt' || colId === 'updatedAt' || colId === 'settledAt') {
                        if (!params.value) return '-';
                        const date = new Date(params.value);
                        return formatDate(date);
                    }
                    if (colId === 'user') {
                        const u = data.user;
                        return `${u.name} ${u.surname} (@${u.username})`;
                    }
                    return params.value;
                },
            });
        }
    }, [props.gridRef, detailsToString]);

    useEffect(() => {
        if (props.gridRef.current?.api) {
            props.gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
            props.gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
        }
    }, [props.gridRef, doesExternalFilterPass]);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col space-y-2 mb-4">
                <div className="flex flex-col md:flex-row gap-2">
                    <InputField
                        className="flex-1 relative m-0 h-10"
                        setValue={setSearchTerm}
                        value={searchTerm}
                        inputText={dictionary.searchPlaceholder}
                        hasLeftContent
                        leftContent={<IconSearch />}
                    />
                    <Button
                        variant="primary"
                        size="medium"
                        text={`+ ${dictionary.createTransactionButton}`}
                        onClick={props.onCreateTransaction}
                        className="w-full md:w-auto whitespace-nowrap"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="text"
                        size="medium"
                        text={dictionary.exportCurrentView}
                        onClick={handleExportCurrentView}
                        hasIconLeft
                        iconLeft={<IconCloudDownload />}
                        className="w-full sm:flex-1"
                    />
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.filterButton}
                        onClick={() => setShowFilterModal(true)}
                        hasIconLeft
                        iconLeft={<IconFilter />}
                        className="w-full sm:flex-1"
                    />
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.clearFilters}
                        onClick={handleClearAllFilters}
                        className="w-full sm:flex-1"
                    />
                </div>
            </div>

            <div className="flex flex-col grow">
                <BaseGrid
                    gridRef={props.gridRef}
                    locale={props.locale}
                    columnDefs={columnDefs}
                    rowData={props.transactions}
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
                <TransactionsGridFilterModal
                    onApplyFilters={(newFilters) => {
                        setAppliedFilters(newFilters);
                    }}
                    onClose={() => setShowFilterModal(false)}
                    initialFilters={appliedFilters}
                    locale={props.locale}
                    availableTags={props.availableTagsForFilter}
                />
            )}
        </div>
    );
};


