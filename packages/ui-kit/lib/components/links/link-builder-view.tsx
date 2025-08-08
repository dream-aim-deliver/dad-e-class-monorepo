import { FC } from "react";
import { Button } from "../button";
import { CheckBox } from "../checkbox";
import { IconLink } from "../icons/icon-link";
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
 * - Editing existing links with seamless state management
 * - Deleting links with proper cleanup
 * - Custom icon upload and deletion for links
 * - Toggle for including links in course materials
 * - Automatic cleanup of empty links when switching edit modes
 *
 * @param type The course element type (CourseElementType.Links).
 * @param id The unique identifier for this links element.
 * @param order The order/position of this element in the course.
 * @param editingLinkIndex The index of the link currently being edited, null if none.
 * @param links Array of link objects containing title, url, and optional customIconMetadata.
 * @param include_in_materials Boolean flag indicating whether links should be included in downloadable materials.
 * @param onChange Callback triggered when any aspect of the links data changes (links array, editing state, materials flag).
 * @param onImageChange Callback for handling custom icon uploads, receives index, file request, and abort signal.
 * @param onDeleteIcon Callback for deleting custom icons from links, receives the icon ID.
 * @param locale The locale string used for internationalization/localized text.
 *
 * @example
 * <LinkBuilderView
 *   type={CourseElementType.Links}
 *   id={1}
 *   order={0}
 *   editingLinkIndex={null}
 *   links={[
 *     { title: 'Resource 1', url: 'https://example.com', customIconMetadata: undefined },
 *     { title: 'Resource 2', url: 'https://docs.example.com', customIconMetadata: iconFile }
 *   ]}
 *   include_in_materials={true}
 *   onChange={handleLinksChange}
 *   onImageChange={handleImageUpload}
 *   onDeleteIcon={handleIconDelete}
 *   locale="en"
 * />
 */

export const LinkBuilderView: FC<Links> = ({
    type,
    id,
    order,
    editingLinkIndex,
    links,
    include_in_materials,
    onChange,
    onImageChange,
    onDeleteIcon,
    locale,
}) => {
    const dictionary = getDictionary(locale);

    const handleChange = (updated: Partial<Links>) => {
        onChange({
            type,
            id,
            order,
            editingLinkIndex,
            links,
            include_in_materials,
            ...updated,
        });
    };

    const handleCheckboxChange = (value: string) => {
        // The checkbox onChange is called on every click, so we toggle the state
        const newValue = !include_in_materials;
        handleChange({ include_in_materials: newValue });
    };

    const handleSave = (
        index: number,
        title: string,
        url: string,
        customIcon?: fileMetadata.TFileMetadata
    ) => {
        const updatedLinks = [...links];

        if (index >= links.length) {
            // Adding new link
            updatedLinks.push({
                title,
                url,
                customIconMetadata: customIcon,
            });
        } else {
            // Updating existing link
            updatedLinks[index] = {
                ...updatedLinks[index],
                title,
                url,
                customIconMetadata: customIcon,
            };
        }

        handleChange({
            links: updatedLinks,
            editingLinkIndex: null
        });
    };

    const handleEdit = (index: number) => {
        // Before switching to edit another link, clean up any empty links
        let updatedLinks = [...links];

        // If there's currently a link being edited and it's empty, remove it
        if (editingLinkIndex !== null) {
            const currentEditingLink = links[editingLinkIndex];
            if (currentEditingLink) {
                const isEmpty = (!currentEditingLink.title || currentEditingLink.title.trim() === "") &&
                    (!currentEditingLink.url || currentEditingLink.url.trim() === "");

                if (isEmpty) {
                    // Remove the empty link
                    updatedLinks = links.filter((_, i) => i !== editingLinkIndex);

                    // Adjust the target index if it's after the removed link
                    if (index > editingLinkIndex) {
                        index = index - 1;
                    }
                }
            }
        };

        handleChange({
            links: updatedLinks,
            editingLinkIndex: index
        });
    };

    const handleAddLink = () => {
        const updatedLinks = [...links, { title: "", url: "" }];
        handleChange({
            links: updatedLinks,
            editingLinkIndex: updatedLinks.length - 1  // index of new empty link
        });
    };

    const handleDelete = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        handleChange({
            links: updatedLinks,
            editingLinkIndex: null,
        });
    };

    const handleDiscard = (index: number) => {
        if (index >= links.length) {
            // Discarding new link creation
            handleChange({
                editingLinkIndex: null,
            });
        } else {
            // Discarding edit of existing link
            const link = links[index];
            const isEmpty = (!link.title || link.title.trim() === "") && (!link.url || link.url.trim() === "");

            if (isEmpty) {
                // Remove the link if it's empty
                const updatedLinks = links.filter((_, i) => i !== index);
                handleChange({
                    links: updatedLinks,
                    editingLinkIndex: null,
                });
            } else {
                // If it has data, just exit editing mode
                handleChange({
                    editingLinkIndex: null,
                });
            }
        }
    };

    return (
        <div className="flex flex-col gap-4 text-text-primary mt-2">
            <CheckBox
                withText
                name="includeLinks"
                label={dictionary.components.coachNotes.includeInMaterials}
                value="include"
                checked={include_in_materials}
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
                                initialCustomIcon={link.customIconMetadata}
                                onSave={(title, url, customIcon) =>
                                    handleSave(index, title, url, customIcon)
                                }
                                onDiscard={() => handleDiscard(index)}
                                onImageChange={(fileRequest, abortSignal) => onImageChange(fileRequest, index, abortSignal)}
                                onDeleteIcon={onDeleteIcon}
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

            {/* Add link button */}
            {
                editingLinkIndex === null && (
                    <div
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
                            aria-label="Add link"
                            variant="text"
                            disabled={editingLinkIndex !== null}
                        />
                        <hr className="flex-grow border-t border-divider" />
                    </div>
                )
            }
        </div >
    );
};