import { FC, useState } from "react";
import { Button } from "../button";
import { CheckBox } from "../checkbox";
import { LinkEdit, LinkPreview } from "../links";
import { Links } from "../course-builder-lesson-component/types";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconPlus } from "../icons";
import { fileMetadata } from "@maany_shr/e-class-models";

/**
 * Renders a comprehensive link builder interface for course builder elements.
 * Provides functionality to create, edit, delete, and manage resource links within course content.
 * Includes custom icon upload capability, material inclusion toggle, and inline editing features.
 *
 * This component handles all link management operations including:
 * - Adding new links with title, URL, and optional custom icons
 * - Editing existing links with seamless local editing state (index tracked internally)
 * - Deleting links with proper cleanup
 * - Custom icon upload and deletion for links
 * - Toggle for including links in course materials
 *
 * Props (coach-notes aligned):
 * - type: CourseElementType.Links — the course element type
 * - id: number — unique identifier for this links element
 * - order: number — position of this element in the course
 * - links: { title: string; url: string; customIconMetadata?: TFileMetadata }[] — list of links
 * - onNoteLinksChange: (noteLinks: shared.TLink[]) => void — called whenever links array should be updated
 * - includeInMaterials: boolean — whether links are included in downloadable materials
 * - onIncludeInMaterialsChange: (includeInMaterials: boolean) => void — toggles includeInMaterials
 * - onImageChange: (index: number, fileRequest: TFileUploadRequest, abortSignal?: AbortSignal) => Promise<TFileMetadata>
 *   Handles upload for a given link index and returns uploaded file metadata
 * - onDeleteIcon: (index: number) => void — removes the custom icon for a given link index
 * - locale: TLocale — locale for translations
 *
 * Example:
 * <LinkBuilderView
 *   type={CourseElementType.Links}
 *   id={1}
 *   order={0}
 *   links={[
 *     { title: 'Resource 1', url: 'https://example.com' },
 *     { title: 'Resource 2', url: 'https://docs.example.com' }
 *   ]}
 *   includeInMaterials={true}
 *   onNoteLinksChange={(updated) => console.log(updated)}
 *   onIncludeInMaterialsChange={(v) => console.log(v)}
 *   onImageChange={async (index, fileReq, abort) => {
 *     // return uploaded metadata
 *     return { ... } as any;
 *   }}
 *   onDeleteIcon={(index) => console.log(index)}
 *   locale="en"
 * />
 */

export const LinkBuilderView: FC<Links> = ({
    onNoteLinksChange,
    links,
    includeInMaterials,
    onIncludeInMaterialsChange,
    onImageChange,
    onDeleteIcon,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(
        null,
    );

    const handleCheckboxChange = () => {
        onIncludeInMaterialsChange(!includeInMaterials);
    };

    const handleSave = (
        index: number,
        title: string,
        url: string,
        customIcon?: fileMetadata.TFileMetadata,
    ) => {
        if (index === links.length) {
            // This is a new link being saved
            if (!title.trim() && !url.trim()) {
                setEditingLinkIndex(null); // Cancel if the new link is empty
                return;
            }
            onNoteLinksChange([
                ...links,
                { title, url, customIconMetadata: customIcon },
            ]);
        } else {
            // This is an existing link being updated
            const updatedLinks = [...links];
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
        if (index === links.length) {
            setEditingLinkIndex(null);
            return;
        }
        // If it's an existing link, just cancel editing.
        setEditingLinkIndex(null);
    };

    const handleEdit = (index: number) => {
        if (editingLinkIndex !== null) {
            return;
        }
        setEditingLinkIndex(index);
    };

    const handleDelete = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        onNoteLinksChange(updatedLinks);
        if (editingLinkIndex === links.length) {
            setEditingLinkIndex(updatedLinks.length);
        } else if (editingLinkIndex === index) {
            setEditingLinkIndex(null); // Stop editing if the deleted link was being edited
        }
    };

    const handleAddLink = () => {
        if (editingLinkIndex === null) {
            setEditingLinkIndex(links.length); // Use length to signify a new link
        }
    };

    return (
        <div className="flex flex-col gap-4 text-text-primary mt-2">
            <CheckBox
                withText
                name="includeLinks"
                label={dictionary.components.coachNotes.includeInMaterials}
                value="include"
                checked={includeInMaterials}
                onChange={handleCheckboxChange}
            />

            {links.map((link, index) => (
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
            {editingLinkIndex === links.length && (
                <LinkEdit
                    initialTitle=""
                    initialUrl=""
                    onSave={(title, url, customIcon) =>
                        handleSave(
                            links.length,
                            title,
                            url,
                            customIcon,
                        )
                    }
                    onDiscard={() =>
                        handleDiscard(links.length)
                    }
                    onImageChange={async (fileRequest, abortSignal) =>
                        await onImageChange(
                            links.length,
                            fileRequest,
                            abortSignal,
                        )
                    }
                    onDeleteIcon={() =>
                        onDeleteIcon(links.length)
                    }
                    locale={locale}
                />
            )}
            {editingLinkIndex === null && <div
                className="flex items-center gap-2"
                role="group"
                aria-label="Add link divider"
            >
                <hr className="flex-grow border-t border-divider" />
                <Button
                    text={dictionary.components.coachNotes.addLink}
                    hasIconLeft
                    iconLeft={<IconPlus />}
                    onClick={handleAddLink}
                    aria-label="Add Link"
                    variant="text"
                    disabled={editingLinkIndex !== null}
                />
                <hr className="flex-grow border-t border-divider" />
            </div>}
        </div >
    );
};