'use client';
import { AllCommunityModule, IRowNode, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefObject, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { MailOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { Button } from '../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconSearch } from '../icons/icon-search';
import { InputField } from '../input-field';
import { Dropdown } from '../dropdown';
import { IconSent } from '../icons';

export type SentNotification = {
    message: string;
    createdAt: string;
    updatedAt: string;
    actionTitle: string;
    actionUrl: string;
    sendEmail: boolean;
    receivers: {
        id: number;
        username: string;
        isNotificationRead: boolean;
        notificationId: number;
        name?: string | null;
        surname?: string | null;
    }[];
};

export type ReceivedNotification = {
    message: string;
    isRead: boolean;
    id: string | number;
    state: "created";
    createdAt: Date;
    updatedAt: Date;
    actionTitle: string;
    actionUrl: string;
    sendEmail: boolean;
};

export interface NotificationRow {
    id?: string;
    message: string;
    action?: { title: string; url?: string };
    timestamp?: string;
    isRead?: boolean;
    platform?: string;
    type: 'received' | 'sent';
    recipients?: { name: string }[];
}

export interface CMSNotificationGridProps extends isLocalAware {
    receivedNotifications: ReceivedNotification[];
    sentNotifications: SentNotification[];
    onMarkAllRead: () => void;
    onMarkSelectedAsRead: (ids: string[]) => void;
    onRowClicked?: (notification: NotificationRow) => void;
    gridRef: RefObject<AgGridReact>;
    loading: boolean;
}

ModuleRegistry.registerModules([AllCommunityModule]);

const NotificationMessageRenderer = (props: {
    value: string;
    data?: { id?: string | number };
    expandedMessagesRef?: { current: Set<string | number> };
}) => {
    const notificationId = props.data?.id;
    const expandedRef = props.expandedMessagesRef;

    const [isExpanded, setIsExpanded] = useState(() => {
        if (notificationId != null && expandedRef?.current) {
            return expandedRef.current.has(notificationId);
        }
        return false;
    });
    const [isTruncated, setIsTruncated] = useState(false);
    const spanRef = useRef<HTMLSpanElement>(null);
    const message = props.value || '';

    useEffect(() => {
        const el = spanRef.current;
        if (!el) return;

        const update = () => {
            if (!isExpanded) {
                setIsTruncated(el.scrollWidth > el.clientWidth);
            }
        };

        update(); // initial check

        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, [message, isExpanded]);

    const handleClick = () => {
        if (!isTruncated) return;
        setIsExpanded(prev => {
            const next = !prev;
            if (notificationId != null && expandedRef?.current) {
                if (next) expandedRef.current.add(notificationId);
                else expandedRef.current.delete(notificationId);
            }
            return next;
        });
    };

    return (
        <div
            className="flex items-center text-sm my-2.5 space-x-2"
            onClick={handleClick}
            style={{ cursor: isTruncated ? 'pointer' : 'default' }}
        >
            <span
                ref={spanRef}
                className={isExpanded ? 'whitespace-normal' : 'truncate'}
            >
                {message}
            </span>
            {isTruncated &&
                (isExpanded ? (
                    <ChevronUp className="flex-shrink-0 w-4 h-4" />
                ) : (
                    <ChevronDown className="flex-shrink-0 w-4 h-4" />
                ))}
        </div>
    );
};



const NotificationStatusRenderer = (props: { value: boolean; data: any }) => {
    const isRead = props.value;
    const type = props.data?.type;

    // Sent notifications - show send icon
    if (type === 'sent') {
        return (
            <div className="flex items-center justify-center h-full">
                <IconSent size={"4"} classNames="text-neutral-500" />
            </div>
        );
    }

    // Received unread - show blue dot
    if (!isRead) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="rounded-full bg-button-primary-fill w-2 h-2"></div>
            </div>
        );
    }

    // Received read - show mail open icon
    return (
        <div className="flex items-center justify-center h-full">
            <MailOpen className="w-4 h-4 text-neutral-600" />
        </div>
    );
};

const RecipientsRenderer = (props: { value: { name: string }[] }) => {
    const recipients = props.value || [];
    const count = recipients.length;
    if (count === 0) return <span>-</span>;
    const formatCount = (num: number): string => {
        if (num >= 100000) {
            const lakhs = Math.floor(num / 100000);
            return `${lakhs}L`;
        } else if (num >= 1000) {
            const thousands = Math.floor(num / 1000);
            return `${thousands}K`;
        }
        return num.toString();
    };

    return (
        <span title={`${count}`}>
            {formatCount(count)}
        </span>
    );
};

const ActionRenderer = (props: { value: { title: string; url?: string } }) => {
    const action = props.value;

    if (!action?.url || !action?.title) {
        return <span>-</span>;
    }

    return (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <a
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-button-primary-fill hover:text-button-primary-hover-fill underline text-sm"
            >
                {action.title}
            </a>
        </div>
    );
};

export const CMSNotificationGrid = (props: CMSNotificationGridProps) => {
    const {
        receivedNotifications,
        sentNotifications,
        onMarkAllRead,
        onMarkSelectedAsRead,
        onRowClicked,
        gridRef,
        locale,
        loading,
    } = props;

    const dictionary = getDictionary(locale).components.notificationGrid;
    const baseGridDictionary = getDictionary(locale).components.baseGrid;

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterType, setFilterType] = useState<'all' | 'received' | 'sent'>('all');
    const [selectedRows, setSelectedRows] = useState<NotificationRow[]>([]);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

    // Persist expanded message state across AG Grid remounts
    const expandedMessagesRef = useRef<Set<string | number>>(new Set());

    const baseRowData = useMemo(() => [
        ...receivedNotifications.map(n => ({
            ...n,
            type: 'received' as const,
            id: String(n.id),
            action: { title: n.actionTitle, url: n.actionUrl },
            timestamp: n.createdAt,
            isRead: n.isRead
        })),
        ...sentNotifications.map((n) => ({
            ...n,
            type: 'sent' as const,
            action: { title: n.actionTitle, url: n.actionUrl },
            timestamp: n.createdAt,
            isRead: true,
            recipients: n.receivers || [],
        })),
    ], [receivedNotifications, sentNotifications]);

    const [rowData, setRowData] = useState(baseRowData);

    useEffect(() => {
        setRowData(baseRowData);
    }, [baseRowData]);

    const handleOptimisticRowClicked = useCallback((notification: NotificationRow) => {
        if (notification.type === 'received' && !notification.isRead && notification.id) {
            setRowData(prev =>
                prev.map(n => (n.type === 'received' && n.id === notification.id) ? { ...n, isRead: true } : n)
            );
            // Sync selectedRows so getButtonText sees the updated isRead
            setSelectedRows(prev =>
                prev.map(r => r.id === notification.id ? { ...r, isRead: true } : r)
            );
        }
        if (onRowClicked) onRowClicked(notification);
    }, [onRowClicked]);

    const columnDefs = useMemo(() => [
        {
            headerName: dictionary.new,
            field: 'isRead',
            cellRenderer: NotificationStatusRenderer,
            minWidth: 100,
            maxWidth: 100,
            checkboxSelection: (params: any) => params.data?.type === 'received' && !!params.data?.id && !params.data?.isRead,
            headerCheckboxSelection: (params: any) => {
                const unreadReceived = receivedNotifications.filter(n => !n.isRead);
                return unreadReceived.length > 0;
            },
        },
        {
            flex: 1,
            field: 'message',
            headerName: dictionary.message,
            wrapText: true,
            autoHeight: true,
            cellRenderer: NotificationMessageRenderer,
            cellRendererParams: { expandedMessagesRef },
            filter: 'agTextColumnFilter',
            minWidth: 500,
            onCellClicked: (event: { data: NotificationRow }) => {
                if (event.data) handleOptimisticRowClicked(event.data);
            },
        },
        {
            field: 'type',
            headerName: dictionary.type,
            valueFormatter: (params: { value: string }) => params.value === 'received' ? dictionary.received : dictionary.sent,
            onCellClicked: (event: { data: NotificationRow }) => {
                if (event.data) handleOptimisticRowClicked(event.data);
            },
        },
        {
            field: 'recipients',
            headerName: dictionary.recipientsHeader,
            cellRenderer: RecipientsRenderer,
            hide: false,
            onCellClicked: (event: { data: NotificationRow }) => {
                if (event.data) handleOptimisticRowClicked(event.data);
            },
        },
        {
            field: 'action',
            headerName: dictionary.action,
            cellRenderer: ActionRenderer,
            minWidth: 150,
            maxWidth: 200,
            headerClass: 'ag-header-cell-center',
            cellClass: 'ag-cell-center',
            onCellClicked: (event: { data: NotificationRow }) => {
                if (event.data) handleOptimisticRowClicked(event.data);
            },
        },
        {
            field: 'timestamp',
            headerName: dictionary.dateTime,
            valueFormatter: (params: { value: string | number | Date; }) => (params.value ? formatDate(new Date(params.value)) : ''),
            filter: 'agDateColumnFilter',
            onCellClicked: (event: { data: NotificationRow }) => {
                if (event.data) handleOptimisticRowClicked(event.data);
            },
            sort: 'desc' as 'asc' | 'desc' | null
        },
        {
            field: 'platform',
            hide: true,
        },
    ], [dictionary, receivedNotifications, handleOptimisticRowClicked]);

    const doesExternalFilterPass = useCallback(
        (node: IRowNode<NotificationRow>) => {
            const notification = node.data;
            if (!notification) return false;

            // Type filter
            if (filterType !== 'all' && notification.type !== filterType) {
                return false;
            }

            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const messageMatch = notification.message?.toLowerCase().includes(searchLower);
                const actionMatch = notification.action?.title?.toLowerCase().includes(searchLower);
                const recipientsMatch = notification.recipients?.some(r => r.name?.toLowerCase().includes(searchLower));

                if (!(messageMatch || actionMatch || recipientsMatch)) {
                    return false;
                }
            }

            return true;
        },
        [searchTerm, filterType]
    );

    const refreshGrid = useCallback(() => {
        if (gridRef.current?.api) {
            gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
            gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
            gridRef.current.api.refreshClientSideRowModel('filter');
            gridRef.current.api.onFilterChanged();
        }
    }, [doesExternalFilterPass, gridRef]);

    useEffect(() => {
        refreshGrid();
    }, [refreshGrid, searchTerm, filterType, rowData]);

    // Effect to restore selections after data changes
    useEffect(() => {
        if (gridRef.current?.api && selectedRowIds.size > 0) {
            setTimeout(() => {
                gridRef.current?.api?.forEachNode((node) => {
                    if (node.data?.id && selectedRowIds.has(node.data.id)) {
                        node.setSelected(true);
                    }
                });
            }, 100);
        }
    }, [rowData, selectedRowIds]);

    const handleSmartMarkAsRead = () => {
        const selectedUnreadReceived = selectedRows.filter(row => row.type === 'received' && !row.isRead);

        if (selectedUnreadReceived.length > 0) {
            const receivedIds = selectedUnreadReceived
                .map(row => String(row.id))
                .filter(id => id && id !== 'undefined');

            if (receivedIds.length > 0) {
                onMarkSelectedAsRead(receivedIds);
            }
        } else {
            onMarkAllRead();
        }

        setSelectedRowIds(new Set());
        setSelectedRows([]);
    };

    // Get button text based on selection state
    const getButtonText = () => {
        const selectedUnreadReceived = selectedRows.filter(row => row.type === 'received' && !row.isRead);

        if (selectedUnreadReceived.length > 0) {
            return `${dictionary.markSelectedAsRead} (${selectedUnreadReceived.length})`;
        }
        return dictionary.markAllAsRead;
    };

    // Check if button should be disabled
    const isButtonDisabled = () => {
        const selectedUnreadReceived = selectedRows.filter(row => row.type === 'received' && !row.isRead);
        const hasUnreadReceived = receivedNotifications.some(n => !n.isRead);

        return loading || (!hasUnreadReceived && selectedUnreadReceived.length === 0);
    };
    const onSelectionChanged = () => {
        if (gridRef.current?.api) {
            const selected = gridRef.current.api.getSelectedRows();
            setSelectedRows(selected);

            // Update the set of selected IDs for persistence
            const newSelectedIds = new Set(
                selected
                    .filter(row => row.type === 'received' && row.id)
                    .map(row => row.id!)
            );
            setSelectedRowIds(newSelectedIds);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <InputField
                    className="flex-grow relative md:mr-2 h-10"
                    setValue={setSearchTerm}
                    value={searchTerm}
                    inputText={dictionary.searchPlaceholder}
                    hasLeftContent
                    leftContent={<IconSearch />}
                />
                <div className="flex flex-row gap-2">
                    <Dropdown
                        type="simple"
                        options={[
                            { value: 'all', label: dictionary.all },
                            { value: 'received', label: dictionary.received },
                            { value: 'sent', label: dictionary.sent },
                        ]}
                        onSelectionChange={(selected) => setFilterType(selected as 'all' | 'received' | 'sent')}
                        defaultValue={filterType}
                        text={{ simpleText: dictionary.filterByType }}
                        className="w-full md:w-auto"
                    />
                    <Button
                        variant="primary"
                        size="medium"
                        text={loading ? baseGridDictionary.loading : getButtonText()}
                        onClick={handleSmartMarkAsRead}
                        disabled={isButtonDisabled()}
                        className="w-full md:w-auto"
                    />
                </div>
            </div>

            <BaseGrid
                    shouldDelayRender={true}
                    gridRef={gridRef}
                    locale={locale}
                    suppressRowHoverHighlight={true}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    pagination={true}
                    paginationAutoPageSize={true}
                    suppressPaginationPanel={true}
                    domLayout="normal"
                    isExternalFilterPresent={() => true}
                    doesExternalFilterPass={doesExternalFilterPass}
                    rowSelection="multiple"
                    onSelectionChanged={onSelectionChanged}
                    getRowId={(params) => String(params.data.id)}
                    getRowStyle={(params) => {
                        if (!params.data) return undefined;
                        return params.data.isRead
                            ? { background: 'inherit' }
                            : { background: 'var(--color-base-neutral-800)' };
                    }}
                />
        </div>
    );
};
