import { notification } from '@maany_shr/e-class-models';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { Button } from '../button';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface NotificationGridProps {
    notifications: notification.TNotification[];
    onNotificationClick: (notification: notification.TNotification) => void;
}

const PAGE_SIZE = 15;

const NotificationMessageRenderer = (props: any) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const message = props.value;
    return <div className="flex items-center text-sm my-2.5 space-x-2"
                onClick={() => setIsExpanded(prevState => !prevState)}>
        <span className={isExpanded ? 'text-wrap' : 'truncate'}>{message}</span>
        {isExpanded ? <ChevronUp className="flex-shrink-0 w-4 h-4" /> :
            <ChevronDown className="flex-shrink-0 w-4 h-4" />}
    </div>;
};

const NotificationActionRenderer = (props: any) => {
    const action = props.value;

    return (
        <Button
            variant="text"
            className="text-sm px-0"
            text={action.title}
        />
    );
};

const NotificationStatusRenderer = (props: any) => {
    const isRead = props.value;
    return isRead ? null : <div className="flex items-center justify-center h-full">
        <div className="rounded-full bg-base-brand-500 w-2 h-2"></div>
    </div>;
};

export const NotificationGrid = ({ notifications, onNotificationClick }: NotificationGridProps) => {
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        {
            headerName: '',
            field: 'isRead',
            cellRenderer: NotificationStatusRenderer,
            maxWidth: 40,
            minWidth: 40
        },
        {
            flex: 1,
            field: 'message',
            wrapText: true,
            autoHeight: true,
            cellRenderer: NotificationMessageRenderer
        },
        {
            field: 'action',
            headerName: 'Action',
            cellRenderer: NotificationActionRenderer,
            onCellClicked: (event) => {
                const notification = event.data;
                onNotificationClick(notification);
            }
        },
        {
            field: 'timestamp',
            headerName: 'Date & Time',
            valueFormatter: (params) => formatDate(new Date(params.value))
        }
    ]);
    const gridRef = useRef<AgGridReact>(null);

    return <div className="flex flex-col h-full @container">
        <BaseGrid
            gridRef={gridRef}
            suppressRowHoverHighlight={true}
            columnDefs={columnDefs}
            rowData={notifications}
            pagination={true}
            paginationPageSize={PAGE_SIZE}
            suppressPaginationPanel={true}
            domLayout="normal"
            getRowStyle={(params) => {
                if (!params.data.isRead) {
                    return { backgroundColor: 'var(--color-base-neutral-800)' };
                }
            }}
        />
    </div>;
};
