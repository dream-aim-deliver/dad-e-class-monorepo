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
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const WorkspaceSidebar = (props: React.ComponentProps<typeof SideMenu>) => {
    const sidebarTranslations = useTranslations('pages.sidebarLayout');
    const router = useRouter();
    const pathname = usePathname();
    
    // Extract locale from props (passed from layout)
    const locale = props.locale || 'en';

    const routeMap = {
        dashboard: '/workspace/dashboard',
        courses: '/workspace/courses',
        coachingSessions: '/workspace/coaching',
        calendar: '/workspace/calendar',
        students: '/workspace/students',
        reviews: '/workspace/reviews',
        profile: '/workspace/profile',
        orderPayments: '/workspace/orders',
    };

    // Create dynamic route mapping based on current locale
    const createRouteToLabelMap = (currentLocale: string) => {
        const isStudent = props.userRole === 'student';
        const baseRoutes = {
            '/': sidebarTranslations('dashboard'),
            '/workspace/courses': isStudent 
                ? sidebarTranslations('courses') 
                : sidebarTranslations('yourCourses'),
            '/coaching': isStudent 
                ? sidebarTranslations('coachingSessions') 
                : sidebarTranslations('yourCoachingSessions'),
            '/calendar': sidebarTranslations('calendar'),
            '/workspace/students': sidebarTranslations('yourStudents'),
            '/workspace/reviews': sidebarTranslations('yourReviews'),
            '/profile': sidebarTranslations('yourProfile'),
            '/orders': sidebarTranslations('orderPayments'),
        };

        // Create mapping with and without locale prefix
        const routeMap: { [key: string]: string } = {};
        
        Object.entries(baseRoutes).forEach(([path, label]) => {
            routeMap[path] = label; // Without locale prefix
            routeMap[`/${currentLocale}${path === '/' ? '' : path}`] = label; // With locale prefix
        });
        
        return routeMap;
    };

    const routeToLabelMap = createRouteToLabelMap(locale);
    
    const createMenuItems = (isStudent = false): MenuItem[][] => [
        [
            {
                icon: <IconDashboard />,
                label: sidebarTranslations('dashboard'),
                onClick: () => router.push(routeMap.dashboard),
            },
            {
                icon: <IconCourse />,
                label: isStudent 
                    ? sidebarTranslations('courses') 
                    : sidebarTranslations('yourCourses'),
                onClick: () => router.push(routeMap.courses),
            },
            {
                icon: <IconCoachingSession />,
                label: isStudent 
                    ? sidebarTranslations('coachingSessions') 
                    : sidebarTranslations('yourCoachingSessions'),
                onClick: () => router.push(routeMap.coachingSessions),
            },
            {
                icon: <IconCalendarAlt />,
                label: sidebarTranslations('calendar'),
                onClick: () => router.push(routeMap.calendar),
            },
            ...(!isStudent
                ? [
                      {
                          icon: <IconGroup />,
                          label: sidebarTranslations('yourStudents'),
                          onClick: () => router.push(routeMap.students),
                      },
                      {
                          icon: <IconStar />,
                          label: sidebarTranslations('yourReviews'),
                          onClick: () => router.push(routeMap.reviews),
                      },
                  ]
                : []),
        ],
        [
            {
                icon: <IconAccountInformation />,
                label: sidebarTranslations('yourProfile'),
                onClick: () => router.push(routeMap.profile),
            },
            {
                icon: <IconSales />,
                label: sidebarTranslations('orderPayments'),
                onClick: () => router.push(routeMap.orderPayments),
            },
        ],
        [
            {
                icon: <IconLogOut />,
                label: sidebarTranslations('logout'),
                onClick: () => {
                    signOut({ callbackUrl: `/${locale}/` });
                },
            },
        ],
    ];

    const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed || false);
    const [activeItem, setActiveItem] = useState('');

    // Sync activeItem with current pathname
    useEffect(() => {
        let currentLabel = routeToLabelMap[pathname];
        
        // If no direct match, try to extract locale from pathname and match without it
        if (!currentLabel) {
            const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
            currentLabel = routeToLabelMap[pathWithoutLocale || '/'];
        }
        
        if (currentLabel) {
            setActiveItem(currentLabel);
        }
    }, [pathname, routeToLabelMap]);

    const handleItemClick = (item: MenuItem) => {
        setActiveItem(item.label);
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
