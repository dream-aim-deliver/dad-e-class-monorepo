import { getDictionary } from "@maany_shr/e-class-translations";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import { Links } from "./types";
import DesignerLayout from "../designer-layout";
import { IconLink } from "../icons/icon-link";
import { LinkBuilderView } from "../links/link-builder-view";
import { LinkView } from "../links/link-view";

/**
 * Course element template definition for a Links element.
 *
 * This object configures how the Links element appears and behaves
 * within the course builder, including its icon, label, designer component,
 * and form component.
 * 
 * @property type The type identifier for this course element (Links).
 * @property designerBtnElement The button configuration (icon and label) for adding this element in the designer.
 * @property designerComponent The React component rendered in the course designer view.
 * @property formComponent The React component rendered in the student-facing form view.
 */

const linksElement: CourseElementTemplate = {
    type: CourseElementType.Links,
    designerBtnElement: {
        icon: IconLink,
        label: "Links"
    },
    designerComponent: DesignerComponent,
    formComponent: formComponent,
};

/**
 * DesignerComponent
 *
 * Renders the links element within the course designer interface.
 * Provides editing controls (move up, move down, delete) and displays the links builder UI.
 *
 * @param elementInstance The instance of the links element being edited.
 * @param onUpClick Callback for moving the element up in the list.
 * @param onDownClick Callback for moving the element down in the list.
 * @param onDeleteClick Callback for deleting the element.
 * @param locale (Optional) The locale code for translations.
 *
 * @returns The designer layout for a links element, or null if the element type does not match.
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
    if (elementInstance.type !== CourseElementType.Links) return null;
    const dictionary = getDictionary(locale);

    return (
        <DesignerLayout
            data-testid="designer-layout"
            type={elementInstance.type}
            title={dictionary.components.link.linksText}
            icon={<IconLink classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <LinkBuilderView
                {...(elementInstance as Links)}
                locale={locale}
            />
        </DesignerLayout>
    );
};

/**
 * formComponent
 * 
 * @param elementInstance The instance of the links element to display.
 * @param locale (Optional) The locale code for translations.
 *
 * @returns The student view for a links element.
 *
 * @example
 * {formComponent({ elementInstance, locale: "en" })}
 */

function formComponent({ elementInstance, locale }: FormComponentProps) {
    return (
        <LinkView
            {...(elementInstance as Links)}
            locale={locale}
        />
    );
};

export default linksElement;