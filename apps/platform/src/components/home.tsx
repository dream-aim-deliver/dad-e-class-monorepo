'use client';
import { Button } from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import { useTranslations } from 'next-intl';

export interface HomeProps {
  serverSideParam: string;
}

export default function Home(props: HomeProps) {
  const {theme, setTheme} = useTheme();
  const t = useTranslations('home');
  return (
    <div className="flex flex-col  text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
      <p className="text-center text-2xl">{t('title')}</p>
      <Button
        variant="primary"
        size="medium"
        onClick={() => {
          console.log('Clicked: ' + theme);
          setTheme(theme === 'just-do-add' ? 'Job-rand-me' : 'Bewerbeagentur')
        }}
        textKey='home.buttonLabel'
      />
    </div>
  );
}
