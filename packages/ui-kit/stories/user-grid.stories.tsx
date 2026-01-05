import type { Meta, StoryObj } from '@storybook/react';
import { UserRow, UserGrid } from '../lib/components/grids/user-grid';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '../lib/components/button';
import { IRowNode } from 'ag-grid-community';
import { NextIntlClientProvider } from 'next-intl';

const mockMessages = {
    en: {
        userGrid: {
            name: 'Name',
            surname: 'Surname',
            email: 'Email',
            phone: 'Phone',
            rating: 'Rating',
            roles: 'Roles',
            sessions: 'Sessions',
            coursesBought: 'Courses Bought',
            coursesCreated: 'Courses Created',
            lastAccess: 'Last Access'
        }
    },
    de: {
        userGrid: {
            name: 'Name',
            surname: 'Nachname',
            email: 'E-Mail',
            phone: 'Telefon',
            rating: 'Bewertung',
            roles: 'Rollen',
            sessions: 'Sitzungen',
            coursesBought: 'Gekaufte Kurse',
            coursesCreated: 'Erstellte Kurse',
            lastAccess: 'Letzter Zugriff'
        }
    }
};

const meta: Meta<typeof UserGrid> = {
    title: 'Components/UserGrid',
    component: UserGrid,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen'
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
    },
    decorators: [
        (Story, context) => {
            const gridRef = useRef<AgGridReact>(null);
            return (
                <NextIntlClientProvider
                    locale={context.args.locale || 'en'}
                    messages={mockMessages[context.args.locale || 'en']}
                >
                    <div className="h-screen w-full p-4">
                        <Story args={{
                            ...context.args,
                            gridRef: gridRef
                        }} />
                    </div>
                </NextIntlClientProvider>
            );
        }
    ]
};

