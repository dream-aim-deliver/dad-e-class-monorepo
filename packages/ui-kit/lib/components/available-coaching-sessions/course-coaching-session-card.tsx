import { cn } from '../../utils/style-utils';
import { FC } from 'react';

export interface CourseCoachingSessionCardProps {
    sessionTitle: string;
    sessionDuration: number;
    courseTitle: string;
    durationMinutes?: string;
    onClick?: () => void;
}

export const CourseCoachingSessionCard: FC<CourseCoachingSessionCardProps> = ({
    sessionTitle,
    sessionDuration,
    courseTitle,
    durationMinutes,
    onClick,
}) => {
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
            </div>
        </div>
    );
};
