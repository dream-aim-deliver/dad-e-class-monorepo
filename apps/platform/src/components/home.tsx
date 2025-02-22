'use client';
import {
  Button,
  VisitorCourseCard,
  CoachCourseCard,
  DummySkills,
} from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import { useTranslations } from 'next-intl';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';

export type HomeProps = isLocalAware;

const data = {
  title: 'Course Title',
  rating: 4.8,
  reviewCount: 245,
  creatorName: 'Sarah Johnson',
  language: 'English',
  sessions: 12,
  duration: '6 weeks',
  groupName: 'Jhon',
  description: 'This is detail description of this card',
  sales: 1500,
  thumbnailUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  status: 'published',
};

export default function Home(props: HomeProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('home');
  return (
    <div className="flex flex-col  text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
      <p className="text-center text-2xl">{t('title')}</p>
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
      <div className="flex flex-col gap-2 p-2">
        <VisitorCourseCard {...data} />
        <CoachCourseCard {...data} />
      </div>
    </div>
  );
}
