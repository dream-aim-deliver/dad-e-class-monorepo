'use client';

import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { isSessionAware } from '@maany_shr/e-class-auth';
import { Navbar, useTheme } from '@maany_shr/e-class-ui-kit';
import { usePathname, useRouter } from 'next/navigation';
import { getLogo } from './mock/queries';
import { useTranslations } from 'next-intl';
import { Cat } from 'lucide-react';

// TODO: Accept notification count
export type HeaderProps = isLocalAware & isSessionAware & {
  availableLocales: TLocale[];
};

const NavLinks = () => {
  const t = useTranslations('components.navbar');
  const linkClass = 'hover:text-button-primary-hover-fill cursor-pointer text-md';

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

export default function Header(props: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    const newUrl = pathname.replace(`/${props.locale}`, `/${newLocale}`);
    router.push(newUrl);
  };

  const { theme, setTheme } = useTheme();

  const isLoggedIn = !!props.session;

  // TODO: utilize useQuery
  const logo = getLogo();

  // TODO: Pass notification count
  return <Navbar
    isLoggedIn={isLoggedIn}
    availableLocales={props.availableLocales}
    locale={props.locale}
    onChangeLanguage={changeLanguage}
    userProfileImageSrc={props.session?.user?.image}
    userName={props.session?.user?.name}
    logoSrc={logo}
  >
    <Cat className="cursor-pointer" onClick={() => {
      if (theme === 'just-do-add') {
        setTheme('Job-rand-me');
      } else if (theme === 'Job-rand-me') {
        setTheme('Bewerbeagentur');
      } else {
        setTheme('just-do-add');
      }
    }}/>
    <NavLinks />
  </Navbar>;
}
