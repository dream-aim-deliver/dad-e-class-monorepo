import { getDictionary } from '@maany_shr/e-class-translations';
import { AssignmentBuilderView } from '../assignment-course-builder/assignment-builder-view';
import { AssignmentElement } from '../course-builder-lesson-component/types';
import {
    CreateAssignmentBuilderView,
    CreateAssignmentProps,
} from '../assignment-course-builder/create-assignment-builder-view';
import {
    CourseElementTemplate,
    CourseElementType,
    DesignerComponentProps,
    FormComponentProps,
} from '../course-builder/types';
import DesignerLayout from '../designer-layout';
import { IconAssignment } from '../icons';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';
import { fileMetadata } from '@maany_shr/e-class-models';

/**
 * Course element template definition for a Coaching Session.
 *
 * This object configures how the Coaching Session appears and behaves
 * within the course builder, including its icon, label, designer component,
 * and form component.
 *
 * @property type The type identifier for this course element (Assignment).
 * @property designerBtnElement The button configuration (icon and label) for adding this element in the designer.
 * @property designerComponent The React component rendered in the course designer view.
 * @property formComponent The React component rendered in the student-facing form view.
 */

const assignmentElement: CourseElementTemplate = {
    type: CourseElementType.Assignment,
    designerBtnElement: {
        icon: IconAssignment,
        label: 'Assignment',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    // @ts-ignore
    formComponent: FormComponent,
};

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.Assignment)
        return dictionary.components.lessons.typeValidationText;

    if (!elementInstance.title || elementInstance.title.trim().length === 0) {
        return dictionary.components.assignmentLesson.titleValidationText;
    }

    if (
        !elementInstance.description ||
        elementInstance.description.trim().length === 0
    ) {
        return dictionary.components.assignmentLesson.descriptionValidationText;
    }

    return undefined;
};

/**
 * DesignerComponent
 *
 * Renders the assignment element within the course designer interface.
 * Provides editing controls (move up, move down, delete) and displays the assignment builder UI.
 *
 * @param elementInstance The instance of the assignment element being edited.
 * @param onUpClick Callback for moving the element up in the list.
 * @param onDownClick Callback for moving the element down in the list.
 * @param onDeleteClick Callback for deleting the element.
 * @param locale (Optional) The locale code for translations.
 *
 * @returns The designer layout for an assignment, or null if the element type does not match.
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

interface AssignmentDesignerComponentProps
    extends Omit<CreateAssignmentProps, 'elementInstance'>,
        DesignerComponentProps {
    uploadProgress?: number;
}

export function DesignerComponent({
    elementInstance,
    onUpClick,
    onDownClick,
    onDeleteClick,
    locale,
    validationError,
    uploadProgress,
    ...props
}: AssignmentDesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.Assignment) return null;
    const dictionary = getDictionary(locale);
    return (
        <DesignerLayout
            data-testid="designer-layout"
            type={elementInstance.type}
            title={
                dictionary.components.assignment.assignmentBuilder
                    .assignmentText
            }
            icon={<IconAssignment classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
            validationError={validationError}
        >
            <CreateAssignmentBuilderView
                elementInstance={elementInstance as AssignmentElement}
                locale={locale}
                uploadProgress={uploadProgress}
                {...props}
            />
        </DesignerLayout>
    );
}

/**
 * formComponent
 *
 * Renders the student-facing view of the assignment element.
 * Used in the course form where students interact with the assignment.
 *
 * @param elementInstance The instance of the assignment element to display.
 * @param locale (Optional) The locale code for translations.
 *
 * @returns The student view for an assignment.
 *
 * @example
 * {formComponent({ elementInstance, locale: "en" })}
 */

interface AssignmentFormProps extends FormComponentProps {
    onFileDownload: (fileMetadata: fileMetadata.TFileMetadata) => void;
    viewButton?: React.ReactNode;
}

export function FormComponent({
    elementInstance,
    locale,
    onFileDownload,
    viewButton,
}: AssignmentFormProps) {
    if (elementInstance.type !== CourseElementType.Assignment) return null;

    const dictionary = getDictionary(locale);

    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    return (
        <AssignmentBuilderView
            elementInstance={elementInstance as unknown as AssignmentElement}
            locale={locale}
            onFileDownload={onFileDownload}
            viewButton={viewButton}
        />
    );
}

export default assignmentElement;
