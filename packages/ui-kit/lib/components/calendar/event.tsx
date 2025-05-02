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
    sessionId?: string;
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

  return (
    <div
      className={`flex h-full flex-col rounded-md  ${eventStyle} p-1 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-bold">
          {formatTime(eventInfo.event.start, eventInfo.event.end)}
        </span>
        <h3 className="truncate text-sm font-bold">
          {eventInfo.event.title}
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
      </div>
    </div>
  );
};