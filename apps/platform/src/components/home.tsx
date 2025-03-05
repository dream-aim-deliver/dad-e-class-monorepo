'use client';
import {
  Button,
  CoachingSessionOverview,
  DummySkills,
} from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import { useTranslations } from 'next-intl';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';

export type HomeProps = isLocalAware;

export default function Home(props: HomeProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('home');
  return (
    <div className="flex flex-col  text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
      <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
        {t('title')}
      </p>
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
      <div className="w-[350px]">
        <CoachingSessionOverview
          title="This is new title"
          date="04-03-2025"
          time="9:00AM"
          creatorName="Creator Name"
          courseName="Course Name"
          duration="2 Hourse"
          locale={props.locale as TLocale}
          hasReview
        />
      </div>
    </div>
  );
}
