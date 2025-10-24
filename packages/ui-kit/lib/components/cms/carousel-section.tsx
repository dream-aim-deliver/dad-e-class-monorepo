'use client';

import { useState, useEffect } from 'react';
import { TextAreaInput } from '../text-areaInput';
import { TextInput } from '../text-input';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconChevronUp } from '../icons/icon-chevron-up';
import { IconChevronDown } from '../icons/icon-chevron-down';

type CarouselType = z.infer<typeof viewModels.HomePageSchema>['carousel'];
type CarouselItemType = CarouselType extends Array<infer T> ? T : never;
type UploadType="upload_offers_page_carousel_card_image" |"upload_home_page_carousel_item_image"
interface CarouselSectionProps {
    value: CarouselType;
    onChange: (value: CarouselType) => void;
    onFileUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        uploadType:UploadType,
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    uploadProgress?: number;
    uploadType: UploadType;
}

export default function CarouselSection({
    value = [],
    onChange,
    onFileUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
    uploadType
}: CarouselSectionProps) {
    const [uploadedFiles, setUploadedFiles] = useState<Map<number, fileMetadata.TFileMetadata>>(new Map());

    // Sync uploadedFiles with value prop when images are loaded from server
    // Only update if the image IDs have actually changed (not just object recreation)
    useEffect(() => {
        const newUploadedFiles = new Map<number, fileMetadata.TFileMetadata>();
        let hasChanges = false;

        (value || []).forEach((item, index) => {
            if (item.image) {
                const existingFile = uploadedFiles.get(index);
                // Only update if image ID changed or file didn't exist
                if (!existingFile || existingFile.id !== item.image.id) {
                    hasChanges = true;
                }
                newUploadedFiles.set(index, {
                    id: item.image.id,
                    name: item.image.name,
                    size: item.image.size,
                    category: item.image.category,
                    url: item.image.downloadUrl,
                } as fileMetadata.TFileMetadata);
            } else if (uploadedFiles.get(index)) {
                // Image was removed
                hasChanges = true;
            }
        });

        // Check if count changed (items added/removed)
        if (newUploadedFiles.size !== uploadedFiles.size) {
            hasChanges = true;
        }

        if (hasChanges) {
            setUploadedFiles(newUploadedFiles);
        }
    }, [value]);

    const handleCarouselChange = (newCarouselData: CarouselType) => {
        onChange?.(newCarouselData);
    };

    const handleItemFieldChange = (index: number, field: keyof CarouselItemType, fieldValue: string | { id: string; name: string; size: number; category: 'image'; downloadUrl: string } | null) => {
        const newCarouselData = [...(value || [])];
        newCarouselData[index] = {
            ...newCarouselData[index],
            [field]: fieldValue
        };
        handleCarouselChange(newCarouselData);
    };

    const addCarouselItem = () => {
        const newItem = {
            title: '',
            description: '',
            image: null,
            buttonText: '',
            buttonUrl: '',
            badge: ''
        } as CarouselItemType;
        handleCarouselChange([...(value || []), newItem]);
    };

    const removeCarouselItem = (index: number) => {
        const newCarouselData = (value || []).filter((_, i) => i !== index);

        // Clean up uploaded file for this item
        const fileForItem = uploadedFiles.get(index);
        if (fileForItem) {
            onFileDelete(fileForItem.id as string);
            const newUploadedFiles = new Map(uploadedFiles);
            newUploadedFiles.delete(index);
            setUploadedFiles(newUploadedFiles);
        }

        handleCarouselChange(newCarouselData);
    };

    const moveCarouselItemUp = (index: number) => {
        if (value && index > 0) {
            const newCarouselData = [...value];
            [newCarouselData[index - 1], newCarouselData[index]] = [newCarouselData[index], newCarouselData[index - 1]];
            handleCarouselChange(newCarouselData);

            // Swap uploaded files
            const newUploadedFiles = new Map(uploadedFiles);
            const temp = newUploadedFiles.get(index - 1);
            const current = newUploadedFiles.get(index);
            if (current) {
                newUploadedFiles.set(index - 1, current);
            } else {
                newUploadedFiles.delete(index - 1);
            }
            if (temp) {
                newUploadedFiles.set(index, temp);
            } else {
                newUploadedFiles.delete(index);
            }
            setUploadedFiles(newUploadedFiles);
        }
    };

    const moveCarouselItemDown = (index: number) => {
        if (value && index < value.length - 1) {
            const newCarouselData = [...value];
            [newCarouselData[index], newCarouselData[index + 1]] = [newCarouselData[index + 1], newCarouselData[index]];
            handleCarouselChange(newCarouselData);

            // Swap uploaded files
            const newUploadedFiles = new Map(uploadedFiles);
            const temp = newUploadedFiles.get(index + 1);
            const current = newUploadedFiles.get(index);
            if (current) {
                newUploadedFiles.set(index + 1, current);
            } else {
                newUploadedFiles.delete(index + 1);
            }
            if (temp) {
                newUploadedFiles.set(index, temp);
            } else {
                newUploadedFiles.delete(index);
            }
            setUploadedFiles(newUploadedFiles);
        }
    };

    const handleOnFilesChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onFileUpload(file, uploadType, abortSignal);
    };

    const handleUploadComplete = (index: number, file: fileMetadata.TFileMetadata) => {
        const newUploadedFiles = new Map(uploadedFiles);
        newUploadedFiles.set(index, file);
        setUploadedFiles(newUploadedFiles);
        const imageObject = {
            id: file.id?.toString() ?? '',
            name: file.name ?? '',
            size: file.size ?? 0,
            category: 'image' as const,
            downloadUrl: file.url ?? ''
        };
        handleItemFieldChange(index, 'image', imageObject);
    };

    const handleFileDelete = (index: number, id: string) => {
        const newUploadedFiles = new Map(uploadedFiles);
        newUploadedFiles.delete(index);
        setUploadedFiles(newUploadedFiles);
        handleItemFieldChange(index, 'image', null);
        onFileDelete(id);
    };

    const handleFileDownload = (id: string) => {
        onFileDownload(id);
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <div className="flex justify-between items-center   ">
                <h3>Carousel Section</h3>

            </div>

            <div className="flex flex-col gap-6 transition-all duration-300 ease-in-out">
                {(value || []).map((item, index) => (
                    <div
                        key={index}
                        className=" rounded-medium flex flex-col gap-3 border-base-neutral-700 bg-base-neutral-800 p-4
                                   transition-all duration-300 ease-in-out"
                    >
                        <div className="flex justify-between items-center border-b border-b-divider pb-2">
                            <h3 className="text-lg font-semibold transition-colors duration-200">Carousel Item {index + 1}</h3>
                            <div className="flex gap-2">
                                <IconButton
                                    icon={<IconTrashAlt />}
                                    onClick={() => removeCarouselItem(index)}
                                    size="small"
                                    styles="text"
                                />
                                <IconButton
                                    icon={<IconChevronUp />}
                                    onClick={() => moveCarouselItemUp(index)}
                                    size="small"
                                    styles="text"
                                />
                                <IconButton
                                    icon={<IconChevronDown />}
                                    onClick={() => moveCarouselItemDown(index)}
                                    size="small"
                                    styles="text"
                                />

                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-sm text-text-secondary">Upload Image</label>
                                <Uploader
                                    type="single"
                                    variant="image"
                                    file={uploadedFiles.get(index) || null}
                                    onDelete={(id) => handleFileDelete(index, id)}
                                    onDownload={handleFileDownload}
                                    onFilesChange={(file, abortSignal) => handleOnFilesChange(file,  abortSignal)}
                                    onUploadComplete={(file) => handleUploadComplete(index, file)}
                                    locale="en"
                                    maxSize={10}
                                    uploadProgress={uploadProgress}
                                />
                            </div>
                            <TextInput
                                label="Title"

                                inputField={{
                                    inputText: "Enter the title",
                                    value: item.title,
                                    setValue: (value) => handleItemFieldChange(index, 'title', value)
                                }}
                            />

                            <TextAreaInput
                                label="Description"
                                value={item.description || ''}
                                setValue={(value) => handleItemFieldChange(index, 'description', value)}
                                placeholder="Enter the description"
                            />

                            <TextInput
                                label="Badge (Optional)"
                                inputField={{
                                    inputText: "Enter badge text",
                                    value: item.badge || '',
                                    setValue: (value) => handleItemFieldChange(index, 'badge', value || null)
                                }}
                            />

                            <TextInput
                                label="Button Text"
                                inputField={{
                                    inputText: "Enter button text",
                                    value: item.buttonText,
                                    setValue: (value) => handleItemFieldChange(index, 'buttonText', value)
                                }}
                            />

                            <TextInput
                                label="Card Link"
                                inputField={{
                                    inputText: "Enter button URL",
                                    value: item.buttonUrl,
                                    setValue: (value) => handleItemFieldChange(index, 'buttonUrl', value)
                                }}
                            />


                        </div>
                    </div>
                ))}
                <Button
                    variant="primary"
                    size="medium"
                    text="Add Carousel Item"
                    onClick={addCarouselItem}
                    className="transition-all duration-200 hover:scale-105"
                />

                {(value || []).length === 0 && (
                    <div className="text-center py-8 text-text-secondary transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-4">
                        No carousel items yet. Click "Add Carousel Item" to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
