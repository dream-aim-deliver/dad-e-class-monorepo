'use client';

import { auth, viewModels } from '@maany_shr/e-class-models';
import { ConfirmationModal, Navbar } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
    availableLocales: TLocale[];
    locale: TLocale;
    session: auth.TSession | null;
}

const NavLinks = ({
    locale,
    pathname,
}: {
    locale: TLocale;
    pathname: string;
}) => {
    const t = useTranslations('components.cmsNavbar');

    // Route mapping for header navigation
    const routes = {
        manageUsers: '/users',
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

    return (
        <Link href="/users">
            <span className={getLinkClass(routes.manageUsers)}>
                {t('manageUsers')}
            </span>
        </Link>
    );
};

export default function Header({
    availableLocales,
    locale,
    session,
}: HeaderProps) {
    // TODO: handle notifications
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const t = useTranslations('components.cmsNavbar');
    const tPlatformNavbar = useTranslations('components.navbar');
    const tLogoutConfirmation = useTranslations('components.logoutConfirmation');
    const changeLanguage = (newLocale: string) => {
        const newUrl = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newUrl);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        setShowLogoutModal(false);
        // Redirect to server-side logout API that handles OIDC logout with id_token_hint
        router.push(`/api/auth/logout?returnTo=/${locale}/auth/login`);
    };

    // CMS-specific dropdown options
    const dropdownOptions = [
        {
            label: t('manageUsers'),
            value: 'manageUsers',
        },
        {
            label: tPlatformNavbar('logout'),
            value: 'logout',
        },
    ];

    const handleDropdownSelection = (selected: string) => {
        if (selected === 'manageUsers') {
            router.push(`/${locale}/users`);
        }
    };

    return (
        <>
            <Navbar
                isLoggedIn={!!session}
                availableLocales={availableLocales}
                locale={locale}
                logo={<span className="text-xl font-semibold">E-Class CMS</span>}
                onChangeLanguage={changeLanguage}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
                userName={session?.user.name}
                userProfileImageSrc={session?.user.image}
                dropdownOptions={dropdownOptions}
                onDropdownSelection={handleDropdownSelection}
                dropdownTriggerText={''}
            >
                <NavLinks locale={locale} pathname={pathname} />
            </Navbar>

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
}