const mockUsers: UserRow[] = [
    {
        id: 1001,
        userId: 1001,
        name: 'John',
        surname: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-123-4567',
        rating: 4.7,
        roles: [
            { platformName: 'JustDoAd', role: 'student' },
            { platformName: 'Bewerbeagentur', role: 'coach' }
        ],
        coachingSessionsCount: 24,
        coursesBought: 5,
        coursesCreated: 2,
        lastAccess: 1714022400000 // April 24, 2024
    },
    {
        id: 1002,
        userId: 1002,
        name: 'Emma',
        surname: 'Johnson',
        email: 'emma.j@example.com',
        phone: '+1-555-987-6543',
        rating: 4.9,
        roles: [{ platformName: 'Bewerbeagentur', role: 'student' }],
        coachingSessionsCount: 38,
        coursesBought: 12,
        coursesCreated: 0,
        lastAccess: 1713936000000 // April 23, 2024
    },
    {
        id: 1003,
        userId: 1003,
        name: 'Miguel',
        surname: 'Garcia',
        email: 'm.garcia@example.com',
        phone: '+34-611-222-333',
        rating: 3.8,
        roles: [{ platformName: 'JobBrandMe', role: 'student' }],
        coachingSessionsCount: 7,
        coursesBought: 3,
        coursesCreated: 0,
        lastAccess: 1713418800000 // April 17, 2024
    },
    {
        id: 1004,
        userId: 1004,
        name: 'Sarah',
        surname: 'Williams',
        email: 'swilliams@example.com',
        phone: '+1-555-444-3333',
        rating: 5.0,
        roles: [
            { platformName: 'JustDoAd', role: 'course creator' },
            { platformName: 'JobBrandMe', role: 'coach' }
        ],
        coachingSessionsCount: 52,
        coursesBought: 0,
        coursesCreated: 6,
        lastAccess: 1713849600000 // April 22, 2024
    },
    {
        id: 1005,
        userId: 1005,
        name: 'Akira',
        surname: 'Tanaka',
        email: 'a.tanaka@example.com',
        phone: '+81-90-1234-5678',
        rating: undefined,
        roles: [
            { platformName: 'Bewerbeagentur', role: 'student' },
            { platformName: 'JobBrandMe', role: 'course creator' }
        ],
        coachingSessionsCount: undefined,
        coursesBought: 7,
        coursesCreated: 1,
        lastAccess: 1714022400000 // April 24, 2024
    },
    {
        id: 1006,
        userId: 1006,
        name: 'Olivia',
        surname: 'Chen',
        email: 'oliviac@example.com',
        phone: '+1-555-777-8888',
        rating: 4.2,
        roles: [{ platformName: 'JobBrandMe', role: 'course creator' }],
        coachingSessionsCount: 31,
        coursesBought: undefined,
        coursesCreated: 3,
        lastAccess: 1713504000000 // April 18, 2024
    },
    {
        id: 1007,
        userId: 1007,
        name: 'Luis',
        surname: 'Rodriguez',
        email: 'luis.r@example.com',
        phone: '+52-555-987-6543',
        rating: 3.5,
        roles: [{ platformName: 'JustDoAd', role: 'student' }],
        coachingSessionsCount: 9,
        coursesBought: 2,
        coursesCreated: 0,
        lastAccess: 1712812800000 // April 10, 2024
    },
    {
        id: 1008,
        userId: 1008,
        name: 'Anna',
        surname: 'Kowalski',
        email: 'annak@example.com',
        phone: '+48-512-345-678',
        rating: 4.8,
        roles: [
            { platformName: 'JustDoAd', role: 'admin' },
            { platformName: 'Bewerbeagentur', role: 'course creator' }
        ],
        coachingSessionsCount: 45,
        coursesBought: 9,
        coursesCreated: 5,
        lastAccess: 1713763200000 // April 21, 2024
    },
    {
        id: 1009,
        userId: 1009,
        name: 'David',
        surname: 'Nguyen',
        email: 'd.nguyen@example.com',
        phone: '+1-555-222-1111',
        rating: undefined,
        roles: [
            { platformName: 'JobBrandMe', role: 'student' },
            { platformName: 'Bewerbeagentur', role: 'coach' }
        ],
        coachingSessionsCount: 18,
        coursesBought: 6,
        coursesCreated: 0,
        lastAccess: 1713676800000 // April 20, 2024
    },
    {
        id: 1010,
        userId: 1010,
        name: 'Maria',
        surname: 'Silva',
        email: 'maria.s@example.com',
        phone: '+55-11-98765-4321',
        rating: 4.1,
        roles: [
            { platformName: 'Bewerbeagentur', role: 'student' },
            { platformName: 'JustDoAd', role: 'course creator' }
        ],
        coachingSessionsCount: 27,
        coursesBought: 3,
        coursesCreated: 1,
        lastAccess: 1713936000000 // April 23, 2024
    },
    {
        id: 1011,
        userId: 1011,
        name: 'Alexandraxandraxandraxandraxandraxandraxandraxandraxandraxandraxandrahxandrah',
        surname: 'Constantinopolisworthingtonschlegelsteinhausenbergerdorffweilerwilsonsmithfield',
        email: 'alexandraconstantinopolisworthingtonschlegelsteinhausenbergerdorffweilerwilsonsmithfield_verylongemail_testing_overflow_conditions_with_extra_characters_to_ensure_proper_handling@verylongdomainnametotestoverflowconditions.co.educational.systems',
        phone: '+123-456-7890-1234-5678-9012-3456-7890-1234-5678-9012-3456-7890-1234-5678-9012',
        rating: 4.9999999999999,
        roles: [
            { platformName: 'Bewerbeagentur', role: 'admin' },
            { platformName: 'JustDoAd', role: 'course creator' },
            { platformName: 'JobBrandMe', role: 'coach' },
        ],
        coachingSessionsCount: 9939999,
        coursesBought: 88888888,
        coursesCreated: 7777777,
        lastAccess: 9999999999999 // Far future date to test timestamp overflow
    }
];

export default meta;
type Story = StoryObj<typeof UserGrid>;

const multipleMockUsers = Array(10).fill(mockUsers).flat();

