import type { Meta, StoryObj } from '@storybook/react';
import { UserGrid } from '../lib/components/grids/user-grid';
import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';

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
        name: "John",
        surname: "Smith",
        email: "john.smith@example.com",
        phone: "+1-555-123-4567",
        rating: 4.7,
        platform: "iOS",
        coachingSessionsCount: 24,
        coursesBought: 5,
        coursesCreated: 2,
        lastAccess: 1714022400000 // April 24, 2025
    },
    {
        id: 1002,
        name: "Emma",
        surname: "Johnson",
        email: "emma.j@example.com",
        phone: "+1-555-987-6543",
        rating: 4.9,
        platform: "Android",
        coachingSessionsCount: 38,
        coursesBought: 12,
        coursesCreated: 0,
        lastAccess: 1713936000000 // April 23, 2025
    },
    {
        id: 1003,
        name: "Miguel",
        surname: "Garcia",
        email: "m.garcia@example.com",
        phone: "+34-611-222-333",
        rating: 3.8,
        platform: "Web",
        coachingSessionsCount: 7,
        coursesBought: 3,
        coursesCreated: 0,
        lastAccess: 1713418800000 // April 17, 2025
    },
    {
        id: 1004,
        name: "Sarah",
        surname: "Williams",
        email: "swilliams@example.com",
        phone: "+1-555-444-3333",
        rating: 5.0,
        platform: "iOS",
        coachingSessionsCount: 52,
        coursesBought: 0,
        coursesCreated: 6,
        lastAccess: 1713849600000 // April 22, 2025
    },
    {
        id: 1005,
        name: "Akira",
        surname: "Tanaka",
        email: "a.tanaka@example.com",
        phone: "+81-90-1234-5678",
        rating: undefined,
        platform: "Android",
        coachingSessionsCount: undefined,
        coursesBought: 7,
        coursesCreated: 1,
        lastAccess: 1714022400000 // April 24, 2025
    },
    {
        id: 1006,
        name: "Olivia",
        surname: "Chen",
        email: "oliviac@example.com",
        phone: "+1-555-777-8888",
        rating: 4.2,
        platform: "Web",
        coachingSessionsCount: 31,
        coursesBought: undefined,
        coursesCreated: 3,
        lastAccess: 1713504000000 // April 18, 2025
    },
    {
        id: 1007,
        name: "Luis",
        surname: "Rodriguez",
        email: "luis.r@example.com",
        phone: "+52-555-987-6543",
        rating: 3.5,
        platform: "iOS",
        coachingSessionsCount: 9,
        coursesBought: 2,
        coursesCreated: 0,
        lastAccess: 1712812800000 // April 10, 2025
    },
    {
        id: 1008,
        name: "Anna",
        surname: "Kowalski",
        email: "annak@example.com",
        phone: "+48-512-345-678",
        rating: 4.8,
        platform: "Android",
        coachingSessionsCount: 45,
        coursesBought: 9,
        coursesCreated: 5,
        lastAccess: 1713763200000 // April 21, 2025
    },
    {
        id: 1009,
        name: "David",
        surname: "Nguyen",
        email: "d.nguyen@example.com",
        phone: "+1-555-222-1111",
        rating: undefined,
        platform: "Web",
        coachingSessionsCount: 18,
        coursesBought: 6,
        coursesCreated: 0,
        lastAccess: 1713676800000 // April 20, 2025
    },
    {
        id: 1010,
        name: "Maria",
        surname: "Silva",
        email: "maria.s@example.com",
        phone: "+55-11-98765-4321",
        rating: 4.1,
        platform: "iOS",
        coachingSessionsCount: 27,
        coursesBought: 3,
        coursesCreated: 1,
        lastAccess: 1713936000000 // April 23, 2025
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
        },
    }
};
