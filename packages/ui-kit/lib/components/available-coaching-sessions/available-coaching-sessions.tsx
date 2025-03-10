import { Button } from '../button';
import React, { FC } from 'react';
import { DragDropSession, DragDropSessionProps } from './drag-drop-session';
import {
  getDictionary,
  isLocalAware,
} from '@maany_shr/e-class-translations';

export interface AvailableCoachingSessionsProps extends isLocalAware {
  isEmpty?: 'default' | 'empty';
  text?: string;
  availableCoachingSessionsData?: DragDropSessionProps[];
}

/**
 * A reusable component that displays available coaching sessions with a title, description, 
 * session list, and a button to purchase more sessions.
 *
 * @param isEmpty Determines whether the session list is empty. Options: `'default' | 'empty'`. Defaults to `'default'`.
 * @param locale The locale for translations, used to retrieve localized text.
 * @param text Optional custom text displayed below the title.
 * @param availableCoachingSessionsData An array of `DragDropSessionProps` representing available coaching sessions.
 *
 * @example
 * <AvailableCoachingSessions
 *   isEmpty="default"
 *   locale="en"
 *   text="Here are your available coaching sessions."
 *   availableCoachingSessionsData={[
 *     { title: "Session 1", duration: 60, numberofSessions: 2 },
 *     { title: "Session 2", duration: 45, numberofSessions: 1 },
 *   ]}
 * />
 */
export const AvailableCoachingSessions: FC<AvailableCoachingSessionsProps> = ({
  isEmpty = 'default',
  locale,
  text,
  availableCoachingSessionsData,
}) => {
  const dictionary = getDictionary(locale);
  return (
    <div className="flex flex-col items-start p-4 gap-[0.875rem] bg-card-fill rounded-medium h-fit">
      <p className="text-lg text-text-primary font-bold leading-[120%]">
        {dictionary?.components?.availableCoachingSessions?.title}
      </p>
      <p className="text-[0.875rem] text-text-secondary leading-[150%]">
        {text}
      </p>
      <div className="flex flex-col gap-2 items-end w-full">
        {availableCoachingSessionsData?.map((availableCoachingSession) => (
          <DragDropSession
            {...availableCoachingSession}
            isEmpty={isEmpty}
          />
        ))}
      </div>
      <Button
        className="w-full"
        text={
          dictionary?.components?.availableCoachingSessions?.buyMoreSessions
        }
      />
    </div>
  );
};
