import React from 'react';
import { isLocalAware } from '@maany_shr/e-class-translations';

interface CoachingSessionGroupOverviewListProps extends isLocalAware {
  children: React.ReactNode;
}

/**
 * CoachingSessionGroupOverviewList component is a layout component that displays a grid of coaching session group overview cards.
 *
 * @param children React nodes representing coaching session group overview cards (should be CoachingSessionGroupOverview components)
 *
 * @example
 * <CoachingSessionGroupOverviewList locale="en">
 *   <CoachingSessionGroupOverview {...sessionData1} />
 *   <CoachingSessionGroupOverview {...sessionData2} />
 * </CoachingSessionGroupOverviewList>
 */
export const CoachingSessionGroupOverviewList: React.FC<CoachingSessionGroupOverviewListProps> = ({
  children,
  locale,
}) => {

  return (
    <div className="flex flex-col gap-4  justify-center items-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {children}
      </div>
    </div>
  );
};