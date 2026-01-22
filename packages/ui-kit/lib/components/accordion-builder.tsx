'use client';

import { useRef, useState, useCallback } from 'react';
import { InputField } from './input-field';
import RichTextEditor from './rich-text-element/editor';
import { Button } from './button';
import { ContentControlButtons } from './course-builder/control-buttons';
import { fileMetadata } from '@maany_shr/e-class-models';
import { FilePreview } from './drag-and-drop-uploader/file-preview';
import { IconCloudUpload, IconPlus } from './icons';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { z } from 'zod';
import { serialize } from './rich-text-element/serializer';
import { Descendant } from 'slate';

type ImageFile = z.infer<typeof fileMetadata.FileMetadataImageSchema> | null;

export interface AccordionBuilderItem {
    id?: string;
    title: string;
    content: string;
    icon: ImageFile;
}

interface AccordionBuilderItemProps extends isLocalAware {
    item: AccordionBuilderItem;
    setItem: (item: AccordionBuilderItem) => void;
    onItemDelete: () => void;
    onItemDown: () => void;
    onItemUp: () => void;
    orderNo: number;
    totalItems: number;
    onImageChange: (
        metadata: fileMetadata.TFileUploadRequest,
        signal: AbortSignal,
    ) => Promise<ImageFile>;
    onIconDelete: () => void;
    onIconDownload: () => void;
    uploadProgress?: number;
}

