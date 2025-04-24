import { AgGridReact } from 'ag-grid-react';
import React, { RefObject, useState } from 'react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { AllCommunityModule, ModuleRegistry, SortChangedEvent } from 'ag-grid-community';
import { StarRating } from '../star-rating';
import { Button } from '../button';

ModuleRegistry.registerModules([AllCommunityModule]);

// TODO: define in models
interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    rating?: number;
    platform: string;
    coachingSessionsCount?: number;
    coursesBought?: number;
    coursesCreated?: number;
    lastAccess: number; // timestamp
}

export interface UserGridProps {
    gridRef: RefObject<AgGridReact>;
    onUserDetailsClick: (user: User) => void;
    onEmailClick: (email: string) => void;
    users: User[];
    onSortChanged?: (event: SortChangedEvent) => void; // Might be required if we switch to server-side sorting
}

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

export const UserGrid = (props: UserGridProps) => {
    const [columnDefs, setColumnDefs] = useState([
        { field: 'name', headerName: 'Name' },
        { field: 'surname', headerName: 'Surname' },
        {
            cellRenderer: DetailsCellRenderer,
            onCellClicked: (params: any) => {
                const user = params.data;
                props.onUserDetailsClick(user);
            },
            cellClass: 'cursor-pointer',
            width: 100,
            resizable: false,
            sortable: false
        },
        {
            field: 'email',
            headerName: 'Email',
            cellRenderer: EmailCellRenderer,
            onCellClicked: (params: any) => {
                const email = params.value;
                props.onEmailClick(email);
            }
        },
        { field: 'phone', headerName: 'Phone' },
        {
            field: 'rating',
            headerName: 'Rating',
            cellRenderer: RatingCellRenderer
        },
        { field: 'platform', headerName: 'Platform' },
        {
            field: 'coachingSessionsCount', headerName: '# coaching sessions',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            }
        },
        {
            field: 'coursesBought', headerName: 'Courses bought',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            }
        },
        {
            field: 'coursesCreated', headerName: 'Courses created',
            valueFormatter: (params: any) => {
                const count = params.value;
                if (!count || count === 0) return '-';
                return count;
            }
        },
        {
            field: 'lastAccess', headerName: 'Last access', valueFormatter: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            }
        }
    ]);

    return <div className="flex flex-col h-full">
        <BaseGrid
            gridRef={props.gridRef}
            columnDefs={columnDefs}
            rowData={props.users}
            enableCellTextSelection={true}
            onSortChanged={props.onSortChanged}
            pagination={true}
            suppressPaginationPanel={true}
            paginationAutoPageSize={true}
        />
    </div>;
};
