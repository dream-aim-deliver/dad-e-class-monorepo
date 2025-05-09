import React, { FC, ReactNode } from 'react';
import { Button } from '../button';
import { IconCheckDouble } from '../icons/icon-check-double';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface RecentActivityProps extends isLocalAware {
  children?: ReactNode;
  maxActivities?: number;
  onClickMarkAllAsRead?: () => void;
  className?: string;
  variation: 'Pop-up' | 'Feed';
  onClickViewAll?: () => void;
}

/**
 * RecentActivity component for displaying a list of recent activities or notifications.
 * It supports three variations: "Pop-up", "Feed", and "Search", and provides options to mark all activities as read or view all activities.
 * Children should be passed as a flat list of elements, not wrapped in fragments.
 *
 * @param locale The locale used for translation and localization purposes.
 * @param children ReactNode elements representing individual activities to be displayed within the component.
 * @param maxActivities The maximum number of activities to display initially. Defaults to 3.
 * @param onClickMarkAllAsRead Optional callback function triggered when the "Mark All As Read" button is clicked.
 * @param className Optional custom class name for styling the component.
 * @param variation Specifies the variation of the component. Can be either 'Pop-up' or 'Feed'.
 * @param onClickViewAll Optional callback function triggered when the "View All" button is clicked.
 * @example
 * const activities = [
 *   <Activity key="1" message="New course added!" timestamp="2025-04-07T12:30:00Z" />,
 *   <Activity key="2" message="Your assignment has been graded." timestamp="2025-04-06T18:00:00Z" />,
 *   <Activity key="3" message="Course updated." timestamp="2025-04-05T09:00:00Z" />,
 * ];
 * <RecentActivity
 *   locale="en"
 *   maxActivities={2}
 *   onClickMarkAllAsRead={() => console.log("Marked all as read!")}
 *   onClickViewAll={() => console.log("View all activities!")}
 *   variation="Feed"
 * >
 *   {activities}
 * </RecentActivity>
 */
export const RecentActivity: FC<RecentActivityProps> = ({
  locale,
  children,
  maxActivities = 3,
  onClickMarkAllAsRead,
  className,
  variation,
  onClickViewAll
}) => {
  const dictionary = getDictionary(locale);
  const allChildren = React.Children.toArray(children).filter(React.isValidElement);
  const displayedChildren = allChildren.slice(0, maxActivities);

  return (
    <div className={`flex flex-col gap-2 items-center ${className}`}>
      {variation === 'Feed' && (
        <div className="flex w-full items-center justify-between">
          <p className="text-xl text-base-white font-bold text-left">
            {dictionary?.components?.recentActivity?.recentActivity}
          </p>
          {onClickMarkAllAsRead && (
            <Button
              variant="text"
              size="medium"
              text={dictionary?.components?.recentActivity?.markAllAsRead}
              hasIconLeft
              className="text-right p-0"
              iconLeft={<IconCheckDouble size="6" />}
              onClick={onClickMarkAllAsRead}
            />
          )}
        </div>
      )}
      <div className="flex p-2 flex-col w-full bg-card-fill border border-card-stroke rounded-medium">
        {displayedChildren}
        {allChildren.length > maxActivities && (
          <Button
            text={dictionary?.components?.recentActivity?.viewAll}
            variant="text"
            className="p-0"
            onClick={onClickViewAll}
          />
        )}
      </div>
    </div>
  );
};