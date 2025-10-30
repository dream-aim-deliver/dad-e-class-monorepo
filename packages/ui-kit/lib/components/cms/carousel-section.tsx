'use client';

import { useMemo, useCallback } from 'react';
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
import { downloadFile } from '../../utils/file-utils';
import { isLocalAware, getDictionary } from '@maany_shr/e-class-translations';

type CarouselType = z.infer<typeof viewModels.HomePageSchema>['carousel'];
type CarouselItemType = CarouselType extends Array<infer T> ? T : never;
type UploadType = "upload_offers_page_carousel_card_image" | "upload_home_page_carousel_item_image"
interface CarouselSectionProps extends isLocalAware {
    value: CarouselType;
    onChange: (value: CarouselType) => void;
    onFileUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        uploadType: UploadType,
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
    uploadType,
    locale
}: CarouselSectionProps) {
    const dictionary = getDictionary(locale);
    // Derive uploadedFiles from value prop - single source of truth
    const uploadedFiles = useMemo(() => {
        const files = new Map<number, fileMetadata.TFileMetadataImage>();

        (value || []).forEach((item, index) => {
            if (item.image) {
                files.set(index, {
                    id: item.image.id,
                    name: item.image.name,
                    size: item.image.size,
                    category: item.image.category as 'image',
                    url: item.image.downloadUrl,
                    thumbnailUrl: item.image.downloadUrl, // Add thumbnailUrl for proper preview
                    status: "available" as const
                } as fileMetadata.TFileMetadataImage);
            }
        });

        return files;
    }, [value]);

    const handleCarouselChange = useCallback((newCarouselData: CarouselType) => {
        onChange?.(newCarouselData);
    }, [onChange]);

    const handleItemFieldChange = useCallback((index: number, field: keyof CarouselItemType, fieldValue: string | { id: string; name: string; size: number; category: 'image'; downloadUrl: string } | null) => {
        const newCarouselData = [...(value || [])];
        newCarouselData[index] = {
            ...newCarouselData[index],
            [field]: fieldValue
        };
        handleCarouselChange(newCarouselData);
    }, [value, handleCarouselChange]);

    const addCarouselItem = useCallback(() => {
        const newItem = {
            title: '',
            description: '',
            image: null,
            buttonText: '',
            buttonUrl: '',
            badge: ''
        } as CarouselItemType;
        handleCarouselChange([...(value || []), newItem]);
    }, [value, handleCarouselChange]);

    const removeCarouselItem = useCallback((index: number) => {
        const newCarouselData = (value || []).filter((_, i) => i !== index);

        // Clean up uploaded file for this item
        const fileForItem = uploadedFiles.get(index);
        if (fileForItem) {
            onFileDelete(fileForItem.id as string);
        }

        // No need to update uploadedFiles state - it derives from value
        handleCarouselChange(newCarouselData);
    }, [value, uploadedFiles, onFileDelete]);

    const moveCarouselItemUp = useCallback((index: number) => {
        if (value && index > 0) {
            const newCarouselData = [...value];
            [newCarouselData[index - 1], newCarouselData[index]] = [newCarouselData[index], newCarouselData[index - 1]];
            // No need to manually swap uploadedFiles - it derives from value and will recompute
            handleCarouselChange(newCarouselData);
        }
    }, [value]);

    const moveCarouselItemDown = useCallback((index: number) => {
        if (value && index < value.length - 1) {
            const newCarouselData = [...value];
            [newCarouselData[index], newCarouselData[index + 1]] = [newCarouselData[index + 1], newCarouselData[index]];
            // No need to manually swap uploadedFiles - it derives from value and will recompute
            handleCarouselChange(newCarouselData);
        }
    }, [value]);

    const handleOnFilesChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onFileUpload(file, uploadType, abortSignal);
    };

    const handleUploadComplete = useCallback((index: number, file: fileMetadata.TFileMetadata) => {
        // No need to update uploadedFiles state - just update parent value
        // uploadedFiles will recompute from the new value
        const imageObject = {
            id: file.id?.toString() ?? '',
            name: file.name ?? '',
            size: file.size ?? 0,
            category: 'image' as const,
            downloadUrl: file.url ?? ''
        };
        handleItemFieldChange(index, 'image', imageObject);
    }, [handleItemFieldChange]);

    const handleFileDelete = useCallback((index: number, id: string) => {
        // No need to update uploadedFiles state - just update parent value
        handleItemFieldChange(index, 'image', null);
        onFileDelete(id);
    }, [handleItemFieldChange, onFileDelete]);

    const handleFileDownload = (index: number) => (id: string) => {
        const file = uploadedFiles.get(index);
        if (file?.id === id && file.url && file.name) {
            downloadFile(file.url, file.name);
        }
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <div className="flex justify-between items-center   ">
                <h3>{dictionary.components.cmsSections.carouselSection.heading}</h3>

            </div>

            <div className="flex flex-col gap-6 transition-all duration-300 ease-in-out">
                {(value || []).map((item, index) => (
                    <div
                        key={index}
                        className=" rounded-medium flex flex-col gap-3 border-base-neutral-700 bg-base-neutral-800 p-4
                                   transition-all duration-300 ease-in-out"
                    >
                        <div className="flex justify-between items-center border-b border-b-divider pb-2">
                            <h3 className="text-lg font-semibold transition-colors duration-200">{dictionary.components.cmsSections.carouselSection.itemHeadingPrefix} {index + 1}</h3>
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
                                <label className="text-sm text-text-secondary">{dictionary.components.cmsSections.carouselSection.uploadImageLabel}</label>
                                <Uploader
                                    type="single"
                                    variant="image"
                                    file={uploadedFiles.get(index) || null}
                                    onDelete={(id) => handleFileDelete(index, id)}
                                    onDownload={handleFileDownload(index)}
                                    onFilesChange={(file, abortSignal) => handleOnFilesChange(file, abortSignal)}
                                    onUploadComplete={(file) => handleUploadComplete(index, file)}
                                    locale={locale}
                                    maxSize={10}
                                    uploadProgress={uploadProgress}
                                />
                            </div>
                            <TextInput
                                label={dictionary.components.cmsSections.carouselSection.titleLabel}

                                inputField={{
                                    inputText: dictionary.components.cmsSections.carouselSection.titlePlaceholder,
                                    value: item.title,
                                    setValue: (value) => handleItemFieldChange(index, 'title', value)
                                }}
                            />

                            <TextAreaInput
                                label={dictionary.components.cmsSections.carouselSection.descriptionLabel}
                                value={item.description || ''}
                                setValue={(value) => handleItemFieldChange(index, 'description', value)}
                                placeholder={dictionary.components.cmsSections.carouselSection.descriptionPlaceholder}
                            />

                            <TextInput
                                label={dictionary.components.cmsSections.carouselSection.badgeLabel}
                                inputField={{
                                    inputText: dictionary.components.cmsSections.carouselSection.badgePlaceholder,
                                    value: item.badge || '',
                                    setValue: (value) => handleItemFieldChange(index, 'badge', value || null)
                                }}
                            />

                            <TextInput
                                label={dictionary.components.cmsSections.carouselSection.buttonTextLabel}
                                inputField={{
                                    inputText: dictionary.components.cmsSections.carouselSection.buttonTextPlaceholder,
                                    value: item.buttonText,
                                    setValue: (value) => handleItemFieldChange(index, 'buttonText', value)
                                }}
                            />

                            <TextInput
                                label={dictionary.components.cmsSections.carouselSection.buttonLinkLabel}
                                inputField={{
                                    inputText: dictionary.components.cmsSections.carouselSection.buttonLinkPlaceholder,
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
