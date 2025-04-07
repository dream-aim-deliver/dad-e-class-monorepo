import React, { FC, useEffect, useState, ReactNode } from 'react';
import { Button } from '../button';
import { IconCheckDouble } from '../icons/icon-check-double';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface RecentActivityProps extends isLocalAware {
  children?: ReactNode;
  maxActivities?: number;
  onClickMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  className?: string;
  variation?: 'Pop-up' | 'Feed';
  totalActivitiesCount?: number;
}

export const RecentActivity: FC<RecentActivityProps> = ({
  locale,
  children,
  maxActivities = 3,
  onClickMarkAllAsRead,
  onViewAll,
  className,
  variation = 'Pop-up',
  totalActivitiesCount = 0,
}) => {
  const dictionary = getDictionary(locale);
  const [visibleCount, setVisibleCount] = useState<number>(maxActivities);

  useEffect(() => {
    setVisibleCount(maxActivities);
  }, [maxActivities]);

  const handleViewAll = () => {
    setVisibleCount(totalActivitiesCount);
    onViewAll?.();
  };

  const displayedChildren = React.Children.toArray(children).slice(0, visibleCount);

  return (
    <div className={`flex flex-col gap-2 items-center ${className}`}>
      {variation === 'Feed' && (
        <div className="flex gap-2 w-full items-center justify-between">
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
        {totalActivitiesCount > visibleCount && (
          <Button
            text={dictionary?.components?.recentActivity?.viewAll}
            variant="text"
            className="p-0"
            onClick={handleViewAll}
          />
        )}
      </div>
    </div>
  );
};