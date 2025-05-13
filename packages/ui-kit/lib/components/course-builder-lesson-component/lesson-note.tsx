import { CourseElementTemplate, CourseElementType, DesignerComponentProps } from "../course-builder/types";
import { IconNotes } from "../icons/icon-notes";
import { LessonNoteBuilderView } from "../lesson-note/lesson-note-builder-view";
import { LessonNoteStudentView } from "../lesson-note/lesson-note-student-view";
import { LessonNoteBuilderViewType, LessonNoteStudentViewType } from "./types";

/**
 * Course element template definition for a Lesson Note.
 *
 * This object configures how the Lesson Note appears and behaves
 * within the course builder, including its icon, label, designer component,
 * and form component.
 *
 * @property type The type identifier for this course element (LessonNote).
 * @property designerBtnElement The button configuration (icon and label) for adding this element in the designer.
 * @property designerComponent The React component rendered in the course designer view.
 * @property formComponent The React component rendered in the student-facing form view.
 */

const LessonNoteElement: CourseElementTemplate ={
    type: CourseElementType.LessonNote,
    designerBtnElement: {
        icon: IconNotes,
        label: 'Lesson Note',
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
};

/**
 * DesignerComponent
 *
 * Renders the lesson note element within the course designer interface.
 * Provides the UI for editing and configuring the lesson note content.
 *
 * @param elementInstance The instance of the lesson note element being edited.
 * @param locale (Optional) The locale code for translations.
 *
 * @returns The lesson note builder view, or null if the element type does not match.
 *
 * @example
 * <DesignerComponent
 *   elementInstance={element}
 *   locale="en"
 * />
 */

function DesignerComponent({
    elementInstance,
    locale,
}: DesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.LessonNote) return null;
    return (
        <LessonNoteBuilderView 
            {...elementInstance as LessonNoteBuilderViewType}
            locale={locale}
        />
    )
};

/**
 * FormComponent
 *
 * Renders the student-facing view of the lesson note element.
 * Used in the course form where students can read or interact with the note.
 *
 * @param elementInstance The instance of the lesson note element to display.
 * @param locale (Optional) The locale code for translations.
 *
 * @returns The student view for a lesson note, or null if the element type does not match.
 *
 * @example
 * {FormComponent({ elementInstance, locale: "en" })}
 */

function FormComponent({
    elementInstance,
    locale,
}: DesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.LessonNote) return null;
    return (
        <LessonNoteStudentView 
            {...elementInstance as LessonNoteStudentViewType}
            locale={locale}
        />
    )
};

export default LessonNoteElement;