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
 * Props for the CourseStats component.
 *
 * @typedef {Object} CourseStatsProps
 * @property {string} language - The language in which the course is offered.
 * @property {number} sessions - The number of coaching sessions included in the course.
 * @property {string} duration - The total duration of the course (e.g., '5 hours').
 * @property {number} sales - The number of times the course has been sold.
 * @property {string} locale - The locale for translations.
 */

/**
 * Displays statistical information about a course, including language, number of sessions, duration, and sales.
 *
 * @type {React.FC<CourseStatsProps>}
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