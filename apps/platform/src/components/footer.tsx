'use client';

import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { usePathname, useRouter } from 'next/navigation';
import { Footer as FooterComponent } from '@maany_shr/e-class-ui-kit';
import { getLogo } from './mock/queries';

export type FooterProps = isLocalAware & {
  availableLocales: TLocale[];
};

export default function Footer(props: FooterProps) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    const newUrl = pathname.replace(`/${props.locale}`, `/${newLocale}`);
    router.push(newUrl);
  };

  const logo = getLogo();

  return <FooterComponent locale={props.locale} availableLocales={props.availableLocales} onChangeLanguage={changeLanguage} logoSrc={logo} />
}
