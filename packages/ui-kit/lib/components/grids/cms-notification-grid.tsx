'use client';
import { AllCommunityModule, IRowNode, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefObject, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { MailOpen } from 'lucide-react';
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
    gridRef: RefObject<AgGridReact>;
    loading: boolean;
}

ModuleRegistry.registerModules([AllCommunityModule]);

const NotificationMessageRenderer = (props: { value: string }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const message = props.value || '';


    return (
        <div
            className="flex items-center text-sm my-2.5 space-x-2"
        >
            <span
                ref={spanRef}
                className={'truncate'}
            >
                {message}
            </span>
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
                <IconSent size={"4"}  classNames="text-neutral-500" />
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
        gridRef,
        locale,
        loading,
    } = props;

    const dictionary = getDictionary(locale).components.notificationGrid;

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterType, setFilterType] = useState<'all' | 'received' | 'sent'>('all');
    const [selectedRows, setSelectedRows] = useState<NotificationRow[]>([]);

    const rowData = useMemo(() => [
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

    const columnDefs = useMemo(() => [
        {
            headerName: dictionary.new,
            field: 'isRead',
            cellRenderer: NotificationStatusRenderer,
            minWidth: 100,
            maxWidth: 100,
            checkboxSelection: (params: any) => params.data?.type === 'received' && !!params.data?.id && !params.data?.isRead,
            headerCheckboxSelection: false,
        },
        {
            flex: 1,
            field: 'message',
            headerName: dictionary.message,
            wrapText: true,
            cellRenderer: NotificationMessageRenderer,
            filter: 'agTextColumnFilter',
            tooltipField: 'message',
            minWidth: 500,
        },
        {
            field: 'type',
            headerName: dictionary.type,
            valueFormatter: (params: { value: string }) => params.value === 'received' ? dictionary.received : dictionary.sent
        },
        {
            field: 'recipients',
            headerName: dictionary.recipientsHeader,
            cellRenderer: RecipientsRenderer,
            hide: false
        },
        {
            field: 'action',
            headerName: dictionary.action,
            cellRenderer: ActionRenderer,
            minWidth: 150,
            maxWidth: 200,
            headerClass: 'ag-header-cell-center',
            cellClass: 'ag-cell-center',
        },
        {
            field: 'timestamp',
            headerName: dictionary.dateTime,
            valueFormatter: (params: { value: string | number | Date; }) => (params.value ? formatDate(new Date(params.value)) : ''),
            filter: 'agDateColumnFilter',
            sort: 'desc' as 'asc' | 'desc' | null
        },
        {
            field: 'platform',
            hide: true,
        },
    ], [dictionary]);

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
                const recipientsMatch = notification.recipients?.some(r => r.name.toLowerCase().includes(searchLower));

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

    const handleMarkSelectedAsRead = () => {
        const receivedIds = selectedRows.filter(row => row.type === 'received' && row.id).map(row => row.id!);
        onMarkSelectedAsRead(receivedIds);
    };
    const onSelectionChanged = () => {
        if (gridRef.current?.api) {
            const selected = gridRef.current.api.getSelectedRows();
            setSelectedRows(selected);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center w-full">
                    <InputField
                        className="flex-1 relative h-10"
                        setValue={setSearchTerm}
                        value={searchTerm}
                        inputText={dictionary.searchPlaceholder}
                        hasLeftContent
                        leftContent={<IconSearch />}
                    />
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
                        className="w-full md:w-40"
                    />
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                    <Button
                        variant="secondary"
                        size="medium"
                        text={dictionary.markSelectedAsRead}
                        onClick={handleMarkSelectedAsRead}
                        disabled={loading || selectedRows.filter(row => row.type === 'received').length === 0 || receivedNotifications.length === 0}
                        className="w-full md:w-auto"
                    />
                    <Button
                        variant="primary"
                        size="medium"
                        text={dictionary.markAllAsRead}
                        onClick={onMarkAllRead}
                        disabled={loading || receivedNotifications.length === 0}
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
                paginationPageSize={50}
                suppressPaginationPanel={true}
                domLayout="normal"
                isExternalFilterPresent={() => true}
                doesExternalFilterPass={doesExternalFilterPass}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
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
