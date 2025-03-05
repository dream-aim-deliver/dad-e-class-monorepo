import * as React from 'react';
import { IconLanguage } from '../../components/icons/icon-language';
import { IconCoachingSession } from '../../components/icons/icon-coaching-session';
import { IconClock } from '../../components/icons/icon-clock';
import { IconSales } from '../../components/icons/icon-sales';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface StatItemProps {
  icon: React.ReactNode;
  text: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, text }) => (
  <div className="flex gap-1 items-center whitespace-nowrap">
    {icon}
    <label className="text-sm text-text-secondary">{text}</label>
  </div>
);

export interface CourseStatsProps extends isLocalAware{
  language: string;
  sessions: number;
  duration: string;
  sales: number;
}

/**
 * A component for displaying statistical information about a course, such as language, sessions, duration, and sales.
 *
 * @param language The name of the language in which the course is offered.
 * @param sessions The number of coaching sessions in the course.
 * @param duration The total duration of the course (e.g., "2.50 hours").
 * @param sales The number of sales or enrollments for the course.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CourseStats
 *   language="English"
 *   sessions={10}
 *   duration="2.50 hours"
 *   sales={150}
 *   locale="en"
 * />
 */
export const CourseStats: React.FC<CourseStatsProps> = ({
  language,
  sessions,
  duration,
  sales,
  locale
}) => {
  const dictionary = getDictionary(locale);
  const stats = [
    {
      icon: <IconLanguage classNames="fill-text-secondary" size="5" />,
      text: language,
    },
    {
      icon: <IconCoachingSession classNames="text-text-secondary" size="5" />,
      text: `${sessions} ${dictionary.components.courseCard.cochingSession}`,
    },
    {
      icon: <IconClock classNames="text-text-secondary" size="5" />,
      text: duration,
    },
    {
      icon: <IconSales classNames="text-text-secondary" size="5" />,
      text: `${sales} ${dictionary.components.courseCard.sales}`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-x-[15px] gap-y-[13px]">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
};