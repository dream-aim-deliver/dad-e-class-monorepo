import React, { useState } from 'react';
import {
  CoachingSessionOverview,
  CoachingSessionOverviewProps,
} from './coaching-session-overview';
import { Button } from '../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export type UserType = 'coach' | 'student';

interface CoachingSessionsProps extends isLocalAware {
  coachingSessions: CoachingSessionOverviewProps[];
  userType: UserType;
}

/**
 * CoachingSessions component for displaying a list of coaching session cards.
 *
 * @param coachingSessions - Array of coaching session objects to be displayed.
 * @param userType - Defines whether the user is a 'coach' or 'student'.
 *
 * @example
 * <CoachingSessions
 *   coachingSessions={[session1, session2]}
 *   userType="coach"
 * />
 */
const CoachingSessions: React.FC<CoachingSessionsProps> = ({
  coachingSessions,
  userType,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const [visibleSessions, setVisibleSessions] = useState(6);

  const handleLoadMore = () => {
    setVisibleSessions((prev) => prev + 6);
  };
  return (
    <div className="flex flex-col gap-4  justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coachingSessions.slice(0, visibleSessions).map((session, index) => (
          <CoachingSessionOverview
            key={index}
            {...session}
            userType={userType}
            locale={locale}
          />
        ))}
      </div>
      {visibleSessions < coachingSessions.length && (
        <Button
          data-testid="load-more-button"
          variant="text"
          onClick={handleLoadMore}
          text={dictionary.components.coachingSessionOverview.loadMoreText}
        />
      )}
    </div>
  );
};

export default CoachingSessions;
