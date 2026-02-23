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
    IconSendEmail,
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
import { signOut, useSession } from 'next-auth/react';
import { DefaultLoading } from '@maany_shr/e-class-ui-kit';

const WorkspaceSidebar = (props: React.ComponentProps<typeof SideMenu>) => {
    const { data: sessionData } = useSession();
    // Use client-side session image (reactive) over server-provided prop (static from layout)
    const profileImageUrl = sessionData?.user?.image ?? props.profileImageUrl;
    const sidebarTranslations = useTranslations('pages.sidebarLayout');
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Extract locale from props (passed from layout)
    const locale = props.locale || 'en';

    const routeMap = {
        dashboard: `/${locale}/workspace/dashboard`,
        courses: `/${locale}/workspace/courses`,
        coachingSessions: `/${locale}/workspace/coaching-sessions`,
        calendar: `/${locale}/workspace/calendar`,
        students: `/${locale}/workspace/students`,
        reviews: `/${locale}/workspace/your-reviews`,
        notifications: `/${locale}/workspace/notifications`,
        profile: `/${locale}/workspace/profile`,
        orderPayments: `/${locale}/workspace/billing`,
    };

    // Create dynamic route mapping based on current locale
    const createRouteToLabelMap = (currentLocale: string) => {
        const isStudent = props.userRole === 'student';
        const baseRoutes = {
            '/workspace/dashboard': sidebarTranslations('dashboard'),
            '/workspace': sidebarTranslations('dashboard'),
            '/workspace/courses': isStudent
                ? sidebarTranslations('courses')
                : sidebarTranslations('yourCourses'),
            '/workspace/coaching-sessions': isStudent
                ? sidebarTranslations('coachingSessions')
                : sidebarTranslations('yourCoachingSessions'),
            '/workspace/calendar': sidebarTranslations('calendar'),
            '/workspace/students': sidebarTranslations('yourStudents'),
            '/workspace/your-reviews': sidebarTranslations('yourReviews'),
            '/workspace/notifications': sidebarTranslations('notifications'),
            '/workspace/profile': sidebarTranslations('yourProfile'),
            '/workspace/billing': sidebarTranslations('orderPayments'),
            '/workspace/pre-course-assessment': 'Pre-Course Assessment',
        };

        // Create mapping with and without locale prefix
        const routeMap: { [key: string]: string } = {};

        Object.entries(baseRoutes).forEach(([path, label]) => {
            routeMap[path] = label; // Without locale prefix
            routeMap[`/${currentLocale}${path}`] = label; // With locale prefix
        });

        return routeMap;
    };

    const routeToLabelMap = createRouteToLabelMap(locale);

    const createMenuItems = (): MenuItem[][] => {
        const isStudent = props.userRole === 'student';
        const isAdmin = props.userRole === 'admin';
        return [
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
                {
                    icon: <IconSendEmail />,
                    label: sidebarTranslations('notifications'),
                    onClick: () => router.push(routeMap.notifications),
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
                    onClick: async () => {
                        try {
                            setIsLoggingOut(true);
                            await signOut({ callbackUrl: `/${locale}/` });
                        } catch (error) {
                            console.error('Logout failed:', error);
                            setIsLoggingOut(false);
                        }
                    },
                },
            ],
        ];
    };

    const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed || false);
    const [activeItem, setActiveItem] = useState('');

    // Sync activeItem with current pathname
    useEffect(() => {
        // Try exact match with full pathname first
        let currentLabel = routeToLabelMap[pathname];

        // If no match, try without locale prefix
        if (!currentLabel) {
            const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
            currentLabel = routeToLabelMap[pathWithoutLocale];
        }

        if (currentLabel) {
            setActiveItem(currentLabel);
        } else {
            // Clear active item if no match found
            setActiveItem('');
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
        <>
            <SideMenu
                {...props}
                profileImageUrl={profileImageUrl}
                isCollapsed={isCollapsed}
                onClickToggle={handleToggle}
            >
                {createMenuItems().map((group, i) => (
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
                ))}
            </SideMenu>

            {/* Logout Loading Overlay */}
            {isLoggingOut && (
                <DefaultLoading locale={locale} variant="overlay" />
            )}
        </>
    );
};

export default WorkspaceSidebar;
