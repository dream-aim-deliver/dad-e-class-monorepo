'use client';

import { auth, viewModels } from '@maany_shr/e-class-models';
import { Navbar } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
    platformViewModel: viewModels.TPlatformViewModel;
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
            <Link href="/offers">
                <span className={linkClass}>{t('offers')}</span>
            </Link>
            <Link href="/coaching">
                <span className={linkClass}>{t('coaching')}</span>
            </Link>
            <Link href="/how-it-works">
                <span className={linkClass}>{t('howItWorks')}</span>
            </Link>
            <Link href="/about">
                <span className={linkClass}>{t('about')}</span>
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
                    src={platformViewModel.data.logoUrl}
                    alt={platformViewModel.data.name}
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
