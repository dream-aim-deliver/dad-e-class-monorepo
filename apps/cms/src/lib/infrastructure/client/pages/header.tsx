'use client';

import { auth, viewModels } from '@maany_shr/e-class-models';
import { Navbar } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
    platformViewModel: viewModels.TPlatformViewModel;
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
    const t = useTranslations('components.cmsNavbar');

    // Route mapping for header navigation
    const routes = {
        manageUsers: '/users',
        coaching: '/coaching',
        howItWorks: '/how-it-works',
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
            <Link href="/users">
                <span className={getLinkClass(routes.manageUsers)}>
                    {t('manageUsers')}
                </span>
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
    // TODO: handle notifications
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const changeLanguage = (newLocale: string) => {
        const newUrl = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newUrl);
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut({ callbackUrl: `/${locale}/` });
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    if (platformViewModel.mode !== 'default') return null;

    return (
        <Navbar
            isLoggedIn={!!session}
            availableLocales={availableLocales}
            locale={locale}
            logo={
                <Image
                    priority
                    src={platformViewModel.data.logoUrl}
                    alt={platformViewModel.data.name}
                    width={48}
                    height={48}
                    className="w-auto h-full"
                />
            }
            onChangeLanguage={changeLanguage}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            userName={session?.user.name}
            userProfileImageSrc={session?.user.image}
            router={router}
        >
            <NavLinks locale={locale} pathname={pathname} />
        </Navbar>
    );
}
