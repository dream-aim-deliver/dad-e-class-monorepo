import React, { FC, useEffect, useState } from 'react';
import { Button } from '../button';
import { IconCheckDouble } from '../icons/icon-check-double';
import { Activity, ActivityProps } from './activity';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface RecentActivityProps extends isLocalAware {
  activities?: ActivityProps[];
  maxActivities?: number;
  onClickMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  className?: string;
  variation?: 'Pop-up' | 'Feed';
}

/**
 * RecentActivity component that displays a list of recent notifications.
 * Supports limiting the number of displayed activities and provides options to view all and mark all as read.
 *
 * @param activities An optional array of activity objects to display.
 * @param maxActivities The maximum number of activities to show initially (default: 3).
 * @param onClickMarkAllAsRead Optional callback triggered when "Mark All as Read" is clicked.
 * @param onViewAll Optional callback triggered when "View All" is clicked.
 * @param className Optional additional CSS class names for customization.
 * @param variation Defines the display style ('Pop-up' or 'Feed', default: 'Pop-up').
 * @param locale The locale used for translations.
 *
 * @example
 * <RecentActivity
 *   activities={[
 *     { message: "New course available!", timestamp: "2024-03-27T12:00:00Z", isRead: false },
 *     { message: "Assignment deadline extended", timestamp: "2024-03-26T15:30:00Z", isRead: true },
 *   ]}
 *   maxActivities={5}
 *   onClickMarkAllAsRead={() => console.log("All marked as read")}
 *   onViewAll={() => console.log("View all clicked")}
 *   variation="Feed"
 * />
 */


export const RecentActivity: FC<RecentActivityProps> = ({
  locale,
  activities = [],
  maxActivities = 3,
  onClickMarkAllAsRead,
  onViewAll,
  className,
  variation='Pop-up'
}) => {
  const dictionary = getDictionary(locale);
  const [visibleCount, setVisibleCount] = useState<number>(null);

  useEffect(() => {
    setVisibleCount(maxActivities);
  },[maxActivities]);

  // Filter activities based on variation
  const filteredActivities =
    variation === 'Pop-up'
      ? activities.filter((activity) => !activity.isRead) // Only show unread activities
      : activities; // Show all activities for Feed

  const displayedActivities = filteredActivities.slice(0, visibleCount);

  const handleViewAll = () => {
    setVisibleCount(filteredActivities.length);
    if (onViewAll) {
      onViewAll();
    }
  };

  return (
    <div className={`flex flex-col gap-2 items-center ${className}`}>
      {/* Feed variation */}
      {variation === 'Feed' && 
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
            onClick={onClickMarkAllAsRead}
          />
        </div>
      }
      <div className="flex p-2 flex-col w-full bg-card-fill border border-card-stroke rounded-medium">
        {displayedActivities.map((activity, index) => (
          <Activity key={index} {...activity}  locale={locale}/>
        ))}
        {filteredActivities.length > maxActivities &&
          visibleCount < filteredActivities.length && (
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
