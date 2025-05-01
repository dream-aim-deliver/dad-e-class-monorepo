import { FC } from "react";

export interface LessonLinkProps {
    children: React.ReactNode;
};

/**
 * LessonLink component that acts as a container for lesson-related items.
 *
 * This component arranges its children (such as milestones and lesson items) in a vertical column.
 * It is typically used to group a sequence of milestones and lesson links, providing structural layout
 * for course outlines or lesson navigation lists.
 *
 * @param children The React nodes to be displayed inside the container. This can include Milestone components,
 * LessonLinkItem components, or any other elements relevant to the lesson navigation.
 *
 * @returns A flex column container that renders its children in order.
 *
 * @example
 * // Usage with milestones and lesson items
 * <LessonLink>
 *   <div className="py-2">
 *     <Milestone completed={false} locale="en" />
 *   </div>
 *   {lessons.map((lesson, index) => (
 *     <LessonLinkItem
 *       key={index}
 *       lessonTitle={lesson.lessonTitle}
 *       lessonNumber={lesson.lessonNumber}
 *       isCompleted={lesson.isCompleted}
 *       isActive={lesson.isActive}
 *       isOptional={lesson.isOptional}
 *       isUpdated={lesson.isUpdated}
 *       locale={lesson.locale}
 *       onClick={() => handleLessonClick(lesson.lessonNumber)}
 *     />
 *   ))}
 *   <div className="py-2">
 *     <Milestone completed={true} locale="en" />
 *   </div>
 * </LessonLink>
 */

export const LessonLink: FC<LessonLinkProps> = ({ 
    children 
}) => {
    return (
        <div className="flex flex-col">
            {children}
        </div>
    );
}