'use client';

import { useState, useEffect } from 'react';
import RichTextEditor from '../rich-text-element/editor';
import { Descendant, Node } from 'slate';
import { Button } from '../button';
import { IconLink } from '../icons/icon-link';
import { CheckBox } from '../checkbox';
import { LinkEdit, LinkPreview } from '../links';
import { IconPlus } from '../icons/icon-plus';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { fileMetadata } from '@maany_shr/e-class-models';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import RichTextRenderer from '../rich-text-element/renderer';
import { deserialize, serialize } from '../rich-text-element/serializer';
import { cn } from '../../utils/style-utils';

/**
 * * Interface for note links used in coach notes
 * * @property {string} url - The URL of the link.
 * * @property {string} title - The title of the link.
 * * @property {boolean} [isEdit] - Flag to indicate if the link is in edit mode.
 */
type noteLink = {
    url: string;
    title: string;
    customIconMetadata?: fileMetadata.TFileMetadata; // Add metadata for file upload status
    id?: number;
};
export interface coachNotesProps extends isLocalAware {
    noteDescription: string;
    noteLinks: noteLink[];
    includeInMaterials: boolean;
    onPublish: (
        noteDescription: string,
        noteLinks: noteLink[],
        includeInMaterials: boolean,
    ) => void;
    onImageChange: (
        index: number,
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onDeleteIcon: (index: number) => void;
    onNoteLinksChange: (noteLinks: noteLink[]) => void;
    onIncludeInMaterialsChange: (includeInMaterials: boolean) => void;
    onNoteDescriptionChange: (noteDescription: string) => void;
    isEditMode: boolean;
    onBack: () => void;
    isLoading?: boolean;
    /**
     * Variant for the notes editor:
     * - 'course': Default behavior with auto-open link editor and "include in materials" checkbox
     * - 'group': Links are optional (editor closed by default), no "include in materials" checkbox
     */
    variant?: 'course' | 'group';
}

export interface coachNotesViewProps extends isLocalAware {
    noteDescription: string;
    noteLinks: noteLink[];
    onExploreCourses: () => void;
}
function CoachNotesCreate({
    noteDescription: initialNoteDescription,
    noteLinks: initialNoteLinks,
    includeInMaterials: initialIncludeInMaterials,
    locale,
    onPublish,
    onImageChange,
    onDeleteIcon,
    onNoteLinksChange,
    onIncludeInMaterialsChange,
    onNoteDescriptionChange,
    isEditMode,
    onBack,
    isLoading = false,
    variant = 'course',
}: coachNotesProps) {
    const dictionary = getDictionary(locale);

    const [noteDescription, setNoteDescription] = useState<Descendant[]>(
        deserialize({
            serializedData: initialNoteDescription,
            onError: (msg, err) => console.error(msg, err),
        }),
    );
    const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(
        null,
    );

    // Only auto-open link editor for course variant (links required)
    // For group variant, links are optional so editor starts closed
    useEffect(() => {
        if (variant === 'course' && initialNoteLinks.length === 0) {
            handleAddLink();
        }
    }, [initialNoteLinks.length, variant]);

    const handleAddLink = () => {
        if (editingLinkIndex === null) {
            setEditingLinkIndex(initialNoteLinks.length); // Use length to signify a new link
        }
    };

    const handleSave = (
        index: number,
        title: string,
        url: string,
        customIcon?: fileMetadata.TFileMetadata,
        id?: number,
    ) => {
        if (index === initialNoteLinks.length) {
            // This is a new link being saved
            if (!title.trim() && !url.trim()) {
                setEditingLinkIndex(null); // Cancel if the new link is empty
                return;
            }
            onNoteLinksChange([
                ...initialNoteLinks,
                { title, url, customIconMetadata: customIcon, id },
            ]);
        } else {
            // This is an existing link being updated
            const updatedLinks = [...initialNoteLinks];
            updatedLinks[index] = {
                ...updatedLinks[index],
                title,
                url,
                customIconMetadata: customIcon,
            };
            onNoteLinksChange(updatedLinks);
        }
        setEditingLinkIndex(null);
    };
    const handleDiscard = (index: number) => {
        // If it's a new link being discarded, do nothing to the array, just stop editing.
        if (index === initialNoteLinks.length) {
            setEditingLinkIndex(null);
            return;
        }
        // If it's an existing link, just cancel editing.
        setEditingLinkIndex(null);
    };

    const handleDelete = (index: number) => {
        const updatedLinks = initialNoteLinks.filter((_, i) => i !== index);
        onNoteLinksChange(updatedLinks);
        if (editingLinkIndex === initialNoteLinks.length) {
            setEditingLinkIndex(updatedLinks.length);
        } else if (editingLinkIndex === index) {
            setEditingLinkIndex(null); // Stop editing if the deleted link was being edited
        }
    };

    const handleEdit = (index: number) => {
        if (editingLinkIndex !== null) {
            return;
        }
        setEditingLinkIndex(index);
    };

    const handleCheckboxChange = () => {
        onIncludeInMaterialsChange(!initialIncludeInMaterials);
    };

    const handleDescriptionChange = (values: Descendant[]) => {
        setNoteDescription(values);
    };

    return (
        <div
            className={cn(
                'w-full p-6 border border-card-stroke bg-card-fill rounded-md shadow-[0_4px_12px_0_base-neutral-800] flex flex-col gap-6',
                isEditMode ? 'p-0 border-0' : '',
            )}
        >
            <div className="w-full">
                <RichTextEditor
                    name="coachNotes"
                    placeholder="Enter your notes here..."
                    initialValue={noteDescription}
                    locale={locale}
                    onDeserializationError={(error) =>
                        console.error('Deserialization error:', error)
                    }
                    onLoseFocus={(values) => onNoteDescriptionChange(values)}
                    onChange={handleDescriptionChange}
                />
            </div>
            <div className="p-4 rounded-md border border-base-neutral-700 bg-base-neutral-800 flex flex-col gap-4 text-text-primary">
                <div className="flex items-center gap-2 flex-1 text-text-primary py-2 border-b border-divider">
                    <span className="min-w-0">
                        <IconLink />
                    </span>
                    <p className="text-md font-important leading-[24px] word-break">
                        {dictionary.components.coachNotes.usefulLinks}
                    </p>
                </div>
                {variant === 'course' && (
                    <CheckBox
                        withText
                        name="includeLinks"
                        label={dictionary.components.coachNotes.includeInMaterials}
                        value="include"
                        checked={initialIncludeInMaterials}
                        onChange={handleCheckboxChange}
                    />
                )}

                <div className="flex flex-col gap-4 w-full">
                    {initialNoteLinks.map((link, index) => (
                        <div key={index} className="w-full">
                            <div
                                className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${editingLinkIndex === index
                                    ? 'max-h-[500px]'
                                    : 'max-h-0'
                                    }`}
                            >
                                {editingLinkIndex === index && (
                                    <LinkEdit
                                        locale={locale}
                                        initialTitle={link.title}
                                        initialUrl={link.url}
                                        initialCustomIcon={
                                            link.customIconMetadata
                                        }
                                        onSave={(title, url, customIcon) =>
                                            handleSave(
                                                index,
                                                title,
                                                url,
                                                customIcon,
                                                link.id,
                                            )
                                        }
                                        onDiscard={() => handleDiscard(index)}
                                        onImageChange={async (fileRequest, abortSignal) =>
                                            await onImageChange(
                                                index,
                                                fileRequest,
                                                abortSignal
                                            )
                                        }
                                        onDeleteIcon={() => onDeleteIcon(index)}
                                    />
                                )}
                            </div>
                            {editingLinkIndex !== index && (
                                <LinkPreview
                                    preview
                                    title={link.title}
                                    url={link.url}
                                    customIcon={link.customIconMetadata}
                                    onEdit={() => handleEdit(index)}
                                    onDelete={() => handleDelete(index)}
                                />
                            )}
                        </div>
                    ))}
                    <div
                        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${editingLinkIndex === initialNoteLinks.length
                            ? 'max-h-[500px]'
                            : 'max-h-0'
                            }`}
                        key={initialNoteLinks.length}
                    >
                        {editingLinkIndex === initialNoteLinks.length && (
                            <LinkEdit
                                initialTitle=""
                                initialUrl=""
                                onSave={(title, url, customIcon) =>
                                    handleSave(
                                        initialNoteLinks.length,
                                        title,
                                        url,
                                        customIcon,
                                    )
                                }
                                onDiscard={() =>
                                    handleDiscard(initialNoteLinks.length)
                                }
                                onImageChange={async (fileRequest, abortSignal) =>
                                    await onImageChange(
                                        initialNoteLinks.length,
                                        fileRequest,
                                        abortSignal,
                                    )
                                }
                                onDeleteIcon={() =>
                                    onDeleteIcon(initialNoteLinks.length)
                                }
                                locale={locale}
                            />
                        )}
                    </div>
                </div>
                {editingLinkIndex === null && <div
                    className="flex items-center mt-4 gap-2"
                    role="group"
                    aria-label="Add link divider"
                >
                    <hr className="flex-grow border-t border-divider" />
                    <Button
                        text={dictionary.components.coachNotes.addLink}
                        hasIconRight
                        iconRight={<IconPlus />}
                        onClick={handleAddLink}
                        aria-label="Add link"
                        variant="text"
                        disabled={editingLinkIndex !== null}
                    />
                    <hr className="flex-grow border-t border-divider" />
                </div>}
            </div>

            <div className="flex w-full  items-center gap-4">
                {isEditMode && (
                    <Button
                        text={dictionary.components.coachNotes.back}
                        onClick={onBack}
                        variant="secondary"
                        className="w-full"
                        disabled={editingLinkIndex !== null || isLoading}
                    />
                )}
                <div className="relative w-full">
                    <Button
                        text={
                            isEditMode
                                ? dictionary.components.coachNotes.publishEditNotes
                                : dictionary.components.coachNotes.publishNotes
                        }
                        onClick={() =>
                            onPublish(
                                serialize(noteDescription),
                                initialNoteLinks,
                                initialIncludeInMaterials,
                            )
                        }
                        disabled={editingLinkIndex !== null || isLoading}
                        className="w-full"
                        variant="primary"
                    />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
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

function CoachNotesView({
    noteDescription,
    noteLinks,
    locale,
    onExploreCourses,
}: coachNotesViewProps) {
    const dictionary = getDictionary(locale);
    const hasDescription = () => {
        try {
            // Parse the JSON string to get the Descendant array
            const parsedDescription = JSON.parse(noteDescription);

            if (Array.isArray(parsedDescription)) {
                const content = parsedDescription
                    .map((n) => Node.string(n))
                    .join('\n')
                    .trim();
                return content.length > 0;
            }
            return false;
        } catch (_error) {
            // Parsing failed, likely due to invalid JSON. Returning false as a fallback. 
            return false;
        }
    };

    // Check if there are any valid links
    const hasLinks =
        noteLinks &&
        noteLinks.length > 0 &&
        noteLinks.some((link) => link.title.trim() || link.url.trim());

    const hasValidDescription = hasDescription();

    // If neither description nor links exist, show explore courses button
    if (!hasValidDescription && !hasLinks) {
        return (
            <div className="p-6 bg-[#211F1E] rounded-xl flex flex-col items-start justify-center gap-4 text-text-primary">
                <p className="text-lg md:text[24px]">
                    {dictionary.components.coachNotes.notesValidation}
                </p>
                <Button
                    text={dictionary.components.coachNotes.exploreCourses}
                    onClick={onExploreCourses}
                />
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#211F1E] rounded-xl flex flex-col gap-4 text-text-primary">
            {hasValidDescription && (
                <RichTextRenderer
                    className="leading-[150%] md:text-[24px] text-lg"
                    content={noteDescription}
                    onDeserializationError={(error) =>
                        console.error('Deserialization error:', error)
                    }
                />
            )}

            {hasLinks && (
                <div className="flex flex-col gap-4">
                    <h5 className="capitalize md:text-[24px] text-lg">
                        {dictionary.components.coachNotes.usefulLinks}
                    </h5>
                    <div className="w-full flex flex-wrap gap-4">
                        {noteLinks
                            .filter(
                                (link) => link.title.trim() || link.url.trim(),
                            ) // Only show links with content
                            .map((link, index) => (
                                <LinkPreview
                                    key={index}
                                    preview={false}
                                    title={link.title}
                                    url={link.url}
                                    customIcon={link.customIconMetadata}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export { CoachNotesCreate, CoachNotesView };
