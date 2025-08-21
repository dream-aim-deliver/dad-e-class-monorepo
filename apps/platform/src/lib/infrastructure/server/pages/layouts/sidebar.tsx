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
} from '@maany_shr/e-class-ui-kit';
import {
    MenuItem,
    SideMenuItem,
} from 'packages/ui-kit/lib/components/sidemenu/sidemenu-item';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const WorkspaceSidebar = (props: React.ComponentProps<typeof SideMenu>) => {
    const sidebarTranslations = useTranslations('pages.sidebarLayout');
    
    const createMenuItems = (isStudent = false): MenuItem[][] => [
        [
            {
                icon: <IconDashboard />,
                label: sidebarTranslations('dashboard'),
                onClick: () => console.log('Dashboard clicked'),
                notificationCount: isStudent ? 3 : 7,
            },
            {
                icon: <IconCourse />,
                label: isStudent 
                    ? sidebarTranslations('courses') 
                    : sidebarTranslations('yourCourses'),
                onClick: () => console.log('Courses clicked'),
            },
            {
                icon: <IconCoachingSession />,
                label: isStudent 
                    ? sidebarTranslations('coachingSessions') 
                    : sidebarTranslations('yourCoachingSessions'),
                onClick: () => console.log('Coaching sessions clicked'),
            },
            {
                icon: <IconCalendarAlt />,
                label: sidebarTranslations('calendar'),
                onClick: () => console.log('Calendar clicked'),
            },
            ...(!isStudent
                ? [
                      {
                          icon: <IconGroup />,
                          label: sidebarTranslations('yourStudents'),
                          onClick: () => console.log('Students clicked'),
                          notificationCount: 2,
                      },
                      {
                          icon: <IconStar />,
                          label: sidebarTranslations('yourReviews'),
                          onClick: () => console.log('Reviews clicked'),
                      },
                  ]
                : []),
        ],
        [
            {
                icon: <IconAccountInformation />,
                label: sidebarTranslations('yourProfile'),
                onClick: () => console.log('Profile clicked'),
                notificationCount: isStudent ? 100 : 23,
            },
            {
                icon: <IconSales />,
                label: sidebarTranslations('orderPayments'),
                onClick: () => console.log('Orders & Payments clicked'),
            },
        ],
        [
            {
                icon: <IconLogOut />,
                label: sidebarTranslations('logout'),
                onClick: () => console.log('Logout clicked'),
            },
        ],
    ];

    const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed || false);
    const [activeItem, setActiveItem] = useState('');

    const handleItemClick = (item: MenuItem) => {
        setActiveItem(item.label);
        alert(`Item "${item.label}" clicked`);
        item.onClick();
    };

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <SideMenu
            {...props}
            isCollapsed={isCollapsed}
            onClickToggle={handleToggle}
        >
            {createMenuItems(props.userRole === 'student').map(
                (group, i) => (
                    <div key={i} className="flex flex-col w-full">
                        {i > 0 && <div className="h-[1px] bg-divider my-2" />}
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
    );
};

export default WorkspaceSidebar;
