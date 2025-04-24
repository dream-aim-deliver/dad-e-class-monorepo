import type { Meta, StoryObj } from '@storybook/react';
import { UserCMS, UserGrid } from '../lib/components/grids/user-grid';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '../lib/components/button';
import { RowNode } from 'ag-grid-community';

const meta: Meta<typeof UserGrid> = {
    title: 'Components/UserGrid',
    component: UserGrid,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen'
    },
    decorators: [
        (Story, context) => {
            const gridRef = useRef<AgGridReact>(null);
            return <div className="h-screen w-full p-4">
                <Story args={{
                    ...context.args,
                    gridRef: gridRef
                }} />
            </div>;
        }
    ]
};

const mockUsers = [
    {
        id: 1001,
        name: 'John',
        surname: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-123-4567',
        rating: 4.7,
        platform: 'iOS',
        coachingSessionsCount: 24,
        coursesBought: 5,
        coursesCreated: 2,
        lastAccess: 1714022400000 // April 24, 2024
    },
    {
        id: 1002,
        name: 'Emma',
        surname: 'Johnson',
        email: 'emma.j@example.com',
        phone: '+1-555-987-6543',
        rating: 4.9,
        platform: 'Android',
        coachingSessionsCount: 38,
        coursesBought: 12,
        coursesCreated: 0,
        lastAccess: 1713936000000 // April 23, 2024
    },
    {
        id: 1003,
        name: 'Miguel',
        surname: 'Garcia',
        email: 'm.garcia@example.com',
        phone: '+34-611-222-333',
        rating: 3.8,
        platform: 'Web',
        coachingSessionsCount: 7,
        coursesBought: 3,
        coursesCreated: 0,
        lastAccess: 1713418800000 // April 17, 2024
    },
    {
        id: 1004,
        name: 'Sarah',
        surname: 'Williams',
        email: 'swilliams@example.com',
        phone: '+1-555-444-3333',
        rating: 5.0,
        platform: 'iOS',
        coachingSessionsCount: 52,
        coursesBought: 0,
        coursesCreated: 6,
        lastAccess: 1713849600000 // April 22, 2024
    },
    {
        id: 1005,
        name: 'Akira',
        surname: 'Tanaka',
        email: 'a.tanaka@example.com',
        phone: '+81-90-1234-5678',
        rating: undefined,
        platform: 'Android',
        coachingSessionsCount: undefined,
        coursesBought: 7,
        coursesCreated: 1,
        lastAccess: 1714022400000 // April 24, 2024
    },
    {
        id: 1006,
        name: 'Olivia',
        surname: 'Chen',
        email: 'oliviac@example.com',
        phone: '+1-555-777-8888',
        rating: 4.2,
        platform: 'Web',
        coachingSessionsCount: 31,
        coursesBought: undefined,
        coursesCreated: 3,
        lastAccess: 1713504000000 // April 18, 2024
    },
    {
        id: 1007,
        name: 'Luis',
        surname: 'Rodriguez',
        email: 'luis.r@example.com',
        phone: '+52-555-987-6543',
        rating: 3.5,
        platform: 'iOS',
        coachingSessionsCount: 9,
        coursesBought: 2,
        coursesCreated: 0,
        lastAccess: 1712812800000 // April 10, 2024
    },
    {
        id: 1008,
        name: 'Anna',
        surname: 'Kowalski',
        email: 'annak@example.com',
        phone: '+48-512-345-678',
        rating: 4.8,
        platform: 'Android',
        coachingSessionsCount: 45,
        coursesBought: 9,
        coursesCreated: 5,
        lastAccess: 1713763200000 // April 21, 2024
    },
    {
        id: 1009,
        name: 'David',
        surname: 'Nguyen',
        email: 'd.nguyen@example.com',
        phone: '+1-555-222-1111',
        rating: undefined,
        platform: 'Web',
        coachingSessionsCount: 18,
        coursesBought: 6,
        coursesCreated: 0,
        lastAccess: 1713676800000 // April 20, 2024
    },
    {
        id: 1010,
        name: 'Maria',
        surname: 'Silva',
        email: 'maria.s@example.com',
        phone: '+55-11-98765-4321',
        rating: 4.1,
        platform: 'iOS',
        coachingSessionsCount: 27,
        coursesBought: 3,
        coursesCreated: 1,
        lastAccess: 1713936000000 // April 23, 2024
    },
    {
        id: 1011,
        name: 'Alexandraxandraxandraxandraxandraxandraxandraxandraxandraxandraxandrahxandrah',
        surname: 'Constantinopolisworthingtonschlegelsteinhausenbergerdorffweilerwilsonsmithfield',
        email: 'alexandraconstantinopolisworthingtonschlegelsteinhausenbergerdorffweilerwilsonsmithfield_verylongemail_testing_overflow_conditions_with_extra_characters_to_ensure_proper_handling@verylongdomainnametotestoverflowconditions.co.educational.systems',
        phone: '+123-456-7890-1234-5678-9012-3456-7890-1234-5678-9012-3456-7890-1234-5678-9012',
        rating: 4.9999999999999,
        platform: 'iOS/Android/Web/Desktop/Mobile/Tablet/SmartTV/Wearable/IoT/EmbeddedSystems',
        coachingSessionsCount: 9999999,
        coursesBought: 88888888,
        coursesCreated: 7777777,
        lastAccess: 9999999999999 // Far future date to test timestamp overflow
    }
];

