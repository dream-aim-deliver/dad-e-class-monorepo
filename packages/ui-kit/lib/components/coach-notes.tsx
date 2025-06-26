import React from 'react'
import RichTextEditor from './rich-text-element/editor'
import { Descendant } from 'slate';
import { Button } from './button';
import { IconLink } from './icons/icon-link';
import { CheckBox } from './checkbox';
import { LinkEdit, LinkPreview } from './link';
import { IconPlus } from './icons/icon-plus';
import { isLocalAware } from '@maany_shr/e-class-translations';
import RichTextRenderer from './rich-text-element/renderer';
type noteLink = {
    url: string,
    title: string,
    icon?: string,
    file?: File | null,
    isEdit?: boolean
}
export interface coachNotesProps extends isLocalAware {
    noteDescription: Descendant[];
    noteLinks: noteLink[];
    includeInMaterials: boolean;
    onChange: (noteDescription: string, noteLinks: noteLink[], includeInMaterials: boolean) => void;
    onPublish: (noteDescription: string, noteLinks: noteLink[], includeInMaterials: boolean) => void;
}
function CoachNotesEdit({ noteDescription, noteLinks, includeInMaterials, locale, onChange, onPublish }: coachNotesProps) {
    const handleAddLink = () => {
        console.log("Adding new link");
        onChange(noteDescription.toLocaleString(), [
            ...noteLinks,
            {
                title: "",
                url: "",
                isEdit: true,
            }
        ], includeInMaterials);
    };

    const handleLinkEdit = (title: string, url: string, file: File | null, index: number) => {
        const updatedLinks = [...noteLinks];
        updatedLinks[index] = {
            ...updatedLinks[index],
            title,
            url,
            file,
            isEdit: true,
        };
        onChange(noteDescription.toLocaleString(), updatedLinks, includeInMaterials);
    }

    const handleSave = (index: number) => {
        const updatedLinks = [...noteLinks];
        updatedLinks[index] = {
            ...updatedLinks[index],
            isEdit: false,
        };
        onChange(noteDescription.toLocaleString(), updatedLinks, includeInMaterials);
    }

    const handleDelete = (index: number) => {
        const updatedLinks = noteLinks.filter((_, i) => i !== index);
        onChange(noteDescription.toLocaleString(), updatedLinks, includeInMaterials);
    }

    const handleEdit = (index: number) => {
        const updatedLinks = [...noteLinks];
        updatedLinks[index] = { ...updatedLinks[index], isEdit: true };
        onChange(noteDescription.toLocaleString(), updatedLinks, includeInMaterials);
    }

    const handleCheckboxChange = () => {
        onChange(noteDescription.toLocaleString(), noteLinks, !includeInMaterials);
    }
    return (
        <div className="p-6 border border-card-stroke bg-card-fill rounded-md shadow-[0_4px_12px_0_base-neutral-800] flex flex-col gap-6">
            <RichTextEditor
                name="coachNotes"
                placeholder="Enter your notes here..."
                initialValue={noteDescription}
                locale={locale}
                onDeserializationError={(error) => console.error("Deserialization error:", error)}
                onLoseFocus={(values) => onChange(values.toLocaleString(), noteLinks, includeInMaterials)}
                onChange={(values) => onChange(values.toLocaleString(), noteLinks, includeInMaterials)}
            />

            <div className='p-4 rounded-md border border-base-neutral-700 bg-base-neutral-800 flex flex-col gap-4 text-text-primary'>
                <div className="flex items-center gap-2 flex-1 text-text-primary py-2 border-b border-divider">
                    <span className="min-w-0"><IconLink /></span>
                    <p className="text-md font-important leading-[24px] word-break">Useful links</p>
                </div>
                <CheckBox
                   withText
                    name="includeLinks"
                    label="Include links in course material tab"
                    value="include"
                    checked={includeInMaterials}
                    onChange={handleCheckboxChange}
                />

                <div className="flex flex-col gap-4 w-full">
                    {noteLinks.map((link, index) =>
                        link.isEdit ? (
                            <div className="flex flex-col" key={index}>
                                <LinkEdit
                                    locale={locale}
                                    initialTitle={link.title}
                                    initialUrl={link.url}
                                    initialFile={link.icon}
                                    onSave={() => handleSave(index)}
                                    onDiscard={() => handleDelete(index)}
                                    onChange={(title, url, file) => handleLinkEdit(title, url, file, index)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col" key={index}>
                                <LinkPreview
                                    title={link.title}
                                    url={link.url}
                                    customIcon={link.icon}
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
                    <span>Add link</span>
                </span>
                <div className="flex-grow border-t border-[#44403C]"></div>
            </div>

            </div>
            <Button
                text={"Publish Notes"}
                onClick={() => onPublish(noteDescription.toLocaleString(), noteLinks, includeInMaterials)}
            />
        </div>
    )
}


function CoachNotesView({ noteDescription, noteLinks, includeInMaterials, locale }: coachNotesProps) {
    return (
        <div className="p-6 bg-[#211F1E] rounded-xl flex flex-col gap-2 text-text-primary">

<RichTextRenderer
                className='leading-[150%] md:text-[24px] text-lg'
                content={noteDescription} 
                onDeserializationError={function (message: string, error: Error): void {
                    throw new Error('Function not implemented.');
                } }/>
    <div className='flex flex-col gap-4'>
        <h5 className='capitalize' >useful links</h5>
        <div className='w-full flex flex-wrap gap-4'>
            {noteLinks.map((link, index) => (
                <LinkPreview
                    key={index}
                    className='max-w-[375px]'
                    preview={false}
                    title={link.title}
                    url={link.url}
                    customIcon={link.icon}
                />
            ))}
        </div>
    </div>
        </div>
    )
}


export {CoachNotesEdit, CoachNotesView};
