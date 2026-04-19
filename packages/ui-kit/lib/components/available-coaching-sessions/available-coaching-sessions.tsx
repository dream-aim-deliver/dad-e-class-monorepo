"use client";
import { Button } from '../button';
import { FC, useRef, useState } from 'react';
import { AvailableCoachingSessionCard } from './available-coaching-session-card';
import { CourseCoachingSessionCard } from './course-coaching-session-card';
import Tooltip from '../tooltip';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface CoachingSessionData {
    title: string;
    time: number;
    numberOfSessions: number;
}

export interface CourseCoachingSessionData {
    courseTitle: string;
    courseSlug: string;
    courseImageUrl?: string | null;
    sessionTitle: string;
    sessionDuration: number;
    sessionId: number;
    lessonId?: number | null;
    moduleName?: string | null;
    lessonName?: string | null;
    moduleIndex?: number | null;
    moduleTotalCount?: number | null;
    lessonIndex?: number | null;
    lessonTotalCount?: number | null;
}

export interface AvailableCoachingSessionsProps extends isLocalAware {
    text?: string;
    buttonText?: string;
    availableCoachingSessionsData: CoachingSessionData[];
    onClickBuyMoreSessions: () => void;
    isLoading?: boolean;
    hideButton?: boolean;
    hideTitle?: boolean;
    isDraggable?: boolean;
    courseCoachingSessionsData?: CourseCoachingSessionData[];
    onClickCourseSession?: (data: CourseCoachingSessionData) => void;
}

/**
 * A component that displays and manages available coaching sessions with drag-and-drop functionality.
 *
 * @param locale The locale for internationalization, used to fetch the appropriate dictionary.
 * @param text Optional description text for the available sessions section.
 * @param availableCoachingSessionsData Array of coaching session data, each containing id, title, time, and numberOfSessions.
 * @param onClickBuyMoreSessions Handler function for the "Buy More Sessions" button click.
 * @param isLoading Optional boolean indicating if the component is in a loading state (default: false).
 * @param onSessionDrag Optional handler function triggered when a session is dragged, receiving the session ID.
 *
 * @example
 * <AvailableCoachingSessions
 *   locale="en"
 *   text="Drag sessions to schedule"
 *   availableCoachingSessionsData={[
 *     { id: "1", title: "Intro Session", time: 60, numberOfSessions: 2 },
 *     { id: "2", title: "Advanced Session", time: 90, numberOfSessions: 1 }
 *   ]}
 *   onClickBuyMoreSessions={() => console.log("Buy more clicked")}
 *   isLoading={false}
 *   onSessionDrag={(sessionId) => console.log(`Session ${sessionId} dragged`)}
 * />
 *
 * @example
 * <AvailableCoachingSessions
 *   locale="en"
 *   availableCoachingSessionsData={[]}
 *   onClickBuyMoreSessions={() => console.log("Buy more clicked")}
 * />
 */
export const AvailableCoachingSessions: FC<AvailableCoachingSessionsProps> = ({
    locale,
    text,
    buttonText,
    availableCoachingSessionsData,
    onClickBuyMoreSessions,
    isLoading = false,
    hideButton = false,
    hideTitle = false,
    isDraggable = false,
    courseCoachingSessionsData,
    onClickCourseSession,
}) => {
    const dictionary = getDictionary(locale);
    const hasCourseData = courseCoachingSessionsData && courseCoachingSessionsData.length > 0;
    const hasStandaloneData = availableCoachingSessionsData && availableCoachingSessionsData.length > 0;
    const showSectionHeaders = hasCourseData;

    return (
        <div
            className="z-30 select-none flex flex-col items-start p-4 gap-[0.875rem] bg-card-fill rounded-medium h-fit w-full shadow-lg"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
        >
            {!hideTitle && (
                <p className="text-lg text-text-primary font-bold leading-[120%]">
                    {dictionary?.components?.availableCoachingSessions?.title}
                </p>
            )}
            {!isLoading && !hasStandaloneData && !hasCourseData ? (
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
                            {
                                dictionary?.components
                                    ?.availableCoachingSessions?.loadingText
                            }
                        </p>
                    ) : text ? (
                        <p className="text-[0.875rem] text-text-secondary leading-[150%]">
                            {text}
                        </p>
                    ) : null}

                    {/* Standalone Coaching Sessions */}
                    {showSectionHeaders && (
                        <div className="flex items-center gap-1">
                            <p className="text-sm text-text-primary font-semibold leading-[120%]">
                                {dictionary?.components?.availableCoachingSessions?.standaloneTitle}
                            </p>
                            <Tooltip text="" description={dictionary?.components?.availableCoachingSessions?.standaloneTooltip || ''} />
                        </div>
                    )}
                    <div className="flex flex-col gap-2 items-end w-full">
                        {isLoading || !availableCoachingSessionsData ? (
                            <>
                                <AvailableCoachingSessionCard
                                    isLoading={isLoading}
                                />
                                <AvailableCoachingSessionCard
                                    isLoading={isLoading}
                                />
                                <AvailableCoachingSessionCard
                                    isLoading={isLoading}
                                />
                            </>
                        ) : hasStandaloneData ? (
                            availableCoachingSessionsData.map((session) => {
                                return (
                                    <div key={session.title} className="w-full">
                                        <AvailableCoachingSessionCard
                                            key={session.title}
                                            {...session}
                                            numberOfSessions={
                                                session.numberOfSessions
                                            }
                                            durationMinutes={
                                                dictionary?.components
                                                    ?.availableCoachingSessions
                                                    ?.durationMinutes
                                            }
                                        />
                                    </div>
                                );
                            })
                        ) : showSectionHeaders ? (
                            <div className="flex items-center justify-center w-full">
                                <p className="text-[0.875rem] text-text-secondary leading-[150%]">
                                    {
                                        dictionary?.components
                                            ?.availableCoachingSessions
                                            ?.noAvailableSessionText
                                    }
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {/* Course Coaching Sessions */}
                    {hasCourseData && (
                        <>
                            <div className="flex items-center gap-1 mt-2">
                                <p className="text-sm text-text-primary font-semibold leading-[120%]">
                                    {dictionary?.components?.availableCoachingSessions?.courseTitle}
                                </p>
                                <Tooltip text="" description={dictionary?.components?.availableCoachingSessions?.courseTooltip || ''} />
                            </div>
                            <div className="flex flex-col gap-2 items-end w-full">
                                {courseCoachingSessionsData.map((session) => (
                                    <div key={`${session.courseSlug}-${session.sessionId}`} className="w-full">
                                        <CourseCoachingSessionCard
                                            sessionTitle={session.sessionTitle}
                                            sessionDuration={session.sessionDuration}
                                            courseTitle={session.courseTitle}
                                            moduleName={session.moduleName}
                                            lessonName={session.lessonName}
                                            moduleIndex={session.moduleIndex}
                                            moduleTotalCount={session.moduleTotalCount}
                                            lessonIndex={session.lessonIndex}
                                            lessonTotalCount={session.lessonTotalCount}
                                            durationMinutes={
                                                dictionary?.components
                                                    ?.availableCoachingSessions
                                                    ?.durationMinutes
                                            }
                                            onClick={() => onClickCourseSession?.(session)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
            {!hideButton && (
                <Button
                    className="w-full"
                    onClick={onClickBuyMoreSessions}
                    text={
                        buttonText ?? dictionary?.components?.availableCoachingSessions
                            ?.buyMoreSessions
                    }
                />
            )}
        </div>
    );
};
