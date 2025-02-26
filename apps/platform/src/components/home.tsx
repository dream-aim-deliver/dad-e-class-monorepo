"use client";
import React from "react";
import {
  Button,
  VisitorCourseCard,
  CoachCourseCard,
  DummySkills,
  StudentCourseCard,CourseCreatorCard
} from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import { useTranslations } from 'next-intl';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { course } from "@maany_shr/e-class-models";

export type HomeProps = isLocalAware;

const data = {
  title: 'Course Title',
  rating: 4.8,
  reviewCount: 245,
  creatorName: 'Sarah Johnson',
  language: {
    code: "ENG" as const,
    name: "English" as const,
  },
  sessions: 12,
  duration: '6 weeks',
  groupName: 'Jhon',
  description: 'This course teaches you how to create powerful, cohesive brand identities that resonate with audiences and stand out in the marketplace.',
  sales: 1500,
  imageUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  status: 'published',
};

const studentCourseData = {
  title: 'Sample Course',
  description: 'This course teaches you how to create powerful, cohesive brand identities that resonate with audiences and stand out in the marketplace.',
  duration: {
    video: 120,
    coaching: 60,
    selfStudy: 180,
  },
  pricing: {
    fullPrice: 199,
    partialPrice: 99,
    currency: 'USD',
  },
  imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  rating: 4.5,
  reviewCount: 245,
  author: {
    name: 'John Doe',
    image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  },
  language: {
    code: "ENG" as const,
    name: "English" as const,
  },
  onBegin: () => console.log('Begin course'),
  onResume: () => console.log('Resume course'),
  onReview: () => console.log('Review course'),
  onDetails: () => console.log('View course details'),
};

const sampleCourseData = {
  title: 'Sample Course',
  description: 'This course teaches you how to create powerful, cohesive brand identities that resonate with audiences and stand out in the marketplace.',
  duration: {
    video: 120,
    coaching: 60,
    selfStudy: 180,
  },
  pricing: {
    fullPrice: 199,
    partialPrice: 99,
    currency: 'USD',
  },
  imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  rating: 4.5,
  author: {
    name: 'John Doe',
    image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  },
  language: {
    code: "ENG" as const,
    name: "English" as const,
  },
};

const courseCreatorCardsData = [
  {
    ...sampleCourseData,
    reviewCount: 245,
    sessions: 12,
    sales: 1500,
    status: "published" as const,
  },
  {
    ...sampleCourseData,
    reviewCount: 100,
    sessions: 8,
    sales: 800,
    status: "under-review" as const,
  },
  {
    ...sampleCourseData,
    reviewCount: 50,
    sessions: 5,
    sales: 300,
    status: "draft" as const,
  },
];

export default function Home(props: HomeProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('home');

  return (
    <div className="flex flex-col text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
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
      <div className="flex gap-4 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <VisitorCourseCard locale={props.locale as TLocale} {...data} />
        <CoachCourseCard locale={props.locale as TLocale} {...data} />
        <StudentCourseCard locale={props.locale as TLocale} {...studentCourseData} progress={50} />
        <StudentCourseCard locale={props.locale as TLocale} {...studentCourseData} progress={100} />
        <StudentCourseCard  locale={props.locale as TLocale} {...studentCourseData} progress={0} />
      </div>
      <div className="flex gap-4 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {courseCreatorCardsData.map((data, index) => (
          <CourseCreatorCard
            key={index}
            course={data}
            reviewCount={data.reviewCount}
            sessions={data.sessions}
            sales={data.sales}
            status={data.status}
            locale={props.locale as TLocale}
            onEdit={() => console.log('Edit course')}
            onManage={() => console.log('Manage course')}
          />
        ))}
      </div>
    </div>
  );
}
