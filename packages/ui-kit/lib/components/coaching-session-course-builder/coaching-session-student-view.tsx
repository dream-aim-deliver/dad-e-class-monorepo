import { FC } from "react";
import { CoachingSessionStudentViewTypes } from "../course-builder-lesson-component/types";

/**
 * A component that displays the student view of a coaching session.
 * It includes a header and renders any child components passed to it.
 *
 * @param type The type of the coaching session.
 * @param id The unique ID of the coaching session.
 * @param order The order of the coaching session in the course.
 * @param children The child components to be rendered inside the coaching session view.
 * @param studentHadSessionBeforeInCourse Indicates whether the student has had a session before in the course.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CoachingSessionStudentView
 *   type="group"
 *   id={2}
 *   order={1}
 *   studentHadSessionBeforeInCourse={true}
 *   locale="en"
 * >
 *   <p>This is the content of the coaching session.</p>
 * </CoachingSessionStudentView>
 */

export const CoachingSessionStudentView: FC<CoachingSessionStudentViewTypes> = ({
        type,
        id,
        order,
        children,
        studentHadSessionBeforeInCourse,
        locale,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card-fill border-1 border-card-stroke rounded-medium">
        {children}
    </div>
  );
};