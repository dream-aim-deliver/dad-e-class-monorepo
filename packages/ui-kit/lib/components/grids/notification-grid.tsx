import { notification } from '@maany_shr/e-class-models';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/style-utils';
import { BaseGrid } from './base-grid';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface NotificationGridProps {
    notifications: notification.TNotification[];
    onNotificationClick: (notification: notification.TNotification) => void;
}

// TODO: possibly support 12-hour format
function formatDate(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} at ${hours}:${minutes}`;
}

// TODO: ensure styling matching Figma
export const NotificationCard = ({ notification, onClick }: {
    notification: notification.TNotification,
    onClick: (notification: notification.TNotification) => void;
}) => {
    const isPending = !notification.isRead;
    return (
        <div className={cn(
            "@3xl:flex items-center p-4 justify-between rounded-md my-2 space-x-2",
            isPending && "bg-base-neutral-800"
        )}>
            <p className="text-base-neutral-50 text-wrap text-sm">{notification.message}</p>
            <div className="flex space-x-2 items-center">
                <span className="font-bold text-base-brand-500 hover:text-base-brand-600 max-w-sm truncate cursor-pointer" onClick={() => onClick(notification)}>
                    {notification.action.title}
                </span>
                <p className="text-xs text-base-neutral-300">{formatDate(new Date(notification.timestamp))}</p>
                {isPending && <Check className="text-base-brand-500 h-5 w-5 flex-shrink-0" />}
            </div>
        </div>
    );
};

const NotificationCellRenderer = (props: any) => {
    const notification = props.data;
    const onClick = props.onClick;
    return <NotificationCard notification={notification} onClick={onClick} />;
};

const PAGE_SIZE = 7;

export const NotificationGrid = ({ notifications, onNotificationClick }: NotificationGridProps) => {
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        {
            flex: 1,
            cellRenderer: NotificationCellRenderer,
            cellRendererParams: {
                onClick: onNotificationClick
            },
            sortable: false,
            filter: false,
            autoHeight: true,
            cellStyle: { padding: '0px', border: 'none', overflow: 'hidden' },
        }
    ]);
    const gridRef = useRef<AgGridReact>(null);

    return <div className="flex flex-col h-full notification-grid @container">
        <BaseGrid
            gridRef={gridRef}
            headerHeight={0}
            columnDefs={columnDefs}
            rowData={notifications}
            pagination={true}
            paginationPageSize={PAGE_SIZE}
            suppressPaginationPanel={true}
            domLayout="normal"
        />
    </div>;
};
