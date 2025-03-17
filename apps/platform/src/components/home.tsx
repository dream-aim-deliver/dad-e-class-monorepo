'use client';
import { Button, DummySkills } from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import { useTranslations } from 'next-intl';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { useSession, signIn, signOut } from "next-auth/react"

export type HomeProps = isLocalAware;

export default function Home(props: HomeProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('home');

  const { data: session } = useSession()
  if(!session) {
    return (
      <div className='cursor-pointer text-center text-white'>
        {t('notSignedInText')} <br/>
        <button 
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={() => signIn("auth0", undefined, { prompt: 'none' })}
        >
          {t('signInButtonText')}
        </button>
      </div>
    )
  }
 
  return (
    <div className="flex flex-col  text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
      <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">{t('title')}</p>
      <div className='text-center text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl'>
        {t('welcomeText')} {session.user?.id} <br />
        <button 
          className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          onClick={() => signOut()}
        >
          {t('signOut')}
        </button>
      </div>
      <Button
        text={t('buttonText')}
        variant="primary"
        size="medium"
        onClick={() => {
          console.log('Clicked: ' + theme);
          setTheme(theme === 'just-do-add' ? 'Job-rand-me' : 'Bewerbeagentur');
        }}
      />
      <DummySkills
        locale={props.locale as TLocale}
        skills={['React', 'TypeScript', 'TailwindCSS']}
      />
      
    </div>
  );
}
