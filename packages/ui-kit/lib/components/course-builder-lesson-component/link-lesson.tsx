import { useState, useEffect } from "react";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconCloudDownload } from "../icons/icon-cloud-download";
import { LinkEdit, LinkPreview } from "../component-link";
import { IconPlus } from "../icons/icon-plus";
import { LinkLessonEdit, LinkLessonPreview } from "./types";
import { CheckBox } from "../checkbox";
import { IconLink } from "../icons/icon-link";

const linkElement: CourseElementTemplate = {
    type: CourseElementType.Links,
    designerBtnElement: {
        icon: IconCloudDownload,
        label: "Links"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};
type LinkType = {
    title: string;
    url: string;
    file?: File | null;
    isEdit?: boolean;
};

export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.Links) return null;

    const dictionary = getDictionary(locale);
    const [links, setLinks] = useState<LinkType[]>([]);
    const [checkBox, setCheckBox] = useState<boolean>((elementInstance as LinkLessonEdit).includeInMaterials);

    useEffect(() => {
        const existingLinks = (elementInstance as LinkLessonEdit).links || [];
        if (existingLinks.length > 0) {
            setLinks(existingLinks.map(link => ({
                title: link.title,
                url: link.url,
                file: null,
                isEdit: false,
            })));
        } else {
            setLinks([{
                title: "",
                url: "",
                file: null,
                isEdit: true,
            }]);
        }
    }, [elementInstance]);

    const handleAddLink = () => {
        setLinks((prevLinks) => [
            ...prevLinks,
            {
                title: "",
                url: "",
                file: null,
                isEdit: true,
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
                    checked={checkBox}
                    onChange={() => setCheckBox(!checkBox)}
                    labelClass="text-text-primary"
                />
            </div>
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
                    <span>{dictionary.components.courseBuilder.addLinkText}</span>
                </span>
                <div className="flex-grow border-t border-[#44403C]"></div>
            </div>
        </DesignerLayout>
    );
}

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