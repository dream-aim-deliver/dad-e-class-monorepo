import React, { FC, useState } from 'react';
import { Button } from '../button';
import { IconCheckDouble } from '../icons/icon-check-double';
import { Activity, ActivityProps } from './activity';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface RecentActivityProps extends isLocalAware {
  activities?: ActivityProps[];
  maxActivities?: number;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  className?: string;
}

/**
 * A reusable RecentActivity component that displays a list of activities with options to mark all as read and view more.
 *
 * @param locale The current locale for internationalization.
 * @param activities Optional array of ActivityProps to display.
 * @param maxActivities Optional maximum number of activities to show initially (default: 3).
 * @param onMarkAllAsRead Optional callback function to mark all activities as read.
 * @param onViewAll Optional callback function when viewing all activities.
 * @param className Optional additional CSS class names to customize the component's appearance.
 *
 * @example
 * <RecentActivity
 *   locale="en"
 *   activities={activityList}
 *   maxActivities={5}
 *   onMarkAllAsRead={() => console.log("Marked all as read")}
 *   onViewAll={() => console.log("Viewing all activities")}
 * />
 */

export const RecentActivity: FC<RecentActivityProps> = ({
  locale,
  activities = [],
  maxActivities = 3,
  onMarkAllAsRead,
  onViewAll,
  className,
}) => {
  const dictionary = getDictionary(locale);
  const [visibleCount, setVisibleCount] = useState(maxActivities);

  const displayedActivities = activities.slice(0, visibleCount);

  const handleViewAll = () => {
    setVisibleCount(activities.length);
    if (onViewAll) {
      onViewAll();
    }
  };

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
        {activities.length > maxActivities &&
          visibleCount < activities.length && (
            <Button
              text={dictionary.components.recentActivity.viewAll}
              variant="text"
              className="p-0"
              onClick={handleViewAll}
            />
          )}
      </div>
    </div>
  );
};
