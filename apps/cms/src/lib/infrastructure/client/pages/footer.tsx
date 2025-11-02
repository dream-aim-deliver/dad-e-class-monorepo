'use client';

import { viewModels } from '@maany_shr/e-class-models';
import {
    Footer as FooterComponent,
    RichTextRenderer,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
    platformViewModel: viewModels.TGetPlatformViewModel;
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
            <Link href="/offer-information">
                <span className={linkClass}>{t('coursesInformation')}</span>
            </Link>
        </>
    );
};

export default function Footer({
    platformViewModel,
    availableLocales,
    locale,
}: FooterProps) {
    const pathname = usePathname();
    const router = useRouter();

    const changeLanguage = (newLocale: string) => {
        const newUrl = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newUrl);
    };

    if (platformViewModel.mode !== 'default') return null;

    return (
        <FooterComponent
            availableLocales={availableLocales}
            locale={locale}
            logo={
                <Image
                    priority
                    src={platformViewModel.data.logo?.downloadUrl || ''}
                    alt={platformViewModel.data.name}
                    width={48}
                    height={48}
                    className="w-auto h-full"
                />
            }
            onChangeLanguage={changeLanguage}
            footerChildren={
                <RichTextRenderer
                    onDeserializationError={() => {
                        console.error('Error deserializing footer content');
                    }}
                    content={platformViewModel.data.footerContent}
                />
            }
        >
            <FooterLinks />
        </FooterComponent>
    );
}
