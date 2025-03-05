import React, { FC } from 'react';
import { Button } from '../button';
import { IconCheckDouble } from '../icons/icon-check-double';
import { Activity, ActivityProps } from './activity';
import {
  getDictionary,
  isLocalAware,
} from '@maany_shr/e-class-translations';

export interface RecentActivityProps extends isLocalAware {
  activities?: ActivityProps[];
  maxActivities?: number;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  className?: string;
}

export const RecentActivity: FC<RecentActivityProps> = ({
  locale,
  activities = [],
  maxActivities = 5,
  onMarkAllAsRead,
  onViewAll,
  className,
}) => {
  const dictionary = getDictionary(locale);

  const displayedActivities = activities.slice(0, maxActivities);

  return (
    <div className={`flex flex-col gap-2 items-center ${className}`}>
      <div className="flex gap-2 w-full items-center justify-between">
        <p className="text-xl text-base-white font-bold text-left">
          {dictionary?.components?.recentActivity?.recentActivity}
        </p>
        <Button
          variant="text"
          size="medium"
          text={dictionary?.components?.recentActivity?.markAllAsRead}
          hasIconLeft
          className="text-right p-0"
          iconLeft={<IconCheckDouble size="6" />}
          onClick={onMarkAllAsRead}
        />
      </div>
      <div className="flex p-2 flex-col w-full bg-card-fill border border-card-stroke rounded-medium">
        {displayedActivities.map((activity, index) => (
          <Activity key={index} layout="vertical" {...activity} />
        ))}
        {activities.length > maxActivities && (
          <Button
            text={dictionary.components.recentActivity.viewAll}
            variant="text"
            className="p-0"
            onClick={onViewAll}
          />
        )}
      </div>
    </div>
  );
};
