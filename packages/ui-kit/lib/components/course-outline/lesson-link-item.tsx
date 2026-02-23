import { FC } from "react";
import { IconCheck } from "../icons/icon-check";
import { Badge } from "../badge";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { cn } from "../../utils/style-utils";

export interface LessonLinkItemProps extends isLocalAware {
    lessonTitle: string;
    lessonNumber: number;
    isActive: boolean;
    isCompleted?: boolean;
    isOptional?: boolean;
    isUpdated?: boolean;
    onClick?: () => void
};

/**
 * LessonLinkItem component renders a clickable lesson entry with status indicators.
 *
 * Displays the lesson number, title, and optional badges/icons indicating completion,
 * optional status, and recent updates. Highlights the active lesson visually.
 *
 * @param lessonTitle The title of the lesson to display.
 * @param lessonNumber The numeric order of the lesson.
 * @param isActive A boolean indicating if this lesson is currently active/selected.
 * @param isCompleted Optional boolean indicating if the lesson is completed; shows a check icon if true.
 * @param isOptional Optional boolean indicating if the lesson is optional; shows an "Optional" badge if true.
 * @param isUpdated Optional boolean indicating if the lesson has been recently updated; shows an "Updated" badge if true.
 * @param onClick Optional callback function to handle click events on the lesson item.
 * @param locale The locale string used to fetch localized text for badges.
 *
 * @returns A styled, interactive lesson link item with localized badges and icons.
 *
 * @example
 * // Render an active, completed lesson with optional and updated badges in English locale
 * <LessonLinkItem
 *   lessonTitle="Introduction to React"
 *   lessonNumber={1}
 *   isActive={true}
 *   isCompleted={true}
 *   isOptional={true}
 *   isUpdated={true}
 *   onClick={() => console.log('Lesson clicked')}
 *   locale="en"
 * />
 *
 * @example
 * // Render an inactive, incomplete lesson without optional or updated badges in German locale
 * <LessonLinkItem
 *   lessonTitle="Fortgeschrittene Konzepte"
 *   lessonNumber={5}
 *   isActive={false}
 *   locale="de"
 * />
 */

export const LessonLinkItem: FC<LessonLinkItemProps> = ({
    lessonTitle,
    lessonNumber,
    isCompleted,
    isActive,
    isOptional,
    isUpdated,
    onClick,
    locale
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div
            className="flex items-center p-2 gap-2 w-full hover:bg-base-neutral-800 rounded-medium cursor-pointer"
            role="lesson-link-item"
            data-testid="lesson-link-item"
            onClick={onClick}
        >
            <p className={cn('text-xs', isActive ? 'text-action-default' : 'text-text-primary')}>
                {lessonNumber}.
            </p>
            <p
                title={lessonTitle}
                className={cn(
                    'text-sm line-clamp-2 flex-1 min-w-0',
                    'break-words',
                    isActive ? 'text-action-default font-bold' : 'text-text-primary'
                )}
            >
                {lessonTitle}
            </p>
            {isCompleted && (
                <IconCheck
                    classNames="text-feedback-success-primary"
                />
            )}
            {isOptional && (
                <Badge
                    variant="info"
                    size="small"
                    text={dictionary.components.courseOutline.optionalText}
                />
            )}
            {isUpdated && (
                <Badge
                    size="small"
                    text={dictionary.components.courseOutline.updatedText}
                    className="bg-action-default"
                />
            )}
        </div>
    );
};