'use client';

import { auth, platform } from '@maany_shr/e-class-models';
import { Navbar } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
    platform: platform.TPlatform;
    availableLocales: TLocale[];
    locale: TLocale;
    // TODO: implement session context
    session: auth.TSession | null;
}

const NavLinks = () => {
    const t = useTranslations('components.navbar');
    const linkClass =
        'hover:text-button-primary-hover-fill cursor-pointer text-md';

    // TODO: possibly use Link from Next.js
    return (
        <>
            <a href="/offers">
                <span className={linkClass}>{t('offers')}</span>
            </a>
            <a href="/coaching">
                <span className={linkClass}>{t('coaching')}</span>
            </a>
            <a href="/how-it-works">
                <span className={linkClass}>{t('howItWorks')}</span>
            </a>
            <a href="/about">
                <span className={linkClass}>{t('about')}</span>
            </a>
        </>
    );
};

export default function Header({
    platform,
    availableLocales,
    locale,
    session,
}: HeaderProps) {
    // TODO: handle notifications
    const pathname = usePathname();
    const router = useRouter();

    const changeLanguage = (newLocale: string) => {
        const newUrl = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newUrl);
    };

    return (
        <Navbar
            isLoggedIn={!!session}
            availableLocales={availableLocales}
            locale={locale}
            logo={
                <Image
                    priority
                    src={platform.logoUrl}
                    alt={platform.name}
                    width={48}
                    height={48}
                    className="w-auto h-full"
                />
            }
            onChangeLanguage={changeLanguage}
            userName={session?.user.name}
            userProfileImageSrc={session?.user.image}
        >
            <NavLinks />
        </Navbar>
    );
}
