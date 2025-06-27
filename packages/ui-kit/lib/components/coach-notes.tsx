import React from 'react'
import RichTextEditor from './rich-text-element/editor'
import { Descendant, Node } from 'slate';
import { Button } from './button';
import { IconLink } from './icons/icon-link';
import { CheckBox } from './checkbox';
import { LinkEdit, LinkPreview } from './link';
import { IconPlus } from './icons/icon-plus';
import { fileMetadata } from '@maany_shr/e-class-models';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import RichTextRenderer from './rich-text-element/renderer';

/**
 * * Interface for note links used in coach notes
 * * @property {string} url - The URL of the link.
 * * @property {string} title - The title of the link.
 * * @property {string} [icon] - Optional custom icon URL.
 * * @property {File | null} [file] - Optional file for custom icon upload.
 * * @property {fileMetadata.TFileMetadata | null} [customIconMetadata] - Metadata for file upload status.
 * * @property {boolean} [isEdit] - Flag to indicate if the link is in edit mode.
 * 
 */
type noteLink = {
    url: string,
    title: string,
    icon?: string,
    file?: File | null,
    customIconMetadata?: fileMetadata.TFileMetadata | null, // Add metadata for file upload status
    isEdit?: boolean
}
export interface coachNotesProps extends isLocalAware {
    noteDescription: Descendant[];
    noteLinks: noteLink[];
    includeInMaterials: boolean;
    onChange: (noteDescription: string, noteLinks: noteLink[], includeInMaterials: boolean) => void;
    onPublish: (noteDescription: string, noteLinks: noteLink[], includeInMaterials: boolean) => void;
}

export interface coachNotesViewProps extends isLocalAware {
    noteDescription: Descendant[];
    noteLinks: noteLink[];
    includeInMaterials: boolean;
    onExploreCourses?: () => void; // Optional callback for explore courses button
}
function CoachNotesEdit({ noteDescription, noteLinks, includeInMaterials, locale, onChange, onPublish }: coachNotesProps) {
   const dictionary = getDictionary(locale);
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

    const handleLinkEdit = (data: { title: string; url: string; file?: File }, index: number) => {
        const updatedLinks = [...noteLinks];
        updatedLinks[index] = {
            ...updatedLinks[index],
            title: data.title,
            url: data.url,
            file: data.file || null,
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
        <div className="w-full p-6 border border-card-stroke bg-card-fill rounded-md shadow-[0_4px_12px_0_base-neutral-800] flex flex-col gap-6">
            <div className="w-full">
            <RichTextEditor
              
                name="coachNotes"
                placeholder="Enter your notes here..."
                initialValue={noteDescription}
                locale={locale}
                onDeserializationError={(error) => console.error("Deserialization error:", error)}
                onLoseFocus={(values) => onChange(values.toLocaleString(), noteLinks, includeInMaterials)}
                onChange={(values) => onChange(values.toLocaleString(), noteLinks, includeInMaterials)}
            />
</div>
            <div className='p-4 rounded-md border border-base-neutral-700 bg-base-neutral-800 flex flex-col gap-4 text-text-primary'>
                <div className="flex items-center gap-2 flex-1 text-text-primary py-2 border-b border-divider">
                    <span className="min-w-0"><IconLink /></span>
                    <p className="text-md font-important leading-[24px] word-break">{dictionary.components.coachNotes.usefulLinks}</p>
                </div>
                <CheckBox
                    withText
                    name="includeLinks"
                    label={dictionary.components.coachNotes.includeInMaterials}
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
                                    title={link.title}
                                    url={link.url}
                                    customIconMetadata={link.customIconMetadata}
                                    onSave={() => handleSave(index)}
                                    onDiscard={() => handleDelete(index)}
                                    onChange={(data) => handleLinkEdit(data, index)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col" key={index}>
                                <LinkPreview
                                    preview
                                    title={link.title}
                                    url={link.url}
                                    customIconUrl={link.icon}
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
                text={dictionary.components.coachNotes.publishNotes}
                onClick={() => onPublish(noteDescription.toLocaleString(), noteLinks, includeInMaterials)}
            />
        </div>
    )
}

/**
 * 
 * @param param0 
 * @param {Descendant[]} noteDescription - The content of the coach notes.
 * @param {noteLink[]} noteLinks - An array of links associated with the notes.
 * @param {boolean} includeInMaterials - Whether to include these notes in course materials.
 * @param {string} locale - The locale for translations.
 * @param {function} [onExploreCourses] - Optional callback for exploring courses when no content is available.
 * 
 * @description
 * This component renders the coach notes view, displaying the note description and links.
 * If no description or links are provided, it shows a button to explore courses.
 * @returns 
 */

function CoachNotesView({ noteDescription, noteLinks, includeInMaterials, locale, onExploreCourses }: coachNotesViewProps) {
    // Validate if description has content using the same logic as text-input validation
    const dictionary = getDictionary(locale);
    const hasDescription = () => {
        if (Array.isArray(noteDescription)) {
            const content = noteDescription.map(n => Node.string(n)).join('\n').trim();
            return content.length > 0;
        }
        return false;
    };

    // Check if there are any valid links
    const hasLinks = noteLinks && noteLinks.length > 0 &&
        noteLinks.some(link => link.title.trim() || link.url.trim());

    const hasValidDescription = hasDescription();

    // If neither description nor links exist, show explore courses button
    if (!hasValidDescription && !hasLinks) {
        return (
            <div className="p-6 bg-[#211F1E] rounded-xl flex flex-col items-start justify-center gap-4 text-text-primary">
                <p className="text-lg md:text[24px]">{dictionary.components.coachNotes.notesValidation}</p>
                <Button
                    text="Explore Courses"
                    onClick={onExploreCourses}
                />
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#211F1E] rounded-xl flex flex-col gap-4 text-text-primary">
            {hasValidDescription && (
                <RichTextRenderer
                    className='leading-[150%] md:text-[24px] text-lg'
                    content={noteDescription}
                    onDeserializationError={(error) => console.error("Deserialization error:", error)}
                />
            )}

            {hasLinks && (
                <div className='flex flex-col gap-4'>
                    <h5 className="capitalize md:text-[24px] text-lg">{dictionary.components.coachNotes.usefulLinks}</h5>
                    <div className='w-full flex flex-wrap gap-4'>
                        {noteLinks
                            .filter(link => link.title.trim() || link.url.trim()) // Only show links with content
                            .map((link, index) => (
                                <LinkPreview
                                    key={index}
                                    className='max-w-[375px]'
                                    preview={false}
                                    title={link.title}
                                    url={link.url}
                                    customIconUrl={link.icon}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    )
}


export { CoachNotesEdit, CoachNotesView };
