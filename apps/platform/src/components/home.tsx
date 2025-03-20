'use client';
import { Button, CourseCard, DummySkills } from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import { useTranslations } from 'next-intl';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';

export type HomeProps = isLocalAware;
const sampleCourseData = {
  id: 'course-123',
  title: 'Advanced Brand Identity Design',
  description: 'This course teaches you how to create powerful, cohesive brand identities that resonate with audiences and stand out in the marketplace.',
  duration: {
    video: 240,
    coaching: 120,
    selfStudy: 360,
  },
  pricing: {
    fullPrice: 299,
    partialPrice: 149,
    currency: 'USD',
  },
  imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  author: {
    name: 'Emily Chen',
    image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  },
  language: {
    code: 'ENG' as const,
    name: 'English' as const,
  },
  groupName: 'Design Professionals',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rating: 4.7,
};

export default function Home(props: HomeProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('home');
  return (
    <div className="flex flex-col  text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
      <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">{t('title')}</p>
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

      <CourseCard
        userType="creator"
        reviewCount={120}
        locale="en"
        language={{ code: "ENG", name: "English" }}
        creatorStatus="published"
        course={sampleCourseData}
        sessions={5}
        sales={200}
        onEdit={() => console.log("Edit clicked")}
        onManage={() => console.log("Manage clicked")}
        className='max-w-[352px]'
      />
      <CourseCard
        userType="creator"
        reviewCount={120}
        locale="en"
        language={{ code: "ENG", name: "English" }}
        creatorStatus="draft"
        course={sampleCourseData}
        sessions={5}
        sales={200}
        onEdit={() => console.log("Edit clicked")}
        onManage={() => console.log("Manage clicked")}
        className='max-w-[352px]'
      />
      <CourseCard
        userType="creator"
        reviewCount={120}
        locale="en"
        language={{ code: "ENG", name: "English" }}
        creatorStatus="under-review"
        course={sampleCourseData}
        sessions={5}
        sales={200}
        onEdit={() => console.log("Edit clicked")}
        onManage={() => console.log("Manage clicked")}
        className='max-w-[352px]'
      />
    </div>
  );
}
