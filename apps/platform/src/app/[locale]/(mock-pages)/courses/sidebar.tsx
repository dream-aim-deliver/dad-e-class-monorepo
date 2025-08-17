'use client';
import {
    IconAccountInformation,
    IconCalendarAlt,
    IconCoachingSession,
    IconCourse,
    IconDashboard,
    IconGroup,
    IconLogOut,
    IconSales,
    IconStar,
    SideMenu,
    SideMenuProps,
} from '@maany_shr/e-class-ui-kit';
import {
    MenuItem,
    SideMenuItem,
} from 'packages/ui-kit/lib/components/sidemenu/sidemenu-item';
import { useState } from 'react';
const createMenuItems = (isStudent = false): MenuItem[][] => [
    [
        {
            icon: <IconDashboard />,
            label: 'Dashboard',
            onClick: () => console.log('Dashboard clicked'),
            notificationCount: isStudent ? 3 : 7,
        },
        {
            icon: <IconCourse />,
            label: isStudent ? 'Courses' : 'Your Courses',
            onClick: () => console.log('Courses clicked'),
        },
        {
            icon: <IconCoachingSession />,
            label: isStudent ? 'Coaching sessions' : 'Your Coaching sessions',
            onClick: () => console.log('Coaching sessions clicked'),
            notificationCount: isStudent ? 5 : 230,
        },
        {
            icon: <IconCalendarAlt />,
            label: 'Calendar',
            onClick: () => console.log('Calendar clicked'),
        },
        ...(!isStudent
            ? [
                  {
                      icon: <IconGroup />,
                      label: 'Your Students',
                      onClick: () => console.log('Students clicked'),
                      notificationCount: 2,
                  },
                  {
                      icon: <IconStar />,
                      label: 'Your Reviews',
                      onClick: () => console.log('Reviews clicked'),
                  },
              ]
            : []),
    ],
    [
        {
            icon: <IconAccountInformation />,
            label: 'Your Profile',
            onClick: () => console.log('Profile clicked'),
            notificationCount: isStudent ? 100 : 23,
        },
        {
            icon: <IconSales />,
            label: 'Orders & Payments',
            onClick: () => console.log('Orders & Payments clicked'),
        },
    ],
    [
        {
            icon: <IconLogOut />,
            label: 'Logout',
            onClick: () => console.log('Logout clicked'),
        },
    ],
];

const WorkspaceSidebar = (props: React.ComponentProps<typeof SideMenu>) => {
    const values: SideMenuProps = {
        userName: '',
        userRole: 'student',
        children: undefined,
        locale: 'en',
    };

    const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed || false);
    const [activeItem, setActiveItem] = useState('');

    // Handle Item Click
    const handleItemClick = (item: MenuItem) => {
        setActiveItem(item.label);
        alert(`Item "${item.label}" clicked`);
        item.onClick();
    };

    // handle toggle
    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <div>
            <SideMenu
                {...props}
                isCollapsed={isCollapsed}
                onClickToggle={handleToggle}
            >
                {createMenuItems(props.userRole === 'student').map(
                    (group, i) => (
                        <div key={i} className="flex flex-col w-full">
                            <div className="h-[1px] bg-divider my-2" />
                            {group.map((item) => (
                                <SideMenuItem
                                    key={item.label}
                                    item={{
                                        ...item,
                                        isActive: item.label === activeItem,
                                    }}
                                    onClickItem={handleItemClick}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </div>
                    ),
                )}
            </SideMenu>
        </div>
    );
};

export default WorkspaceSidebar;
