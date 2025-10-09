'use client';
import {
    IconCoachingOffer,
    IconCoachingSession,
    IconCourse,
    IconGroup,
    SideMenuCMS,
    SideMenuItem,
    SideMenuSection,
    IconPackageCourseBundle,
    IconCategory,
    IconNotes,
    IconTopic,
    IconPreCourseAssessmentForm,
    IconCoachSkillForm,
    IconCoupon,
    IconPayments,
    IconSendEmail,
    IconSettings,
    IconHome,
    IconOffersPage,
    IconFaq,
    IconFooter,
} from '@maany_shr/e-class-ui-kit';
import { MenuItem } from 'packages/ui-kit/lib/components/sidemenu/sidemenu-item';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TLocale } from '@maany_shr/e-class-translations';
import { useTranslations } from 'next-intl';

interface CMSSidebarProps {
    platformName: string;
    platformLogoUrl?: string;
    platformSlug: string;
    platformLocale: string;
    locale: TLocale;
    availableLocales?: TLocale[];
    onChangeLanguage?: (locale: TLocale) => void;
}

const CMSSidebar = ({
    platformName,
    platformLogoUrl,
    platformSlug,
    platformLocale,
    locale,
    availableLocales = ['en', 'de'],
    onChangeLanguage,
}: CMSSidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('pages.cmsSidebarLayout');

    const handleLanguageChange = (newLocale: TLocale) => {
        if (onChangeLanguage) {
            onChangeLanguage(newLocale);
        } else {
            // URL structure: /{locale}/platform/{platformSlug}/{platformLocale}/...
            const pathSegments = pathname.split('/');
            // Replace the platformLocale (index 4) with the new locale
            pathSegments[4] = newLocale;
            router.push(pathSegments.join('/'));
        }
    };

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
        [routeMap.allCourses]: t('allCourses'),
        [routeMap.packages]: t('packages'),
        [routeMap.categories]: t('categories'),
        [routeMap.topics]: t('topics'),
        [routeMap.preCourseAssessment]: t('preCourseAssessmentForm'),
        [routeMap.termsConditions]: t('termsConditionsForm'),
        [routeMap.coachingOffering]: t('coachingOffering'),
        [routeMap.coachingSessions]: t('coachingSessions'),
        [routeMap.coachSkills]: t('coachSkillsForm'),
        [routeMap.coupons]: t('coupons'),
        [routeMap.users]: t('users'),
        [routeMap.transactions]: t('transactions'),
        [routeMap.sendNotification]: t('sendNotification'),
        [routeMap.settings]: t('settings'),
        [routeMap.homepage]: t('homepage'),
        [routeMap.offers]: t('offers'),
        [routeMap.aboutPage]: t('aboutPage'),
        [routeMap.footer]: t('footer'),
    };

    const createMainMenuItems = (): MenuItem[][] => {
        return [
            // Main content management items
            [
                {
                    icon: <IconCourse />,
                    label: t('allCourses'),
                    onClick: () => router.push(routeMap.allCourses),
                },
                {
                    icon: <IconPackageCourseBundle />,
                    label: t('packages'),
                    onClick: () => router.push(routeMap.packages),
                },
                {
                    icon: <IconCategory />,
                    label: t('categories'),
                    onClick: () => router.push(routeMap.categories),
                },
                {
                    icon: <IconTopic />,
                    label: t('topics'),
                    onClick: () => router.push(routeMap.topics),
                },
                {
                    icon: <IconPreCourseAssessmentForm />,
                    label: t('preCourseAssessmentForm'),
                    onClick: () => router.push(routeMap.preCourseAssessment),
                },
                {
                    icon: <IconNotes />,
                    label: t('termsConditionsForm'),
                    onClick: () => router.push(routeMap.termsConditions),
                },
            ],
            // Coaching section
            [
                {
                    icon: <IconCoachingOffer />,
                    label: t('coachingOffering'),
                    onClick: () => router.push(routeMap.coachingOffering),
                },
                {
                    icon: <IconCoachingSession />,
                    label: t('coachingSessions'),
                    onClick: () => router.push(routeMap.coachingSessions),
                },
                {
                    icon: <IconCoachSkillForm />,
                    label: t('coachSkillsForm'),
                    onClick: () => router.push(routeMap.coachSkills),
                },
            ],
            // Other management items
            [
                {
                    icon: <IconCoupon />,
                    label: t('coupons'),
                    onClick: () => router.push(routeMap.coupons),
                },
                {
                    icon: <IconGroup />,
                    label: t('users'),
                    onClick: () => router.push(routeMap.users),
                },
                {
                    icon: <IconPayments />,
                    label: t('transactions'),
                    onClick: () => router.push(routeMap.transactions),
                },
                {
                    icon: <IconSendEmail />,
                    label: t('sendNotification'),
                    onClick: () => router.push(routeMap.sendNotification),
                },
                {
                    icon: <IconSettings />,
                    label: t('settings'),
                    onClick: () => router.push(routeMap.settings),
                },
            ],
        ];
    };

    // Website content section items
    const createWebsiteContentItems = (): MenuItem[] => {
        return [
            {
                icon: <IconHome />,
                label: t('homepage'),
                onClick: () => router.push(routeMap.homepage),
            },
            {
                icon: <IconOffersPage />,
                label: t('offers'),
                onClick: () => router.push(routeMap.offers),
            },
            {
                icon: <IconFaq />,
                label: t('aboutPage'),
                onClick: () => router.push(routeMap.aboutPage),
            },
            {
                icon: <IconFooter />,
                label: t('footer'),
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
            locale={platformLocale as TLocale}
            availableLocales={availableLocales}
            onChangeLanguage={handleLanguageChange}
        >
            {createMainMenuItems().map((group, i) => (
                <div key={i} className="flex flex-col w-full">
                    <div className="h-[1px] bg-divider my-1" />
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
            <div className="h-[1px] bg-divider" />
            <SideMenuSection
                title={t('websiteContentSection')}
                isCollapsed={isCollapsed}
            >
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
