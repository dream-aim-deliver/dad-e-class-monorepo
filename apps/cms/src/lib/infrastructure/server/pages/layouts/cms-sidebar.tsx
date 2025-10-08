'use client';
import {
    IconAccountInformation,
    IconCoachingOffer,
    IconCoachingSession,
    IconCourse,
    IconDashboard,
    IconEdit,
    IconFile,
    IconGroup,
    IconSales,
    SideMenuCMS,
    SideMenuItem,
    SideMenuSection,
} from '@maany_shr/e-class-ui-kit';
import { MenuItem } from 'packages/ui-kit/lib/components/sidemenu/sidemenu-item';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TLocale } from '@maany_shr/e-class-translations';

interface CMSSidebarProps {
    platformName: string;
    platformLogoUrl?: string;
    platformSlug: string;
    platformLocale: string;
    locale: TLocale;
}

const CMSSidebar = ({
    platformName,
    platformLogoUrl,
    platformSlug,
    platformLocale,
    locale,
}: CMSSidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    // Base path for all CMS routes
    const basePath = `/${locale}/platform/${platformSlug}/${platformLocale}`;

    const routeMap = {
        allCourses: `${basePath}/courses`,
        packages: `${basePath}/packages`,
        categories: `${basePath}/categories`,
        topics: `${basePath}/manage-topics`,
        preCourseAssessment: `${basePath}/pre-course-assessment-form`,
        termsConditions: `${basePath}/terms-conditions-form`,
        coachingOffering: `${basePath}/coaching-offering`,
        coachingSessions: `${basePath}/coaching-sessions`,
        coachSkills: `${basePath}/coach-skills-form`,
        coupons: `${basePath}/coupons`,
        users: `${basePath}/users`,
        transactions: `${basePath}/transactions`,
        sendNotification: `${basePath}/send-notification`,
        settings: `${basePath}/settings`,
        homepage: `${basePath}/homepage`,
        offers: `${basePath}/offers`,
        aboutPage: `${basePath}/about`,
        footer: `${basePath}/footer`,
    };

    // Create dynamic route to label mapping
    const routeToLabelMap: { [key: string]: string } = {
        [routeMap.allCourses]: 'All Courses',
        [routeMap.packages]: 'Packages',
        [routeMap.categories]: 'Categories',
        [routeMap.topics]: 'Topics',
        [routeMap.preCourseAssessment]: 'Pre-Course Assessment form',
        [routeMap.termsConditions]: 'Terms & Conditions form',
        [routeMap.coachingOffering]: 'Coaching offering',
        [routeMap.coachingSessions]: 'Coaching sessions',
        [routeMap.coachSkills]: 'Coach skills form',
        [routeMap.coupons]: 'Coupons',
        [routeMap.users]: 'Users',
        [routeMap.transactions]: 'Transactions',
        [routeMap.sendNotification]: 'Send Notification',
        [routeMap.settings]: 'Settings',
        [routeMap.homepage]: 'Homepage',
        [routeMap.offers]: 'Offers',
        [routeMap.aboutPage]: 'About Page',
        [routeMap.footer]: 'Footer',
    };

    const createMainMenuItems = (): MenuItem[][] => {
        return [
            // Main content management items
            [
                {
                    icon: <IconCourse />,
                    label: 'All Courses',
                    onClick: () => router.push(routeMap.allCourses),
                    notificationCount: 18,
                },
                {
                    icon: <IconDashboard />,
                    label: 'Packages',
                    onClick: () => router.push(routeMap.packages),
                    notificationCount: 2,
                },
                {
                    icon: <IconDashboard />,
                    label: 'Categories',
                    onClick: () => router.push(routeMap.categories),
                    notificationCount: 3,
                },
                {
                    icon: <IconDashboard />,
                    label: 'Topics',
                    onClick: () => router.push(routeMap.topics),
                    notificationCount: 12,
                },
                {
                    icon: <IconEdit />,
                    label: 'Pre-Course Assessment form',
                    onClick: () => router.push(routeMap.preCourseAssessment),
                },
                {
                    icon: <IconFile />,
                    label: 'Terms & Conditions form',
                    onClick: () => router.push(routeMap.termsConditions),
                },
            ],
            // Coaching section
            [
                {
                    icon: <IconCoachingOffer />,
                    label: 'Coaching offering',
                    onClick: () => router.push(routeMap.coachingOffering),
                    notificationCount: 8,
                },
                {
                    icon: <IconCoachingSession />,
                    label: 'Coaching sessions',
                    onClick: () => router.push(routeMap.coachingSessions),
                },
                {
                    icon: <IconEdit />,
                    label: 'Coach skills form',
                    onClick: () => router.push(routeMap.coachSkills),
                },
            ],
            // Other management items
            [
                {
                    icon: <IconSales />,
                    label: 'Coupons',
                    onClick: () => router.push(routeMap.coupons),
                    notificationCount: 23,
                },
                {
                    icon: <IconGroup />,
                    label: 'Users',
                    onClick: () => router.push(routeMap.users),
                },
                {
                    icon: <IconSales />,
                    label: 'Transactions',
                    onClick: () => router.push(routeMap.transactions),
                },
                {
                    icon: <IconEdit />,
                    label: 'Send Notification',
                    onClick: () => router.push(routeMap.sendNotification),
                },
                {
                    icon: <IconAccountInformation />,
                    label: 'Settings',
                    onClick: () => router.push(routeMap.settings),
                },
            ],
        ];
    };

    // Website content section items
    const createWebsiteContentItems = (): MenuItem[] => {
        return [
            {
                icon: <IconGroup />,
                label: 'Homepage',
                onClick: () => router.push(routeMap.homepage),
            },
            {
                icon: <IconSales />,
                label: 'Offers',
                onClick: () => router.push(routeMap.offers),
            },
            {
                icon: <IconFile />,
                label: 'About Page',
                onClick: () => router.push(routeMap.aboutPage),
            },
            {
                icon: <IconFile />,
                label: 'Footer',
                onClick: () => router.push(routeMap.footer),
            },
        ];
    };

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('');

    // Sync activeItem with current pathname
    useEffect(() => {
        const currentLabel = routeToLabelMap[pathname];
        if (currentLabel) {
            setActiveItem(currentLabel);
        }
    }, [pathname]);

    const handleItemClick = (item: MenuItem) => {
        setActiveItem(item.label);
        item.onClick();
    };

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <SideMenuCMS
            platformName={platformName}
            platformLogoUrl={platformLogoUrl}
            isCollapsed={isCollapsed}
            onClickToggle={handleToggle}
        >
            {createMainMenuItems().map((group, i) => (
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
            ))}

            {/* Website Content Section */}
            <div className="h-[1px] bg-divider my-2" />
            <SideMenuSection title="Website content" isCollapsed={isCollapsed}>
                {createWebsiteContentItems().map((item) => (
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
            </SideMenuSection>
        </SideMenuCMS>
    );
};

export default CMSSidebar;
