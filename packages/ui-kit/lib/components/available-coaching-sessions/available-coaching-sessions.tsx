import { Button } from '../button';
import { FC, useEffect, useRef, useState } from 'react';
import { DragDropSession, DragDropSessionProps } from './drag-drop-session';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Draggable } from '@fullcalendar/interaction';

export interface AvailableCoachingSessionsProps extends isLocalAware {
  text?: string;
  availableCoachingSessionsData?: DragDropSessionProps[];
  onClickBuyMoreSessions?: () => void;
  isLoading?: boolean;
  onSessionDrag?: (sessionId: string) => void;
}

export const AvailableCoachingSessions: FC<AvailableCoachingSessionsProps> = ({
  locale,
  text,
  availableCoachingSessionsData,
  onClickBuyMoreSessions,
  isLoading = false,
  onSessionDrag,
}) => {
  const dictionary = getDictionary(locale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sessionCounts, setSessionCounts] = useState<{ [key: string]: number }>({});
  const draggableInstances = useRef<Map<string, { element: HTMLElement; draggable: Draggable }>>(
    new Map()
  );

  useEffect(() => {
    if (containerRef.current && availableCoachingSessionsData && !isLoading) {
      const draggableElements = containerRef.current.querySelectorAll('.draggable-session');

      draggableElements.forEach((el) => {
        const sessionId = el.getAttribute('data-session-id') || '';
        const title = el.getAttribute('data-title') || 'Coaching Session';
        const numberOfSessions = parseInt(el.getAttribute('data-sessions') || '1', 10);
        const remainingSessions = numberOfSessions - (sessionCounts[sessionId] || 0);

        if (remainingSessions > 0 && !draggableInstances.current.has(sessionId)) {
          const draggable = new Draggable(el as HTMLElement, {
            eventData: {
              title,
              duration: el.getAttribute('data-duration') || '01:00',
              extendedProps: {
                numberOfSessions,
                sessionId,
              },
            },
          });

          draggableInstances.current.set(sessionId, { element: el as HTMLElement, draggable });
        }
      });

      return () => {
        draggableInstances.current.forEach(({ element }, sessionId) => {
          const numberOfSessions = parseInt(element.getAttribute('data-sessions') || '1', 10);
          const remainingSessions = numberOfSessions - (sessionCounts[sessionId] || 0);
          if (remainingSessions <= 0) {
            const newElement = document.createElement('div');
            newElement.className = element.className;
            newElement.setAttribute('data-session-id', sessionId);
            newElement.setAttribute('data-title', element.getAttribute('data-title') || '');
            newElement.setAttribute('data-duration', element.getAttribute('data-duration') || '');
            newElement.setAttribute('data-sessions', element.getAttribute('data-sessions') || '');
            element.replaceWith(newElement);
            draggableInstances.current.delete(sessionId);
          }
        });
      };
    }
  }, [availableCoachingSessionsData, isLoading, sessionCounts]);

  const handleSessionDrag = (sessionId: string) => {
    setSessionCounts((prev) => ({
      ...prev,
      [sessionId]: (prev[sessionId] || 0) + 1,
    }));
    onSessionDrag?.(sessionId);
  };

  useEffect(() => {
    const handleDrop = (event: CustomEvent) => {
      const { sessionId } = event.detail;
      handleSessionDrag(sessionId);
    };

    window.addEventListener('sessionDropped' as any, handleDrop);
    return () => {
      window.removeEventListener('sessionDropped' as any, handleDrop);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="z-30 flex flex-col items-start p-4 gap-[0.875rem] bg-card-fill rounded-medium h-fit w-[300px] shadow-lg"
    >
      <p className="text-lg text-text-primary font-bold leading-[120%]">
        {dictionary?.components?.availableCoachingSessions?.title}
      </p>
      {!availableCoachingSessionsData || availableCoachingSessionsData.length === 0 ? (
        <div className="flex items-center justify-center w-full">
          <p className="text-[1rem] text-text-secondary leading-[150%]">
            {dictionary?.components?.availableCoachingSessions?.noAvailableSessionText}
          </p>
        </div>
      ) : (
        <>
          {isLoading ? (
            <p className="text-[0.875rem] text-text-secondary leading-[150%]">
              {dictionary?.components?.availableCoachingSessions?.loadingText}
            </p>
          ) : (
            <p className="text-[0.875rem] text-text-secondary leading-[150%]">{text}</p>
          )}
          <div className="flex flex-col gap-2 items-end w-full">
            {isLoading ? (
              <>
                <DragDropSession isLoading={isLoading} />
                <DragDropSession isLoading={isLoading} />
                <DragDropSession isLoading={isLoading} />
              </>
            ) : (
              availableCoachingSessionsData.map((session, index) => {
                const sessionId = `${session.title}-${index}`;
                const remainingSessions =
                  (session.numberOfSessions || 1) - (sessionCounts[sessionId] || 0);

                if (remainingSessions <= 0) return null;

                return (
                  <div
                    key={sessionId}
                    className={`draggable-session ${
                      remainingSessions <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                    } w-full`}
                    data-session-id={sessionId}
                    data-title={session.title}
                    data-duration={`${Math.floor(session.time! / 60)}:${(session.time! % 60)
                      .toString()
                      .padStart(2, '0')}`}
                    data-sessions={session.numberOfSessions?.toString()}
                  >
                    <DragDropSession
                      {...session}
                      numberOfSessions={remainingSessions}
                      durationMinutes={
                        dictionary?.components?.availableCoachingSessions?.durationMinutes
                      }
                    />
                  </div>
                );
              })
            )}
          </div>
          {availableCoachingSessionsData.every((session, index) => {
            const sessionId = `${session.title}-${index}`;
            return (session.numberOfSessions || 1) - (sessionCounts[sessionId] || 0) <= 0;
          }) &&
            !isLoading &&
            availableCoachingSessionsData.length > 0 && (
              <div className="flex items-center justify-center w-full">
                <p className="text-[1rem] text-text-secondary leading-[150%]">
                  {dictionary?.components?.availableCoachingSessions?.noAvailableSessionText}
                </p>
              </div>
            )}
        </>
      )}
      <Button
        className="w-full"
        onClick={onClickBuyMoreSessions}
        text={dictionary?.components?.availableCoachingSessions?.buyMoreSessions}
      />
    </div>
  );
};