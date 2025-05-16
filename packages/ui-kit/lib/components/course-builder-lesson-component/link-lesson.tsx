import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconCloudDownload } from "../icons/icon-cloud-download";
import { LinkEdit, LinkPreview } from "../component-link";
import { IconPlus } from "../icons/icon-plus";
import { LinkLessonPreview } from "./types";
import { CheckBox } from "../checkbox";
import { IconLink } from "../icons/icon-link";

/**
 * Template configuration for the Link Lesson course element
 * Defines the type, design elements, and component mappings for the links feature
 * This element allows course creators to add external links and resources to their courses
 */
const linkElement: CourseElementTemplate = {
    type: CourseElementType.Links,
    designerBtnElement: {
        icon: IconCloudDownload,
        label: "Links"
    },
    designerComponent: DesignerComponent as React.FC<DesignerComponentProps>,
    formComponent: FormComponent
};

/** 
 * Represents a link item in the course content
 * @property title - The display title of the link
 * @property url - The URL the link points to
 * @property file - Optional custom icon file for the link
 * @property isEdit - Whether the link is currently being edited
 */
export type LinkType = {
    title: string;
    url: string;
    file?: File | null;
    isEdit?: boolean;
};

/**
 * Extended props interface for the Link Designer component
 * Adds link management capabilities to the base designer props
 */
interface DesignerComponentExtendedProps extends DesignerComponentProps {
    /** Array of link items to display and manage */
    links: LinkType[];
    /** Whether to include these links in course materials */
    includeInMaterials: boolean;
    /** Callback for when links or materials setting changes */
    onChange: (links: LinkType[], includeInMaterials: boolean) => void;
}

/**
 * Designer Component for Link Lesson
 * Provides an interface for managing a collection of links in the course builder
 * Allows adding, editing, and removing links, plus configuring material settings
 * 
 * @param param0 - Component props
 * @param param0.elementInstance - The current instance of the link element
 * @param param0.locale - The current locale for internationalization
 * @param param0.onUpClick - Callback for moving the element up
 * @param param0.onDownClick - Callback for moving the element down
 * @param param0.onDeleteClick - Callback for deleting the element
 * @param param0.links - Array of current links
 * @param param0.includeInMaterials - Whether links are included in materials
 * @param param0.onChange - Callback for link or settings changes
 */
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, links, includeInMaterials, onChange }: DesignerComponentExtendedProps) {
    if (elementInstance.type !== CourseElementType.Links) return null;

    const dictionary = getDictionary(locale);

    const handleAddLink = () => {
        onChange([
            ...links,
            {
                title: "",
                url: "",
                file: null,
                isEdit: true,
            }
        ], includeInMaterials);
    };

    const handleLinkEdit = (title: string, url: string, file: File | null, index: number) => {
        const updatedLinks = [...links];
        updatedLinks[index] = {
            ...updatedLinks[index],
            title,
            url,
            file,
            isEdit: true,
        };
        onChange(updatedLinks, includeInMaterials);
    }

    const handleSave = (index: number) => {
        const updatedLinks = [...links];
        updatedLinks[index] = {
            ...updatedLinks[index],
            isEdit: false,
        };
        onChange(updatedLinks, includeInMaterials);
    }

    const handleDelete = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        onChange(updatedLinks, includeInMaterials);
    }

    const handleEdit = (index: number) => {
        const updatedLinks = [...links];
        updatedLinks[index] = { ...updatedLinks[index], isEdit: true };
        onChange(updatedLinks, includeInMaterials);
    }

    const handleCheckboxChange = () => {
        onChange(links, !includeInMaterials);
    }

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.linkText}
            icon={<IconLink classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <div className="py-4">
                <CheckBox
                    name="includeInMaterials"
                    withText
                    value="includeInMaterials"
                    label={dictionary.components.courseBuilder.includeInMaterialsText}
                    checked={includeInMaterials}
                    onChange={handleCheckboxChange}
                    labelClass="text-text-primary"
                />
            </div>
            <div className="flex flex-col gap-4 w-full">
                {links.map((link, index) =>
                    link.isEdit ? (
                        <div className="flex flex-col" key={index}>
                            <LinkEdit
                                locale={locale}
                                initialTitle={link.title}
                                initialUrl={link.url}
                                initialFile={link.file}
                                onSave={() => handleSave(index)}
                                onDiscard={() => handleDelete(index)}
                                onChange={(title, url, file) => handleLinkEdit(title, url, file, index)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col" key={index}>
                            <LinkPreview
                                preview={true}
                                title={link.title}
                                url={link.url}
                                customIcon={link.file}
                                onEdit={() => handleEdit(index)}
                                onDelete={() => handleDelete(index)}
                            />
                        </div>
                    )
                )}
            </div>
            <div className="flex items-center mt-4">
                <div className="flex-grow border-t border-[#44403C]"></div>
                <span
                    onClick={handleAddLink}
                    className="text-button-primary-fill mx-4 capitalize flex gap-1 items-center text-para-sm font-bold cursor-pointer hover:text-action-hover"
                >
                    <IconPlus />
                    <span>{dictionary.components.courseBuilder.addLinkText}</span>
                </span>
                <div className="flex-grow border-t border-[#44403C]"></div>
            </div>
        </DesignerLayout>
    );
}

/**
 * Form Component for Link Lesson
 * Renders the preview of all links in the course content
 * Displays links with their titles and custom icons if available
 * 
 * @param param0 - Component props
 * @param param0.elementInstance - The current instance of the link element
 * @param param0.locale - The current locale for internationalization
 * @returns JSX element displaying the links or null if invalid type
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.Links) return null;
    const links = (elementInstance as LinkLessonPreview).links || [];

    return (
        <div className="flex flex-col gap-4">
            {links.map((link, index) => (
                <LinkPreview
                    key={index}
                    title={link.title}
                    url={link.url}
                    customIcon={link.file || undefined}
                />
            ))}
        </div>
    );
}

export default linkElement;