export default meta;
type Story = StoryObj<typeof UserGrid>;

export const Default: Story = {
    args: {
        users: Array.from({ length: 5 }, () => [...mockUsers]).flat(),
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const Empty: Story = {
    args: {
        users: [],
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const Loading: Story = {
    args: {
        users: undefined,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const Filter: Story = {
    args: {
        users: Array.from({ length: 5 }, () => [...mockUsers]).flat(),
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    },
    decorators: [
        (Story, context) => {
            const [filteringByName, setFilteringByName] = useState<boolean>(false);
            const [filteringByPhone, setFilteringByPhone] = useState<boolean>(false);
            const [filteringByRating, setFilteringByRating] = useState<boolean>(false);
            const [filteringByAccess, setFilteringByAccess] = useState<boolean>(false);

            const doesFilterPass = useCallback((node: RowNode<UserCMS>) => {
                if (filteringByName && !node.data.name.toLowerCase().includes('an')) {
                    return false;
                }
                if (filteringByPhone && !node.data.phone.startsWith('+1')) {
                    return false;
                }
                if (filteringByRating && ((node.data.rating !== undefined && node.data.rating <= 4.5) || !node.data.rating)) {
                    return false;
                }
                if (filteringByAccess && node.data.lastAccess > new Date('2024-04-20').getTime()) {
                    return false;
                }
                return true;
            }, [filteringByName, filteringByPhone, filteringByRating, filteringByAccess]);

            const filterByName = () => {
                setFilteringByName(prevState => !prevState);
            };

            const filterByPhone = () => {
                setFilteringByPhone(prevState => !prevState);
            };

            const filterByRating = () => {
                setFilteringByRating(prevState => !prevState);
            };

            const filterByAccess = () => {
                setFilteringByAccess(prevState => !prevState);
            };

            return <div className="flex grow h-full w-full flex-col">
                <div className="flex space-x-2">
                    <Button text="Filter by name contains an" onClick={filterByName} />
                    <Button text="Filter by phone starts with +1" onClick={filterByPhone} />
                    <Button text="Filter by rating greater than 4.5" onClick={filterByRating} />
                    <Button text="Filter by access before April 20" onClick={filterByAccess} />
                </div>
                <Story args={{
                    ...context.args,
                    doesExternalFilterPass: doesFilterPass
                }} />
            </div>;
        }
    ]
};
