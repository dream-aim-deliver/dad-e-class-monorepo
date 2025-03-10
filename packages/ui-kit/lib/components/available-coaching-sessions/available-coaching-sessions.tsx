import { Button } from '../button';
import React, { FC } from 'react';
import { DragDropSession } from './drag-drop-session';
import { text } from 'stream/consumers';
import {
  dictionaries,
  getDictionary,
  isLocalAware,
} from '@maany_shr/e-class-translations';

export interface availableCoachingSessionData {
  title?: string;
  duration?: string;
  isMoreThan1Available?: boolean;
}

export interface AvailableCoachingSessionsProps extends isLocalAware {
  property1?: 'default' | 'empty';
  text?: string;
  availableCoachingSessionsData?: availableCoachingSessionData[];
}

export const AvailableCoachingSessions: FC<AvailableCoachingSessionsProps> = ({
  property1 = 'default',
  locale,
  text,
  availableCoachingSessionsData = [
    {
      title: 'Quick sprint',
      duration: '20 minutes',
      isMoreThan1Available: false,
    },
    {
      title: 'Normal Sprint',
      duration: '30 minutes',
      isMoreThan1Available: true,
    },
    {
      title: 'Quick sprint',
      duration: '60 minutes',
      isMoreThan1Available: false,
    },
  ],
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
            property1={property1}
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
