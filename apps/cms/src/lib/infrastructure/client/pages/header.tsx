'use client';

import { auth, viewModels } from '@maany_shr/e-class-models';
import { ConfirmationModal, Navbar } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface HeaderProps {
    availableLocales: TLocale[];
    locale: TLocale;
    session: auth.TSession | null;
}

const NavLinks = ({
    locale,
    pathname,
    isSuperAdmin,
}: {
    locale: TLocale;
    pathname: string;
    isSuperAdmin: boolean;
}) => {
    if (!isSuperAdmin) {
        return null;
    }

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
    const pathname = usePathname();
    const router = useRouter();
    const { update } = useSession();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const t = useTranslations('components.cmsNavbar');
    const tPlatformNavbar = useTranslations('components.navbar');
    const tLogoutConfirmation = useTranslations('components.logoutConfirmation');
    const isSuperAdmin = session?.user?.roles?.includes('superadmin') ?? false;
    const changeLanguage = (newLocale: string) => {
        const newUrl = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newUrl);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = useCallback(async () => {
        setIsLoggingOut(true);
        setShowLogoutModal(false);

        // Step 1: Attempt to refresh token to get valid id_token_hint for federated logout
        // This makes federated logout smoother (no Auth0 confirmation page)
        // If refresh fails, we still proceed - the API route handles it gracefully
        let tokenRefreshed = false;
        try {
            await update();
            tokenRefreshed = true;
        } catch (error) {
            // This is expected if session is already expired
            // We still proceed with federated logout to ensure clean state
            console.log('[Header] Token refresh failed (session may be expired), proceeding with federated logout');
        }

        // Step 2: Logout locally (clear NextAuth session)
        await signOut({ redirect: false });

        // Step 3: Federated logout - clears Auth0 session completely
        // Even without valid id_token_hint, Auth0 will still process the logout
        console.log(`[Header] Redirecting to federated logout (token refreshed: ${tokenRefreshed})`);
        router.push(`/api/auth/logout?returnTo=/${locale}/auth/login`);
    }, [update, locale, router]);

    // CMS-specific dropdown options
    const dropdownOptions = [
        {
            label: tPlatformNavbar('logout'),
            value: 'logout',
        },
    ];

    const handleDropdownSelection = (selected: string) => {
        if (selected === 'manageUsers' && isSuperAdmin) {
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
                showNotifications={false}
            >
                <NavLinks locale={locale} pathname={pathname} isSuperAdmin={isSuperAdmin} />
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
