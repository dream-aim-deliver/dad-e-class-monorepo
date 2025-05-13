import { FC } from "react";
import { LessonNoteStudentViewType } from "../course-builder-lesson-component/types";
import { getDictionary } from "@maany_shr/e-class-translations";

/**
 * LessonNoteStudentView Component
 * 
 * @component
 * @props {LessonNoteStudentViewType} props - The component props.
 * @props {number} props.ModuleNumber - The number of the module.
 * @props {string} props.ModuleTitle - The title of the module.
 * @props {ReactNode} props.children - One or more `LessonNoteView` components or other elements to be displayed within the module view.
 *
 * @returns {JSX.Element} A styled card component displaying module details, including the module number, title, and any child components or elements.
 * 
 * @example Standard usage with a single `LessonNoteView`
 * ```
 * <LessonNoteStudentView
 *   ModuleNumber={1}
 *   ModuleTitle="Introduction to Programming"
 * >
 *   <LessonNoteView
 *     LessonNumber={1}
 *     LessonTitle="Getting Started"
 *     LessonDescription="Learn the basics of programming."
 *     onClickViewLesson={() => console.log('View Lesson clicked')}
 *     locale="en"
 *   />
 * </LessonNoteStudentView>
 * ```
 * 
 * @example Standard usage with multiple `LessonNoteView` components
 * ```
 * <LessonNoteStudentView
 *   ModuleNumber={2}
 *   ModuleTitle="Advanced Topics"
 * >
 *   <LessonNoteView
 *     LessonNumber={1}
 *     LessonTitle="Data Structures"
 *     LessonDescription="Learn about arrays, linked lists, and more."
 *     onClickViewLesson={() => console.log('View Lesson clicked')}
 *     locale="en"
 *   />
 *   <LessonNoteView
 *     LessonNumber={2}
 *     LessonTitle="Algorithms"
 *     LessonDescription="Explore sorting and searching algorithms."
 *     onClickViewLesson={() => console.log('View Lesson clicked')}
 *     locale="en"
 *   />
 * </LessonNoteStudentView>
 * ```
 */

export const LessonNoteStudentView: FC<LessonNoteStudentViewType> = ({
    ModuleNumber,
    ModuleTitle,
    children,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex flex-col gap-4 p-6 bg-card-fill border-1 border-stroke rounded-medium w-full">
            <p className="text-base-white text-xl font-bold leading-[120%]">
                {dictionary.components.lessonNotes.moduleText} {ModuleNumber} - {ModuleTitle}
            </p>
            {children}
        </div>
    );
};