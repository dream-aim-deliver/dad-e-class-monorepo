'use client';

import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { isSessionAware } from '@maany_shr/e-class-auth';
import { Navbar } from '@maany_shr/e-class-ui-kit';
import { usePathname, useRouter } from 'next/navigation';
import { getLogo } from './mock/queries';

// TODO: Accept notification count
export type HeaderProps = isLocalAware & isSessionAware & {
  availableLocales: TLocale[];
};

export default function Header(props: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    const newUrl = pathname.replace(`/${props.locale}`, `/${newLocale}`);
    router.push(newUrl);
  };

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
    <span>Route</span>
  </Navbar>;
}
