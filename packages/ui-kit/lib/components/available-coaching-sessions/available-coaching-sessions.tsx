import { Button } from '../button';
import { FC } from 'react';
import { DragDropSession, DragDropSessionProps } from './drag-drop-session';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface AvailableCoachingSessionsProps extends isLocalAware {
  text?: string;
  availableCoachingSessionsData?: DragDropSessionProps[];
  onClickBuyMoreSessions?: () => void;
  isLoading?: boolean;
}

/**
 * A reusable component that displays available coaching sessions with a title, description,
 * session list, and a button to purchase more sessions.
 *
 * @param locale The locale for translations, used to retrieve localized text.
 * @param text Optional custom text displayed below the title.
 * @param availableCoachingSessionsData An array of `DragDropSessionProps` representing available coaching sessions.
 * @param onClickBuyMoreSessions A callback function to handle the buy more sessions button click event.
 * @param isLoading A boolean value to check if the data is loading or not.
 *
 * @example
 * <AvailableCoachingSessions
 *   locale="en"
 *   text="Here are your available coaching sessions."
 *   availableCoachingSessionsData={[
 *     { title: "Session 1", time: 60, numberofSessions: 2 },
 *     { title: "Session 2", time: 45, numberofSessions: 1 },
 *   ]}
 *   onClickBuyMoreSessions={() => console.log("Buy more sessions")}
 * />
 **/

export const AvailableCoachingSessions: FC<AvailableCoachingSessionsProps> = ({
  locale,
  text,
  availableCoachingSessionsData,
  onClickBuyMoreSessions,
  isLoading = false,
}) => {
  const dictionary = getDictionary(locale);
  return (
    <div className="flex flex-col items-start p-4 gap-[0.875rem] bg-card-fill rounded-medium h-fit">
      <p className="text-lg text-text-primary font-bold leading-[120%]">
        {dictionary?.components?.availableCoachingSessions?.title}
      </p>
      {!availableCoachingSessionsData ||
      availableCoachingSessionsData?.length === 0 ? (
        <div className="flex items-center justify-center w-full">
          <p className="text-[1rem] text-text-secondary leading-[150%]">
            {
              dictionary?.components?.availableCoachingSessions
                ?.noAvailableSessionText
            }
          </p>
        </div>
      ) : (
        <>
          {isLoading ? (
            <p className="text-[0.875rem] text-text-secondary leading-[150%]">
              {dictionary?.components?.availableCoachingSessions?.loadingText}
            </p>
          ) : (
            <p className="text-[0.875rem] text-text-secondary leading-[150%]">
              {text}
            </p>
          )}
          <div className="flex flex-col gap-2 items-end w-full">
            {isLoading ? (
              <>
                <DragDropSession isLoading={isLoading} />
                <DragDropSession isLoading={isLoading} />
                <DragDropSession isLoading={isLoading} />
              </>
            ) : (
              <>
                {availableCoachingSessionsData?.map(
                  (availableCoachingSession) => (
                    <DragDropSession
                      {...availableCoachingSession}
                      durationMinutes={
                        dictionary?.components?.availableCoachingSessions
                          ?.durationMinutes
                      }
                    />
                  ),
                )}
              </>
            )}
          </div>
        </>
      )}
      <Button
        className="w-full"
        onClick={onClickBuyMoreSessions}
        text={
          dictionary?.components?.availableCoachingSessions?.buyMoreSessions
        }
      />
    </div>
  );
};
