import { useState } from "react";
import { courseElement, CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconCloudDownload } from "../icons/icon-cloud-download";
import { LinkEdit, LinkPreview } from "../component-link";
import { IconPlus } from "../icons/icon-plus";
import { LinkLessonEdit, LinkLessonPreview } from "./types";

// Type guard functions
function isLinkLessonEdit(element: courseElement): element is LinkLessonEdit {
    return element.type === CourseElementType.Links;
}

function isLinkLessonPreview(element: courseElement): element is LinkLessonPreview {
    return element.type === CourseElementType.Links;
}

type LinkType = {
    title: string;
    url: string;
    file?: File | null;
    isEdit?: boolean;
};

export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (!isLinkLessonEdit(elementInstance)) return null;

    const dictionary = getDictionary(locale);
    const [links, setLinks] = useState<LinkType[]>([]);

    const handleAddLink = () => {
        setLinks((prevLinks) => [
            ...prevLinks,
            {
                title: "",
                url: "",
                file: null,
                isEdit: true, // This ensures new links start in edit mode
            },
        ]);
    };

    const handleLinkEdit = (title: string, url: string, file: File | null, index: number) => {
        setLinks((prevLinks) => {
            const updatedLinks = [...prevLinks];
            updatedLinks[index] = {
                ...updatedLinks[index],
                title,
                url,
                file,
                isEdit: true,
            };
            return updatedLinks;
        });
    }

    const handleSave = (index: number) => {
        setLinks((prevLinks) => {
            const updatedLinks = [...prevLinks];
            updatedLinks[index] = {
                ...updatedLinks[index],
                isEdit: false,
            };
            return updatedLinks;
        });
    }

    return (
        <DesignerLayout
            type={elementInstance.type}
            title="Links"
            icon={<IconCloudDownload classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <div className="flex flex-col gap-4 w-full">
                {links.map((link, index) =>
                    link.isEdit ? (
                        <div className="flex flex-col" key={index}>
                            <LinkEdit
                                initialTitle={link.title}
                                initialUrl={link.url}
                                initialFile={link.file}
                                onSave={() => handleSave(index)}
                                onDiscard={() => setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index))}
                                onChange={(title, url, file) => handleLinkEdit(title, url, file, index)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col" key={index}>
                            <LinkPreview
                                title={link.title}
                                url={link.url}
                                customIcon={link.file}
                                onEdit={() => setLinks((prevLinks) => {
                                    const updatedLinks = [...prevLinks];
                                    updatedLinks[index] = { ...updatedLinks[index], isEdit: true };
                                    return updatedLinks;
                                })}
                                onDelete={() => setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index))}
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
                    add link
                </span>
                <div className="flex-grow border-t border-[#44403C]"></div>
            </div>
        </DesignerLayout>
    );
}

export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (!isLinkLessonPreview(elementInstance)) return null;
    const links = elementInstance.links || [];

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

const linkElement: CourseElementTemplate = {
    type: CourseElementType.Links,
    designerBtnElement: {
        icon: IconCloudDownload,
        label: "Links"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

export default linkElement;