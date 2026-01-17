import {
    FormElement,
    FormElementTemplate,
    FormElementType,
    DesignerComponentProps,
    valueType,
    FormComponentProps,
} from '../pre-assessment/types';
import DesignerLayout from '../designer-layout';
import { IconHeading } from '../icons/icon-heading';
import {
    HeadingLesson,
    HeadingLessonPreview,
    HeadingType,
} from '../heading-type';
import { ElementValidator } from '../lesson/types';
import { getDictionary } from '@maany_shr/e-class-translations';
import DefaultError from '../default-error';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary, context = 'coach' } = props;

    if (elementInstance.type !== FormElementType.HeadingText)
        return dictionary.components.lessons.typeValidationText;

    // Student validation: Heading is display-only, no user input validation needed
    if (context === 'student') {
        return undefined; // Always pass for student
    }

    // Coach validation: Check element structure (course builder - both designer and preview)
    // Check if heading content exists
    if (
        !elementInstance.heading ||
        elementInstance.heading.trim().length === 0
    ) {
        return dictionary.components.headingLesson.headingValidationText;
    }

    return undefined;
};

/**
 * Template for the Heading form element
 * Defines the component's behavior, validation, and UI elements
 */
const headingTextElement: FormElementTemplate = {
    type: FormElementType.HeadingText,
    designerBtnElement: {
        icon: IconHeading,
        label: 'Heading',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
};
/**
 * Heading  for Pre-Assessment
 * This component provides a rich text display element for pre-assessment forms.
 * It supports formatted text content display and validation.
 *
 * Features:
 * - Rich text content display
 * - Required field validation
 * - Form submission handling
 * - Helper text display
 *
 * @example
 * ```tsx
 * <RichText
 *   elementInstance={{
 *     type: FormElementType.RichText,
 *     id: "rich-text-1",
 *     required: true,
 *     content: "Welcome to the assessment"
 *   }}
 * />
 * ```
 */

interface HeadingDesignerComponentProps extends DesignerComponentProps {
    onChange: (value: HeadingType) => void;
}

export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onChange,
    isCourseBuilder,
    validationError,
}: HeadingDesignerComponentProps) {
    const dictionary = getDictionary(locale);

    if (elementInstance.type !== FormElementType.HeadingText) return null;

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.lessons.heading}
            icon={<IconHeading classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={isCourseBuilder}
            validationError={validationError}
        >
            <HeadingLesson
                initialHeadingType={elementInstance.headingType}
                initialHeadingValue={elementInstance.heading}
                locale={locale}
                onChange={onChange}
            />
        </DesignerLayout>
    );
}

/**
 * Form Component for Rich Text
 * Renders the rich text content in the form view
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== FormElementType.HeadingText) return null;

    const dictionary = getDictionary(locale);
    const validationError = getValidationError({
        elementInstance,
        dictionary,
        context: 'coach',
    });
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

    const heading = elementInstance.heading || ''; // Default to "h1" if undefined
    const type = elementInstance.headingType || 'h1';

    const headingValue = {
        heading,
        type,
    };

    return <HeadingLessonPreview headingValue={headingValue} />;
}

/**
 * View Component for Rich Text
 * Renders the read-only view of the rich text content
 */
function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.HeadingText) return null;

    const heading = elementInstance.heading || '';
    // NOTE: Defaults to "h1" if undefined
    const type = elementInstance.headingType || 'h1';

    const headingValue = {
        heading,
        type,
    };

    return (
        <div className="text-text-primary flex flex-col gap-2">
            <HeadingLessonPreview headingValue={headingValue} />
        </div>
    );
}

export default headingTextElement;