function AccordionBuilderItem({
    item,
    setItem,
    onItemDelete,
    onItemDown,
    onItemUp,
    orderNo,
    totalItems,
    onImageChange,
    onIconDelete,
    onIconDownload,
    uploadProgress,
    locale,
}: AccordionBuilderItemProps) {
    const dictionary = getDictionary(locale);
    const [icon, setIcon] = useState<ImageFile | null>(item.icon);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleContentChange = useCallback(
        (newValue: Descendant[]) => {
            setItem({ ...item, content: serialize(newValue) });
        },
        [setItem, item],
    );

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newFile = event.target.files?.[0];
        if (newFile) {
            // Create abort controller for this upload
            const controller = new AbortController();
            abortControllerRef.current = controller;

            const metadata: fileMetadata.TFileMetadata = {
                id: new Date().toISOString(),
                name: newFile.name,
                size: newFile.size,
                category: 'image',
                status: 'processing', // Set to processing initially
                url: URL.createObjectURL(newFile),
                thumbnailUrl: URL.createObjectURL(newFile),
            };
            setIcon(metadata);

            try {
                const request: fileMetadata.TFileUploadRequest = {
                    id: metadata.id,
                    file: newFile,
                    name: newFile.name,
                };
                const imageMetadata = await onImageChange(
                    request,
                    controller.signal,
                );
                // Mark upload as available so preview shows image instead of loader
                setIcon(imageMetadata);
                setItem({
                    ...item,
                    icon: imageMetadata,
                });
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    // Upload was cancelled, clean up
                    setIcon(null);
                }
            } finally {
                // Clear the abort controller reference
                abortControllerRef.current = null;
            }

            // Reset file input so the same file can be uploaded again
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIcon(null);
    };

    const shownIcon = icon ?? item.icon;

    return (
        <div className=" w-full p-4 text-text-secondary bg-base-neutral-800 border border-base-neutral-700 flex flex-col gap-4 rounded-md">
            <div className="flex items-center justify-between overflow-x-auto text-button-primary-text ">
                {/* Title and Icon */}
                <div className="flex items-center md:gap-4 gap-2 flex-1 text-button-text-text overflow-hidden">
                    <span className="min-w-0 flex-shrink-0">
                        <h4 className="md:text-3xl text-lg text-action-default font-semibold">
                            {orderNo}.
                        </h4>
                    </span>
                    {!shownIcon && (
                        <div className='flex flex-col items-start'>
                            <Button
                                text={
                                    dictionary.components.accordion
                                        .uploadIconText
                                }
                                variant="text"
                                size="small"
                                hasIconLeft={true}
                                iconLeft={<IconCloudUpload />}
                                className="capitalize px-0"
                                onClick={() => fileInputRef.current?.click()}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <p className='text-text-secondary text-sm'> {dictionary.components.accordion.recommendedSize} </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <ContentControlButtons
                    onDelete={() => onItemDelete()}
                    onMoveUp={() => onItemUp()}
                    onMoveDown={() => onItemDown()}
                    isFirst={orderNo === 1}
                    isLast={orderNo === totalItems}
                />
            </div>
            {shownIcon && (
                <FilePreview
                    uploadResponse={{
                        ...shownIcon,
                        uploadProgress: shownIcon.status === 'processing' ? uploadProgress : undefined
                    }}
                    deletion={{
                        isAllowed: true,
                        onDelete: (id: string) => {
                            onIconDelete();
                            setIcon(null);
                        },
                    }}
                    onDownload={(id: string) => onIconDownload()}
                    onCancel={handleCancelUpload}
                    locale={locale}
                    readOnly={false}
                />
            )}

            <div className="flex flex-col transition-all duration-300 ease-in-out">
                <label className="text-text-secondary md:text-xl leading-[150%] capitalize">
                    {dictionary.components.accordion.visibleText}
                </label>
                <InputField
                    inputText={
                        dictionary.components.accordion.visiblePlaceholderText
                    }
                    className="w-full"
                    value={item.title}
                    setValue={(newValue) => {
                        setItem({ ...item, title: newValue });
                    }}
                    type="text"
                    id="visibleText"
                />
            </div>
            <div className="w-full flex flex-col ">
                <label className="text-text-secondary md:text-xl leading-[150%] capitalize">
                    {dictionary.components.accordion.collapsedText}
                </label>
                <div className="w-full">
                    <RichTextEditor
                        key={`richText-${orderNo}`}
                        initialValue={item.content}
                        locale={locale}
                        name="content"
                        onChange={handleContentChange}
                        onLoseFocus={(value) => {
                            // The text is already saved on change
                        }}
                        placeholder={
                            dictionary.components.accordion
                                .collapsedPlaceholderText
                        }
                        onDeserializationError={(message, error) =>
                            console.error('Deserialization error:', message)
                        }
                    />
                </div>
            </div>
        </div>
    );
}

interface AccordionBuilderProps extends isLocalAware {
    items: AccordionBuilderItem[];
    setItems: React.Dispatch<React.SetStateAction<AccordionBuilderItem[]>>;
    onIconChange: (
        image: fileMetadata.TFileUploadRequest,
        signal: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onIconDownload: (index: number) => void;
    uploadProgress?: number;
}

export function AccordionBuilder({
    items,
    setItems,
    onIconChange,
    onIconDownload,
    uploadProgress,
    locale,
}: AccordionBuilderProps) {
    const dictionary = getDictionary(locale);
    const handleAddAccordion = (insertIndex?: number) => {
        const newItem: AccordionBuilderItem = {
            title: '',
            content: '',
            icon: null,
        };
        if (insertIndex !== undefined) {
            const newItems = [...items];
            newItems.splice(insertIndex + 1, 0, newItem);
            setItems(newItems);
        } else {
            setItems([...items, newItem]);
        }
    };
    const handleUpClick = (index: number) => {
        if (index === 0) return;
        const newItems = [...items];
        const [movedItem] = newItems.splice(index, 1);
        newItems.splice(index - 1, 0, movedItem);
        setItems(newItems);
    };
    const handleDownClick = (index: number) => {
        if (index === items.length - 1) return;
        const newItems = [...items];
        const [movedItem] = newItems.splice(index, 1);
        newItems.splice(index + 1, 0, movedItem);
        setItems(newItems);
    };
    const handleDeleteClick = (index: number) => {
        const newItems = items.filter((_, i) => i != index);
        setItems(newItems);
    };

    const handleIconUpload = async (
        metadata: fileMetadata.TFileUploadRequest,
        signal: AbortSignal,
    ): Promise<fileMetadata.TFileMetadataImage> => {
        return (await onIconChange(
            metadata,
            signal,
        )) as fileMetadata.TFileMetadataImage;
    };

    return (
        <div className="flex flex-col gap-4 w-full bg-card-fill p-4 rounded-lg border border-neutral-700">
            <div className="w-full flex flex-col gap-4">
                {items.map((item, index) => (
                    <div
                        key={`accordion-wrapper-${index}`}
                        className="flex flex-col gap-4"
                    >
                        <AccordionBuilderItem
                            key={`accordion-item-${index}`}
                            orderNo={index + 1}
                            totalItems={items.length}
                            item={item}
                            setItem={(newItem) => {
                                const newItems = items.map((prev, i) => i === index ? newItem : prev);
                                setItems(newItems);
                            }}
                            onItemDelete={() => handleDeleteClick(index)}
                            onItemUp={() => handleUpClick(index)}
                            onItemDown={() => handleDownClick(index)}
                            onImageChange={handleIconUpload}
                            onIconDelete={() => {
                                setItems((prevItems) =>
                                    prevItems.map((prevItem, i) => {
                                        if (i === index) {
                                            return {
                                                ...prevItem,
                                                icon: null,
                                            };
                                        }
                                        return prevItem;
                                    }),
                                );
                            }}
                            onIconDownload={() => {
                                onIconDownload(index);
                            }}
                            uploadProgress={uploadProgress}
                            locale={locale}
                        />
                        {index === items.length - 1 && (
                            <div
                                className="flex items-center gap-2"
                                role="group"
                                aria-label="Add link divider"
                            >
                                <hr className="flex-grow border-t border-divider" />
                                <Button
                                    text={
                                        dictionary.components.accordion
                                            .addItemText
                                    }
                                    hasIconLeft
                                    iconLeft={<IconPlus />}
                                    onClick={() => handleAddAccordion(index)}
                                    aria-label="Add link"
                                    variant="text"
                                />
                                <hr className="flex-grow border-t border-divider" />
                            </div>
                        )}
                    </div>
                ))}
                {items.length === 0 && (
                    <div
                        className="flex items-center gap-2"
                        role="group"
                        aria-label="Add link divider"
                    >
                        <hr className="flex-grow border-t border-divider" />
                        <Button
                            text={dictionary.components.accordion.addItemText}
                            hasIconLeft
                            iconLeft={<IconPlus />}
                            onClick={() => handleAddAccordion()}
                            aria-label="Add link"
                            variant="text"
                        />
                        <hr className="flex-grow border-t border-divider" />
                    </div>
                )}
            </div>
        </div>
    );
}
