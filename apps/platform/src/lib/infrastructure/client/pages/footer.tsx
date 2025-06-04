'use client';

import { platform } from '@maany_shr/e-class-models';
import { Footer as FooterComponent } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
    platform: platform.TPlatform;
    availableLocales: TLocale[];
    locale: TLocale;
}

const FooterLinks = () => {
    const t = useTranslations('components.footer');
    const linkClass =
        'hover:text-button-primary-hover-fill cursor-pointer text-button-primary-fill text-sm';

    // TODO: possibly use Link from Next.js
    return (
        <>
            <Link href="/impressum">
                <span className={linkClass}>{t('impressum')}</span>
            </Link>
            <Link href="/privacy-policy">
                <span className={linkClass}>{t('privacyPolicy')}</span>
            </Link>
            <Link href="/terms-of-use">
                <span className={linkClass}>{t('termsOfUse')}</span>
            </Link>
            <Link href="/rules">
                <span className={linkClass}>{t('rules')}</span>
            </Link>
            <Link href="/courses-information">
                <span className={linkClass}>{t('coursesInformation')}</span>
            </Link>
        </>
    );
};

export default function Footer({
    platform,
    availableLocales,
    locale,
}: FooterProps) {
    const pathname = usePathname();
    const router = useRouter();

    const changeLanguage = (newLocale: string) => {
        const newUrl = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newUrl);
    };

    return (
        <FooterComponent
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
            footerChildren={<span>{platform.footerContent}</span>}
        >
            <FooterLinks />
        </FooterComponent>
    );
}
