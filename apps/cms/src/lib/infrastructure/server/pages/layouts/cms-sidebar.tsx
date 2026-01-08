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

    // Base paths
    const platformBase = `/${locale}/platform/${platformSlug}`;
    const platformLocaleBase = `${platformBase}/${platformLocale}`;

    const routeMap = {
        // Locale-scoped pages (no platformLocale in the path)
        allCourses: `${platformLocaleBase}/courses`,
        users: `${platformLocaleBase}/users`,
        transactions: `${platformLocaleBase}/transactions`,
        notifications: `${platformLocaleBase}/notifications`,

        // Platform-locale scoped pages
        packages: `${platformLocaleBase}/packages`,
        categories: `${platformLocaleBase}/manage-categories`,
        topics: `${platformLocaleBase}/manage-topics`,
        preCourseAssessment: `${platformLocaleBase}/pre-course-assessment-form`,
        legalTexts: `${platformLocaleBase}/manage-legal-texts`,
        coachingOffering: `${platformLocaleBase}/coaching-offering`,
        coachingSessions: `${platformLocaleBase}/coaching-sessions`,
        coupons: `${platformLocaleBase}/coupons`,
        sendNotification: `${platformLocaleBase}/send-notification`,
        settings: `${platformLocaleBase}/settings`,
        homepage: `${platformLocaleBase}/manage-homepage`,
        offers: `${platformLocaleBase}/manage-offers-page`,
        coaching: `${platformLocaleBase}/manage-coaching-page`,
        aboutPage: `${platformLocaleBase}/manage-about-page`,
        footer: `${platformLocaleBase}/manage-footer`,
    };

    // Create dynamic route to label mapping
    const routeToLabelMap: { [key: string]: string } = {
        [routeMap.allCourses]: t('allCourses'),
        [routeMap.packages]: t('packages'),
        [routeMap.categories]: t('categories'),
        [routeMap.topics]: t('topics'),
        [routeMap.preCourseAssessment]: t('preCourseAssessmentForm'),
        [routeMap.legalTexts]: t('legalTexts'),
        [routeMap.coachingOffering]: t('coachingOffering'),
        [routeMap.coachingSessions]: t('coachingSessions'),
        [routeMap.coupons]: t('coupons'),
        [routeMap.users]: t('users'),
        [routeMap.transactions]: t('transactions'),
        [routeMap.notifications]: t('notifications'),
        [routeMap.settings]: t('settings'),
        [routeMap.homepage]: t('homepage'),
        [routeMap.offers]: t('offers'),
        [routeMap.coaching]: t('coaching'),
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
                    label: t('legalTexts'),
                    onClick: () => router.push(routeMap.legalTexts),
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
                    label: t('notifications'),
                    onClick: () => router.push(routeMap.notifications),
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
                icon: <IconCoachingOffer />,
                label: t('coaching'),
                onClick: () => router.push(routeMap.coaching),
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
        } else {
            // Clear active item if no match found
            setActiveItem('');
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
