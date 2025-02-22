import * as React from 'react';
import { IconLanguage } from '../../icons/icon-language';
import { IconCoachingSession } from '../../icons/icon-coaching-session';
import { IconClock } from '../../icons/icon-clock';
import { IconSales } from '../../icons/icon-sales';

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

export interface CourseStatsProps {
  language: string;
  sessions: number;
  duration: string;
  sales: number;
}

export const CourseStats: React.FC<CourseStatsProps> = ({
  language,
  sessions,
  duration,
  sales,
}) => {
  const stats = [
    {
      icon: <IconLanguage classNames="fill-text-secondary" />,
      text: language,
    },
    {
      icon: <IconCoachingSession classNames="text-text-secondary" />,
      text: `${sessions} coaching sessions`,
    },
    {
      icon: <IconClock classNames="text-text-secondary" />,
      text: duration,
    },
    {
      icon: <IconSales classNames="text-text-secondary" />,
      text: `${sales} sales`,
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
