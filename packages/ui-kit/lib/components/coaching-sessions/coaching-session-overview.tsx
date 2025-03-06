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

/**
 * CoachingSessionOverview component displays details of a coaching session,
 * including title, duration, date, time, creator information, session status,
 * and relevant action buttons.
 *
 * @param status The current status of the session (e.g., ongoing, upcoming, canceled, etc.).
 * @param userRole The role of the user (either 'student' or 'coach').
 * @param hasReview Boolean indicating if the session has a review.
 * @param hasCallQualityRating Boolean indicating if call quality rating is available.
 * @param withinCourse Boolean flag indicating if the session is part of a course.
 * @param groupSession Boolean flag indicating if the session is a group session.
 * @param title The title of the coaching session.
 * @param duration The duration of the session.
 * @param date The scheduled date of the session.
 * @param time The scheduled time of the session.
 * @param creatorName The name of the session creator.
 * @param courseName The name of the associated course (if any).
 * @param groupName The name of the associated group (if any).
 * @param meetingLink The link to join the session (if applicable).
 * @param description Additional session description or notes.
 * @param onJoin Function triggered when the user joins the session.
 * @param onCancel Function triggered when the user cancels the session.
 * @param onReschedule Function triggered when the session is rescheduled.
 * @param locale The locale for translations.
 *
 * @example
 * <CoachingSessionOverview
 *   status="ongoing"
 *   userRole="coach"
 *   title="1-on-1 Coaching"
 *   duration="45 mins"
 *   date="2024-06-12"
 *   time="10:00 AM"
 *   creatorName="Jane Doe"
 *   courseName="Leadership Training"
 *   groupName="Team Growth"
 *   meetingLink="https://zoom.com/session123"
 *   onJoin={() => console.log("Joining session")}
 *   onCancel={() => console.log("Canceling session")}
 *   onReschedule={() => console.log("Rescheduling session")}
 * />
 */

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
      className={`flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-[18rem] md:w-[22rem]`}
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
          <div className="flex flex-wrap gap-4 text-text-primary">
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
            text="flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-full"
          />
        </>
      )}

      <CreatorInfo
        withinCourse={withinCourse || hasReview}
        userRole={userRole}
        groupSession={groupSession}
        creatorName={creatorName || ''}
        courseName={courseName || ''}
        groupName={groupName || ''}
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
              <div className="flex justify-between gap-3 w-full">
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
