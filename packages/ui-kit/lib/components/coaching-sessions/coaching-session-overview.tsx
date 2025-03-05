import * as React from 'react';
import { TimeInfo } from './time-info';
import { CreatorInfo } from './course-creator';
import { Button } from '../button';
import { IconHourglass } from '../icons/icon-hourglass';
import { Badge } from '../badge';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconCalendarAlt } from '../icons/icon-calendar-alt';
import { ReviewCard } from './review-card';
import { IconClock } from '../icons/icon-clock';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconClose } from '../icons/icon-close';
import { IconCheck } from '../icons/icon-check';
import {
  dictionaries,
  getDictionary,
  isLocalAware,
} from '@maany_shr/e-class-translations';

export interface CoachingSessionOverviewProps extends isLocalAware {
  status?:
    | 'ongoing'
    | 'upcoming-editable'
    | 'upcoming-locked'
    | 'ended'
    | 'requested'
    | 'rescheduled'
    | 'canceled';
  userRole?: 'student' | 'coach';
  hasReview?: boolean;
  hasCallQualityRating?: boolean;
  withinCourse?: boolean;
  groupSession?: boolean;
  title: string;
  duration: string;
  date: string;
  time: string;
  creatorName?: string;
  courseName?: string;
  groupName?: string;
  meetingLink?: string;
  onJoin?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  description?: string;
}

export function CoachingSessionOverview({
  status = 'ongoing',
  userRole = 'coach',
  hasReview = false,
  hasCallQualityRating = false,
  withinCourse = false,
  groupSession = false,
  title,
  duration,
  date,
  time,
  creatorName,
  courseName,
  groupName,
  meetingLink,
  description,
  onJoin,
  onCancel,
  onReschedule,
  locale,
}: CoachingSessionOverviewProps) {
  const dictionary = getDictionary(locale);
  return (
    <div
      className={`flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-full`}
    >
      <div className="flex gap-4 items-center justify-between">
        <p className="text-md text-text-primary font-bold leading-[120%]">
          {title}
        </p>
        <p className="text-xs text-text-primary font-bold leading-[120%]">
          {duration}
        </p>
      </div>

      {!hasReview ? (
        <TimeInfo date={date} time={time} />
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <IconCalendarAlt size="4" />
              <p className="text-sm text-text-primary leading-[100%]">{date}</p>
            </div>
            <div className="flex items-center gap-2">
              <IconClock size="4" />
              <p className="text-sm text-text-primary leading-[100%]">{time}</p>
            </div>
          </div>
          <ReviewCard
            hasCallQualityRating={hasCallQualityRating}
            readMore={dictionary.components.coachingSession.readMore}
            rating={5}
            onClick={() => {}}
            text="flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-full"
          />
        </>
      )}

      <CreatorInfo
        withinCourse={withinCourse || hasReview}
        userRole={userRole}
        groupSession={groupSession}
        creatorName={creatorName}
        courseName={courseName}
        groupName={groupName}
        createdBy={dictionary.components.coachingSession.createdBy}
        student={dictionary.components.coachingSession.student}
        course={dictionary.components.coachingSession.course}
        group={dictionary.components.coachingSession.group}
      />

      {hasReview ? (
        hasCallQualityRating ? (
          <Button
            variant="secondary"
            size="medium"
            hasIconLeft
            iconLeft={<IconCloudDownload size="6" />}
            text={dictionary.components.coachingSession.downloadRecording}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="medium"
              text={dictionary.components.coachingSession.rateCallQuality}
            />
            <Button
              variant="secondary"
              size="medium"
              hasIconLeft
              iconLeft={<IconCloudDownload size="6" />}
              text={dictionary.components.coachingSession.downloadRecording}
            />
            <p className="text-xs text-text-secondary leading-[100%]">
              {description}
            </p>
          </div>
        )
      ) : (
        <>
          {status === 'canceled' && (
            <Badge
              variant="errorprimary"
              className="text-sm w-fit"
              text={dictionary.components.coachingSession.sessionCanceled}
              hasIconLeft
              iconLeft={<IconTrashAlt size="5" />}
            />
          )}
          {status === 'rescheduled' && (
            <div className="flex flex-col gap-2 items-center w-full">
              <div className="flex justify-between ga-3 w-full">
                <Button
                  text={dictionary.components.coachingSession.decline}
                  variant="secondary"
                  hasIconLeft
                  iconLeft={<IconClose size="6" />}
                />
                <Button
                  variant="primary"
                  text={dictionary.components.coachingSession.accept}
                  hasIconLeft
                  iconLeft={<IconCheck size="6" />}
                />
              </div>
              <Button
                variant="text"
                text={dictionary.components.coachingSession.suggestAnotherDate}
                hasIconLeft
                iconLeft={<IconCalendarAlt size="6" />}
              />
            </div>
          )}

          {status === 'ongoing' && (
            <div className="flex flex-col gap-1 items-start">
              <Button
                onClick={onJoin}
                variant="primary"
                size="medium"
                className="w-full"
                text={dictionary.components.coachingSession.joinMeeting}
              />
              <p className="text-xs text-text-secondary leading-[100%]">
                {meetingLink}
              </p>
            </div>
          )}

          {status === 'upcoming-locked' && (
            <div className="flex flex-col gap-1 items-start">
              <Button
                onClick={onJoin}
                variant="primary"
                size="medium"
                className="w-full"
                text={dictionary.components.coachingSession.joinMeeting}
                disabled
              />
              <p className="text-xs text-text-secondary leading-[100%]">
                {meetingLink}
              </p>
            </div>
          )}

          {status === 'requested' && (
            <div className="flex flex-col gap-2">
              <Badge
                className="flex items-center gap-1 px-3 py-1 rounded-lg w-fit"
                variant="info"
                size="big"
                text={dictionary.components.coachingSession.requestSent}
                hasIconLeft
                iconLeft={<IconHourglass size="5" />}
              />
              <Button
                onClick={onCancel}
                variant="secondary"
                size="medium"
                hasIconLeft
                iconLeft={<IconTrashAlt size="5" />}
                text={dictionary.components.coachingSession.cancelRequest}
              />
            </div>
          )}

          {status === 'upcoming-editable' && (
            <div className="flex flex-col gap-2">
              <Badge
                className="flex items-center gap-1 px-3 py-1 rounded-lg w-fit"
                variant="info"
                size="big"
                text={dictionary.components.coachingSession.hoursLeftToEdit}
              />
              <div className="flex gap-[9px] justify-between">
                <Button
                  onClick={onReschedule}
                  variant="primary"
                  size="small"
                  hasIconLeft
                  iconLeft={<IconCalendarAlt size="5" />}
                  text={dictionary.components.coachingSession.reschedule}
                />
                <Button
                  onClick={onCancel}
                  variant="secondary"
                  size="small"
                  hasIconLeft
                  iconLeft={<IconTrashAlt size="5" />}
                  text={dictionary.components.coachingSession.cancel}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
