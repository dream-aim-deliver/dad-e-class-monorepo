'use client';
import {
    ConfirmationModal,
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
import { DefaultLoading } from '@maany_shr/e-class-ui-kit';

const WorkspaceSidebar = (props: React.ComponentProps<typeof SideMenu>) => {
    const sidebarTranslations = useTranslations('pages.sidebarLayout');
    const tLogoutConfirmation = useTranslations('components.logoutConfirmation');
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Extract locale from props (passed from layout)
    const locale = props.locale || 'en';

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        setShowLogoutModal(false);
        // Redirect to server-side logout API that handles OIDC logout with id_token_hint
        router.push(`/api/auth/logout?returnTo=/${locale}/auth/login`);
    };

    const routeMap = {
        dashboard: '/workspace/dashboard',
        courses: '/workspace/courses',
        preCourseAssessment: '/workspace/pre-course-assessment',
        coachingSessions: '/workspace/coaching',
        calendar: '/workspace/calendar',
        students: '/workspace/students',
        reviews: '/workspace/your-reviews',
        profile: '/workspace/profile',
        orderPayments: '/workspace/orders',
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
            '/workspace/coaching': isStudent
                ? sidebarTranslations('coachingSessions')
                : sidebarTranslations('yourCoachingSessions'),
            '/workspace/calendar': sidebarTranslations('calendar'),
            '/workspace/students': sidebarTranslations('yourStudents'),
            '/workspace/your-reviews': sidebarTranslations('yourReviews'),
            '/workspace/profile': sidebarTranslations('yourProfile'),
            '/workspace/orders': sidebarTranslations('orderPayments'),
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
                ...(isAdmin
                    ? [
                          {
                              icon: <IconStar />,
                              label: 'Pre-Course Assessment',
                              onClick: () =>
                                  router.push(routeMap.preCourseAssessment),
                          },
                      ]
                    : []),
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
                        setShowLogoutModal(true);
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

            <ConfirmationModal
                type="accept"
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
                isLoading={isLoggingOut}
                title={tLogoutConfirmation('title')}
                message={tLogoutConfirmation('message')}
                confirmText={tLogoutConfirmation('confirmButton')}
                locale={locale}
            />
        </>
    );
};

export default WorkspaceSidebar;
