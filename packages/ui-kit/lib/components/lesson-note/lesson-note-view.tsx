import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { Button } from "../button";
import RichTextRenderer from "../rich-text-element/renderer";

export interface LessonNoteViewType extends isLocalAware {
    lessonNumber: number;
    lessonTitle: string;
    lessonDescription: string;
    onClickViewLesson: () => void;
};

/**
 * LessonNoteView Component
 * 
 * @component
 * @props {LessonNoteViewType} props - The component props.
 * @props {number} props.lessonNumber - The number of the lesson.
 * @props {string} props.lessonTitle - The title of the lesson.
 * @props {string} props.lessonDescription - A brief description of the lesson.
 * @props {() => void} props.onClickViewLesson - Callback function triggered when the "View Lesson" button is clicked.
 * @props {string} props.locale - The locale used to fetch the appropriate dictionary for translations.
 *
 * @returns {JSX.Element} A styled card component displaying lesson details, including the lesson number, title, description, and a button to view the lesson.
 * 
 * @example Standard usage
 * ```
 * <LessonNoteView
 *   lessonNumber={1}
 *   lessonTitle="Introduction to Programming"
 *   lessonDescription="Learn the basics of programming, including variables, loops, and functions."
 *   onClickViewLesson={() => console.log('View Lesson clicked')}
 *   locale="en"
 * />
 * ```
 */

export const LessonNoteView: FC<LessonNoteViewType> = ({
    lessonNumber,
    lessonTitle,
    lessonDescription,
    onClickViewLesson,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex flex-col gap-4 p-4 bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium w-full">
            <div className="flex items-center justify-between gap-4 w-full">
                <h5 className="text-text-primary text-lg font-bold leading-[120%]">
                    {dictionary.components.lessonNotes.lessonText} {lessonNumber} - {lessonTitle}
                </h5>
                <Button
                    variant="text"
                    text={dictionary.components.lessonNotes.viewLessonText}
                    onClick={onClickViewLesson}
                    size="small"
                />
            </div>
            <div
                className="bg-divider h-[1px] w-full"
            />
            <p className="text-text-secondary text-lg leading-[150%]">
                <RichTextRenderer content={lessonDescription} />
            </p>
        </div>
    );
};