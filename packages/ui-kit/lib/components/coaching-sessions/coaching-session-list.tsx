import React from 'react';
import { isLocalAware } from '@maany_shr/e-class-translations';

interface CoachingSessionListProps extends isLocalAware {
  children: React.ReactNode;
}

/**
 * CoachingSessionList component is a layout component that displays a grid of coaching session cards.
 *
 * @param children React nodes representing coaching session cards (should be CoachingSessionOverview components)
 *
 * @example
 * <CoachingSessionList locale="en">
 *   <CoachingSessionOverview {...sessionData1} />
 *   <CoachingSessionOverview {...sessionData2} />
 * </CoachingSessionList>
 */
export const CoachingSessionList: React.FC<CoachingSessionListProps> = ({
  children,
  locale,
}) => {

  return (
    <div className="w-full flex flex-col gap-4  justify-center items-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};