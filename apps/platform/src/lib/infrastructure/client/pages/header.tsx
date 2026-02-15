'use client';

import { auth, viewModels } from '@maany_shr/e-class-models';
import { DefaultError, Navbar } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { trpc } from '../trpc/cms-client';
import { useCountUnreadNotificationsPresenter } from '../hooks/use-count-unread-notifications-presenter';

interface HeaderProps {
    platformViewModel: viewModels.TGetPlatformViewModel;
    availableLocales: TLocale[];
    locale: TLocale;
    // TODO: implement session context
    session: auth.TSession | null;
}

const NavLinks = ({
    locale,
    pathname,
}: {
    locale: TLocale;
    pathname: string;
}) => {
    const t = useTranslations('components.navbar');

    // Route mapping for header navigation
    const routes = {
        offers: '/offers',
        coaching: '/coaching',
        about: '/about',
    };

    // Check if current path matches a route (with or without locale prefix)
    const isActiveRoute = (route: string) => {
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
        const routeWithLocale = `/${locale}${route}`;
        return pathname === routeWithLocale || pathWithoutLocale === route;
    };

    const getLinkClass = (route: string) => {
        const baseClass = 'cursor-pointer text-md transition-colors';
        const isActive = isActiveRoute(route);
        return isActive
            ? `${baseClass} text-button-primary-fill font-semibold`
            : `${baseClass} text-text-primary hover:text-button-primary-hover-fill`;
    };

    // TODO: possibly use Link from Next.js
    return (
        <>
            <Link href={`/${locale}/offers`}>
                <span className={getLinkClass(routes.offers)}>
                    {t('offers')}
                </span>
            </Link>
            <Link href={`/${locale}/coaching`}>
                <span className={getLinkClass(routes.coaching)}>
                    {t('coaching')}
                </span>
            </Link>
            <Link href={`/${locale}/about`}>
                <span className={getLinkClass(routes.about)}>{t('about')}</span>
            </Link>
        </>
    );
};

export default function Header({
    platformViewModel,
    availableLocales,
    locale,
    session,
}: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const t = useTranslations('components.navbar');

    const changeLanguage = (newLocale: string) => {
        const newUrl = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newUrl);
    };

    const handleLogin = () => {
        const callbackUrl = encodeURIComponent(pathname);
        router.push(`/${locale}/auth/login?callbackUrl=${callbackUrl}`);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // Redirect to homepage instead of login page to avoid auto-login issue
        await signOut({ callbackUrl: `/${locale}/` });
    };

    // Platform-specific dropdown options
    const dropdownOptions = [
        {
            label: t('yourCourses'), // TODO: Change for Dashboard title
            value: 'dashboard',
        },
        {
            label: t('yourProfile'),
            value: 'yourProfile',
        },
        {
            label: t('logout'),
            value: 'logout',
        },
    ];

    const handleDropdownSelection = (selected: string) => {
        if (selected === 'dashboard') {
            router.push(`/${locale}/workspace/courses`);
        } else if (selected === 'yourProfile') {
            router.push(`/${locale}/workspace/profile`);
        }
        // logout is handled by the Navbar component itself
    };

    const handleNotificationClick = () => {
        router.push(`/${locale}/workspace/notifications`);
    };

    const [unreadCountViewModel, setUnreadCountViewModel] = useState<
        viewModels.TCountUnreadNotificationsViewModel | undefined
    >(undefined);

    const { data: unreadCountResponse } =
        trpc.countUnreadNotifications.useQuery(
            {},
            {
                enabled: !!session,
                refetchInterval: 30000,
            },
        );

    const { presenter: unreadCountPresenter } =
        useCountUnreadNotificationsPresenter(setUnreadCountViewModel);

    if (unreadCountResponse) {
        // @ts-ignore
        unreadCountPresenter.present(unreadCountResponse, unreadCountViewModel);
    }

    if (platformViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    return (
        <Navbar
            isLoggedIn={!!session}
            availableLocales={availableLocales}
            locale={locale}
            onLogin={handleLogin}
            logo={
                platformViewModel.data.logo?.downloadUrl ? (
                    <Image
                        priority
                        src={platformViewModel.data.logo.downloadUrl}
                        alt={platformViewModel.data.name}
                        width={48}
                        height={48}
                        className="w-auto h-full"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-600">
                            {platformViewModel.data.name[0]?.toUpperCase() || 'P'}
                        </span>
                    </div>
                )
            }
            onChangeLanguage={changeLanguage}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            userName={session?.user.name}
            userProfileImageSrc={session?.user.image}
            dropdownOptions={dropdownOptions}
            onDropdownSelection={handleDropdownSelection}
            dropdownTriggerText={t('workspace')}
            onNotificationClick={handleNotificationClick}
            showNotifications={true}
            notificationCount={
                unreadCountViewModel?.mode === 'default'
                    ? unreadCountViewModel.data.count
                    : 0
            }
        >
            <NavLinks locale={locale} pathname={pathname} />
        </Navbar>
    );
}
