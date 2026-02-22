'use client';

import { viewModels } from '@maany_shr/e-class-models';
import {
    DefaultError,
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

const FooterLinks = ({ locale }: { locale: TLocale }) => {
    const t = useTranslations('components.footer');
    const linkClass =
        'hover:text-button-primary-hover-fill cursor-pointer text-button-primary-fill text-sm';

    return (
        <>
            <Link href={`/${locale}/impressum`}>
                <span className={linkClass}>{t('impressum')}</span>
            </Link>
            <Link href={`/${locale}/privacy-policy`}>
                <span className={linkClass}>{t('privacyPolicy')}</span>
            </Link>
            <Link href={`/${locale}/terms-of-use`}>
                <span className={linkClass}>{t('termsOfUse')}</span>
            </Link>
            <Link href={`/${locale}/rules`}>
                <span className={linkClass}>{t('rules')}</span>
            </Link>
            <Link href={`/${locale}/offer-information`}>
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
    const t = useTranslations('components.footer');

    const changeLanguage = (newLocale: string) => {
        const newUrl = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newUrl);
    };

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
        <FooterComponent
            availableLocales={availableLocales}
            locale={locale}
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
            footerChildren={
                <RichTextRenderer
                    onDeserializationError={() => {
                        console.error('Error deserializing footer content');
                    }}
                    content={platformViewModel.data.footerContent}
                />
            }
        >
            <FooterLinks locale={locale} />
        </FooterComponent>
    );
}
