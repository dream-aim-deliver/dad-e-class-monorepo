import React from 'react';

export type Event = {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  attendees?: string;
  isCoachAvailability?: boolean;
  isYourMeeting?: boolean;
  extendedProps?: {
    numberOfSessions?: number;
    coachingSessionId?: string;
    coachName?: string;
  };
};

type EventContentProps = {
  eventInfo: any;
};

export const EventContent: React.FC<EventContentProps> = ({ eventInfo }) => {
  const isCoachAvailability = eventInfo.event.extendedProps.isCoachAvailability;
  const isYourMeeting = eventInfo.event.extendedProps.isYourMeeting;

  const eventStyle = isCoachAvailability
    ? 'bg-action-semi-transparent-medium text-action-primary'
    : isYourMeeting
    ? 'bg-action-default text-black border border-action-default'
    : 'bg-action-default text-black border border-action-default';

  const formatTime = (start: string, end: string) => {
    const startTime = new Date(start).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const endTime = new Date(end).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${startTime} - ${endTime}`;
  };

  const title = eventInfo.event.title;
  const isSprint =
    title === 'Quick Sprint' || title === 'Normal Sprint';

  // Tooltip content for all details
  const tooltipContent = `${title}\n${formatTime(eventInfo.event.start, eventInfo.event.end)}\n${eventInfo.event.extendedProps?.coachName ? 'Coach: ' + eventInfo.event.extendedProps.coachName : ''}\n${eventInfo.event.extendedProps?.numberOfSessions ? 'Sessions: ' + eventInfo.event.extendedProps.numberOfSessions : ''}`;

  return (
    <div
      className={`flex h-full flex-col rounded-md  ${eventStyle} p-1 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl`}
      title={tooltipContent}
    >
      <div className="flex flex-col">
        <span className="text-xs font-bold">
          {formatTime(eventInfo.event.start, eventInfo.event.end)}
        </span>
        {!isSprint && (
          <>
            <h3 className="truncate text-sm font-bold">
              {title}
              {eventInfo.event.extendedProps.numberOfSessions &&
                eventInfo.event.extendedProps.numberOfSessions > 1 && (
                  <span className="ml-1 text-xs">
                    (x{eventInfo.event.extendedProps.numberOfSessions})
                  </span>
                )}
            </h3>
            <p className="truncate text-xs font-bold">
              {eventInfo.event.extendedProps.coachName || 'No coach assigned'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};