export const Default: Story = {
    args: {
        users: multipleMockUsers,
        locale: 'en',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const GermanLocale: Story = {
    args: {
        users: multipleMockUsers,
        locale: 'de',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const StudentsOnly: Story = {
    args: {
        users: multipleMockUsers.filter(user => user.roles.some(role => role.role === 'student')),
        locale: 'en',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const CoachesOnly: Story = {
    args: {
        users: multipleMockUsers.filter(user => user.roles.some(role => role.role === 'coach')),
        locale: 'en',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const CourseCreatorsOnly: Story = {
    args: {
        users: multipleMockUsers.filter(user => user.roles.some(role => role.role === 'course creator')),
        locale: 'en',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const AdminsOnly: Story = {
    args: {
        users: multipleMockUsers.filter(user => user.roles.some(role => role.role === 'admin')),
        locale: 'en',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const Selectable: Story = {
    args: {
        users: Array.from({ length: 5 }, () => [...multipleMockUsers]).flat(),
        enableSelection: true,
        locale: 'en',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        },
        onSendNotifications: (userIds) => {
            alert(`Send notifications to ${userIds.length} users: ${userIds.join(', ')}`);
        }
    }
};

export const Empty: Story = {
    args: {
        users: [],
        locale: 'en',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        }
    }
};

export const WithNotifications: Story = {
    name: 'With Notifications',
    args: {
        users: Array.from({ length: 2 }, () => [...multipleMockUsers]).flat(),
        enableSelection: true,
        locale: 'en',
        showDetailsColumn: true,
        onUserDetailsClick: (user) => {
            alert(`User details clicked: ${user.name} ${user.surname}`);
        },
        onEmailClick: (email) => {
            alert(`Email clicked: ${email}`);
        },
        onSendNotifications: (userIds) => {
            alert(`Notification sent to ${userIds.length} users: ${userIds.join(', ')}`);
        }
    },
    decorators: [
        (Story, context) => {
            const gridRef = useRef<AgGridReact>(null);

            // Helper function to select all users
            const selectAllUsers = () => {
                if (gridRef.current?.api) {
                    gridRef.current.api.selectAll();
                }
            };

            // Helper function to select specific users
            const selectFirstThreeUsers = () => {
                if (gridRef.current?.api) {
                    gridRef.current.api.deselectAll();

                    // Get the first 3 nodes and select them
                    let count = 0;
                    gridRef.current.api.forEachNode(node => {
                        if (count < 3 && node.data) {
                            node.setSelected(true);
                            count++;
                        }
                    });
                }
            };

            // Helper function to clear selection
            const clearSelection = () => {
                if (gridRef.current?.api) {
                    gridRef.current.api.deselectAll();
                }
            };

            return (
                <NextIntlClientProvider
                    locale={context.args.locale || 'en'}
                    messages={mockMessages[context.args.locale || 'en']}
                >
                    <div className="h-screen w-full p-4 flex flex-col">
                        <div className="mb-4 flex space-x-2">
                            <Button text="Select All Users" onClick={selectAllUsers} variant="secondary" />
                            <Button text="Select First 3 Users" onClick={selectFirstThreeUsers} variant="secondary" />
                            <Button text="Clear Selection" onClick={clearSelection} variant="secondary" />
                        </div>
                        <div className="flex-1">
                            <Story args={{
                                ...context.args,
                                gridRef: gridRef
                            }} />
                        </div>
                    </div>
                </NextIntlClientProvider>
            );
        }
    ]
};

export const Filter: Story = {
    args: {
        users: Array.from({ length: 5 }, () => [...multipleMockUsers]).flat(),
        locale: 'en',
        showDetailsColumn: true,
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

            const doesFilterPass = useCallback((node: IRowNode<UserRow>) => {
                if (!node.data) return false;
                if (filteringByName && !node.data?.name?.toLowerCase().includes('an')) {
                    return false;
                }
                if (filteringByPhone && !node.data?.phone?.startsWith('+1')) {
                    return false;
                }
                if (filteringByRating && (node.data?.rating === undefined || node.data.rating <= 4.5)) {
                    return false;
                }
                if (filteringByAccess && node.data?.lastAccess > new Date('2024-04-20').getTime()) {
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

            return (
                <NextIntlClientProvider
                    locale={context.args.locale || 'en'}
                    messages={mockMessages[context.args.locale || 'en']}
                >
                    <div className="flex grow h-full w-full flex-col">
                        <div className="flex space-x-2 mb-4">
                            <Button text="Filter by name contains an" onClick={filterByName} />
                            <Button text="Filter by phone starts with +1" onClick={filterByPhone} />
                            <Button text="Filter by rating greater than 4.5" onClick={filterByRating} />
                            <Button text="Filter by access before April 20" onClick={filterByAccess} />
                        </div>
                        <Story args={{
                            ...context.args,
                            doesExternalFilterPass: doesFilterPass
                        }} />
                    </div>
                </NextIntlClientProvider>
            );
        }
    ]
};