'use client';
import { Button, DummySkills } from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import { isLocalAware, TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { signOut } from 'next-auth/react';
import { isSessionAware } from '@maany_shr/e-class-auth';
import { redirect } from 'next/navigation';

export type HomeProps = isLocalAware & isSessionAware;

export default function Home(props: HomeProps) {
  const { theme, setTheme } = useTheme();

  const dictionary = getDictionary(props.locale);
  const title = dictionary.pages.home.title;
  const buttonText = dictionary.pages.home.buttonText;
  const badgeText = dictionary.pages.home.badgeText;
  const signInButtonText = dictionary.pages.home.signInButtonText;
  const notSignedInText = dictionary.pages.home.notSignedInText;
  const welcomeText = dictionary.pages.home.welcomeText;
  const signOutText = dictionary.pages.home.signOutText;

  const session = props.session;
  console.log('Session: ', session);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-between cursor-pointer text-center text-white">
        {notSignedInText} <br />
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={() => {
            redirect('/auth/login');
          } }
        >
          {signInButtonText}
        </button>
      </div>
    );
  }
  console.log('Session: ', session);

  return (
    <div className="flex flex-col  text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
      <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
        {title}
      </p>
      <div className="text-center text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
        {welcomeText} {session.user.name} <br />
        <button
          className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          onClick={() => signOut()}
        >
          {signOutText}
        </button>
      </div>
      <Button
        text={buttonText}
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