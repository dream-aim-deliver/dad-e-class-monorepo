import { getDictionary } from "@maany_shr/e-class-translations";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import { IconCoachingSession } from "../icons/icon-coaching-session";
import { CoachingSessionBuilderView } from "../coaching-session-course-builder/coaching-session-builder-view";
import { CoachingSessionStudentViewTypes, CoachingSessionTypes } from "./types";
import { CoachingSessionStudentView } from "../coaching-session-course-builder/coaching-session-student-view";
import DesignerLayout from "../designer-layout";

/**
 * Course element template definition for a Coaching Session.
 * 
 * This object configures how the Coaching Session appears and behaves
 * within the course builder, including its icon, label, designer component,
 * and form component.
 * 
 * @property type The type identifier for this course element (CoachingSession).
 * @property designerBtnElement The button configuration (icon and label) for adding this element in the designer.
 * @property designerComponent The React component rendered in the course designer view.
 * @property formComponent The React component rendered in the student-facing form view.
 */

const coachingSessionElement: CourseElementTemplate = {
    type: CourseElementType.CoachingSession,
    designerBtnElement: {
        icon: IconCoachingSession,
        label: "Coaching Session"
    },
    designerComponent: DesignerComponent,
    formComponent: formComponent,
};

/**
 * DesignerComponent
 * 
 * Renders the coaching session element within the course designer interface.
 * Provides editing controls (move up, move down, delete) and displays the session builder UI.
 * 
 * @param elementInstance The instance of the coaching session element being edited.
 * @param onUpClick Callback for moving the element up in the list.
 * @param onDownClick Callback for moving the element down in the list.
 * @param onDeleteClick Callback for deleting the element.
 * @param locale (Optional) The locale code for translations.
 * 
 * @returns The designer layout for a coaching session, or null if the element type does not match.
 * 
 * @example
 * <DesignerComponent
 *   elementInstance={element}
 *   onUpClick={handleUp}
 *   onDownClick={handleDown}
 *   onDeleteClick={handleDelete}
 *   locale="en"
 * />
 */

function DesignerComponent({
    elementInstance,
    onUpClick,
    onDownClick,
    onDeleteClick,
    locale,
}: DesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.CoachingSession) return null;
    const dictionary = getDictionary(locale);
    return (
        <DesignerLayout
            data-testid="designer-layout"
            type={elementInstance.type}
            title={dictionary.components.coachingSessionCourseBuilder.coachingSessionText}
            icon={<IconCoachingSession classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <CoachingSessionBuilderView
                {...(elementInstance as CoachingSessionTypes)}
                locale={locale}
            />
        </DesignerLayout>
    );
};

/**
 * formComponent
 * 
 * Renders the student-facing view of the coaching session element.
 * Used in the course form where students interact with the session.
 * 
 * @param elementInstance The instance of the coaching session element to display.
 * @param locale (Optional) The locale code for translations.
 * 
 * @returns The student view for a coaching session.
 * 
 * @example
 * {formComponent({ elementInstance, locale: "en" })}
 */

// TODO: replace this with normal implementation after a refactor
function formComponent({ elementInstance, locale }: FormComponentProps) {
    return <div>Mock Coaching Session</div>;
};

export default coachingSessionElement;