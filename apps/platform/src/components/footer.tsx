'use client';

import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { usePathname, useRouter } from 'next/navigation';
import { Footer as FooterComponent } from '@maany_shr/e-class-ui-kit';
import { getLogo } from './mock/queries';
import { useTranslations } from 'next-intl';

export type FooterProps = isLocalAware & {
  availableLocales: TLocale[];
};

const FooterLinks = () => {
  const t = useTranslations('components.footer');
  const linkClass = 'hover:text-button-primary-hover-fill cursor-pointer text-button-primary-fill text-sm';

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

const FooterCompanyInfo = () => {
  const t = useTranslations('components.footer');
  return <span>{t('companyInfo')}</span>;
};

export default function Footer(props: FooterProps) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    const newUrl = pathname.replace(`/${props.locale}`, `/${newLocale}`);
    router.push(newUrl);
  };

  const logo = getLogo();

  return <FooterComponent locale={props.locale} availableLocales={props.availableLocales}
                          onChangeLanguage={changeLanguage} logoSrc={logo} footerChildren={<FooterCompanyInfo />}>
    <FooterLinks />
  </FooterComponent>;
}
