import { cn } from '../../utils/style-utils';
import { FC } from 'react';

export interface CourseCoachingSessionCardProps {
    sessionTitle: string;
    sessionDuration: number;
    courseTitle: string;
    durationMinutes?: string;
    onClick?: () => void;
    moduleName?: string | null;
    lessonName?: string | null;
    moduleIndex?: number | null;
    moduleTotalCount?: number | null;
    lessonIndex?: number | null;
    lessonTotalCount?: number | null;
}

function formatModulePart(moduleIndex?: number | null, moduleTotalCount?: number | null, moduleName?: string | null): string | null {
    if (!moduleName && moduleIndex == null) return null;
    const counter = (moduleIndex != null && moduleTotalCount != null) ? `${moduleIndex}/${moduleTotalCount} ` : '';
    const name = moduleName ? `('${moduleName}')` : '';
    return `Module ${counter}${name}`.trim();
}

function formatLessonPart(lessonIndex?: number | null, lessonTotalCount?: number | null, lessonName?: string | null): string | null {
    if (!lessonName && lessonIndex == null) return null;
    const counter = (lessonIndex != null && lessonTotalCount != null) ? `${lessonIndex}/${lessonTotalCount} ` : '';
    const name = lessonName ? `('${lessonName}')` : '';
    return `Lesson ${counter}${name}`.trim();
}

export const CourseCoachingSessionCard: FC<CourseCoachingSessionCardProps> = ({
    sessionTitle,
    sessionDuration,
    courseTitle,
    durationMinutes,
    onClick,
    moduleName,
    lessonName,
    moduleIndex,
    moduleTotalCount,
    lessonIndex,
    lessonTotalCount,
}) => {
    const modulePart = formatModulePart(moduleIndex, moduleTotalCount, moduleName);
    const lessonPart = formatLessonPart(lessonIndex, lessonTotalCount, lessonName);
    const moduleLesson = [modulePart, lessonPart].filter(Boolean).join(' › ') || null;

    return (
        <div
            className={cn(
                "flex gap-2 p-2 items-center justify-between bg-card-stroke border border-divider rounded-medium w-full",
                "cursor-pointer hover:bg-card-fill"
            )}
            onClick={onClick}
        >
            <div className="flex flex-col gap-1 items-start">
                <p className="text-sm text-text-primary font-bold leading-[100%]">
                    {sessionTitle}
                </p>
                <p className="text-sm text-text-secondary leading-[100%]">
                    {sessionDuration} {durationMinutes}
                </p>
                <p className="text-xs text-text-secondary leading-[100%]">
                    {courseTitle}
                </p>
                {moduleLesson && (
                    <p className="text-xs text-text-secondary leading-[100%]">
                        {moduleLesson}
                    </p>
                )}
            </div>
        </div>
    );
};
