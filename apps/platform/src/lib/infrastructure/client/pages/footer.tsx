'use client';

import { platform } from '@maany_shr/e-class-models';
import { Footer as FooterComponent } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

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
            <a href="/impressum">
                <span className={linkClass}>{t('impressum')}</span>
            </a>
            <a href="/privacy-policy">
                <span className={linkClass}>{t('privacyPolicy')}</span>
            </a>
            <a href="/terms-of-use">
                <span className={linkClass}>{t('termsOfUse')}</span>
            </a>
            <a href="/rules">
                <span className={linkClass}>{t('rules')}</span>
            </a>
            <a href="/courses-information">
                <span className={linkClass}>{t('coursesInformation')}</span>
            </a>
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
            logoSrc={platform.logoUrl}
            onChangeLanguage={changeLanguage}
            footerChildren={<span>{platform.footerContent}</span>}
        >
            <FooterLinks />
        </FooterComponent>
    );
}
