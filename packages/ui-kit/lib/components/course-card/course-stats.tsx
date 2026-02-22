import * as React from 'react';
import { IconLanguage } from '../../components/icons/icon-language';
import { IconCoachingSession } from '../../components/icons/icon-coaching-session';
import { IconClock } from '../../components/icons/icon-clock';
import { IconSales } from '../../components/icons/icon-sales';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import Tooltip from '../tooltip';

interface StatItemProps {
  icon: React.ReactNode;
  text: string;
  tooltip?: string;
  className?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, text, tooltip, className }) => (
  <div className={`flex gap-1 items-center min-w-0 ${className ?? ''}`}>
    <div className="shrink-0 flex">{icon}</div>
    <label className="text-sm text-text-secondary truncate" title={text}>{text}</label>
    {tooltip && <div className="shrink-0 flex"><Tooltip text="" description={tooltip} /></div>}
  </div>
);

export interface CourseStatsProps extends isLocalAware{
  language: string;
  sessions: number;
  duration: string;
  sales: number;
  sessionLabelVariant?: 'total' | 'available';
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
  locale,
  sessionLabelVariant,
}) => {
  const dictionary = getDictionary(locale);

  const sessionLabel = sessionLabelVariant === 'available'
    ? dictionary.components.courseCard.availableCoachingSession
    : dictionary.components.courseCard.cochingSession;
  const sessionHint = sessionLabelVariant === 'available'
    ? dictionary.components.courseCard.availableCoachingSessionHint
    : dictionary.components.courseCard.cochingSessionHint;

  // First row: Language and Coaching Session
  const firstRowStats = [
    {
      icon: <IconLanguage classNames="fill-text-secondary" size="5" />,
      text: language.toUpperCase(),
      className: 'shrink-0',
    },
    ...(sessions
      ? [
          {
            icon: <IconCoachingSession classNames="text-text-secondary" size="5" />,
            text: `${sessions} ${sessionLabel}`,
            tooltip: sessionHint,
          },
        ]
      : []),
  ];

  // Second row: Duration and Sales
  const secondRowStats = [
    {
      icon: <IconClock classNames="text-text-secondary" size="5" />,
      text: duration,
    },
    {
      icon: <IconSales classNames="text-text-secondary" size="5" />,
      text: `${sales} ${sales === 1 ? dictionary.components.courseCard.sale : dictionary.components.courseCard.sales}`,
    },
  ];

  return (
    <div className="flex flex-col gap-y-[13px]">
      {/* First row: Language and Coaching Session */}
      <div className="flex gap-x-[15px]">
        {firstRowStats.map((stat, index) => (
          <StatItem key={index} {...stat} />
        ))}
      </div>

      {/* Second row: Duration and Sales */}
      <div className="flex gap-x-[15px]">
        {secondRowStats.map((stat, index) => (
          <StatItem key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};