'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { IconPaste } from './icons/icon-paste';
import { InputField } from './input-field';
import { IconButton } from './icon-button';
import { IconLink } from './icons/icon-link';
import { IconTrashAlt } from './icons/icon-trash-alt';
import { IconEdit } from './icons/icon-edit';
import { IconLoaderSpinner } from './icons/icon-loader-spinner';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';
import { IconCloudUpload } from './icons';
import { getFaviconUrl } from '../utils/url-utils';
import { IconExternalLink } from './icons/icon-external-link';
import { useImageComponent } from '../contexts/image-component-context';

interface LinkEditProps extends isLocalAware {
    initialTitle?: string;
    initialUrl?: string;
    initialCustomIcon?: fileMetadata.TFileMetadata;
    onImageChange: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onDeleteIcon?: (id: string) => void;
    onSave: (
        title: string,
        url: string,
        customIcon?: fileMetadata.TFileMetadata,
    ) => void;
    onDiscard: () => void;
}
/**
 *
 * @param param0
 * @description LinkEdit component allows users to edit a link's title, URL, and custom icon. It validates the input fields and provides save and discard functionality.
 * @example
 * ```tsx
 * <LinkEdit
 *     initialTitle="My Link"
 *     initialUrl="https://example.com"
 *     initialFile={null}
 *     onSave={() => console.log("Saved")}
 *     onDiscard={() => console.log("Discarded")}
 * />
 * @returns
 */
const LinkEdit: React.FC<LinkEditProps> = ({
    initialTitle = '',
    initialUrl = '',
    initialCustomIcon,
    onSave,
    onDiscard,
    onImageChange,
    onDeleteIcon,
    locale,
}) => {
    const [title, setTitle] = useState<string>(initialTitle);
    const [url, setUrl] = useState<string>(initialUrl);
    const [favicon, setFavicon] = useState<string>('');
    const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [customIcon, setCustomIcon] =
        useState<fileMetadata.TFileMetadata | null>(initialCustomIcon ?? null);
    const dictionary = getDictionary(locale);
    const ImageComponent = useImageComponent();
    useEffect(() => {
        setCustomIcon(initialCustomIcon || null);
    }, [initialCustomIcon]);

    // Cleanup abort controller on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const validateFields = () => {
        const newErrors: { title?: string; url?: string } = {};
        if (!title.trim()) {
            newErrors.title = dictionary.components.link.titleRequired;
        }
        if (!url.trim()) {
            newErrors.url = dictionary.components.link.urlRequired;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateFields()) {
            onSave(title, url, customIcon ?? undefined);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0];
        if (newFile) {
            // Create abort controller for this upload
            const controller = new AbortController();
            abortControllerRef.current = controller;

            const fileRequest: fileMetadata.TFileUploadRequest = {
                id: new Date().toISOString(),
                name: newFile.name,
                file: newFile,
            };

            // Create temporary metadata for UI state
            const tempMetadata: fileMetadata.TFileMetadata = {
                id: fileRequest.id,
                name: fileRequest.name,
                size: newFile.size,
                category: 'image',
                status: 'processing',
                url: URL.createObjectURL(newFile),
                thumbnailUrl: URL.createObjectURL(newFile),
            };
            setCustomIcon(tempMetadata);

            try {
                const uploadedFile = await onImageChange(
                    fileRequest,
                    controller.signal,
                );
                setCustomIcon(uploadedFile);
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    // Upload was cancelled, clean up
                    setCustomIcon(null);
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
            // Immediately clear the custom icon state to stop showing the spinner
            setCustomIcon(null);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        if (url) {
            setFavicon(getFaviconUrl(url));
        } else {
            setFavicon('');
        }
    }, [url]);

    const renderIcon = () => {
        // Handle custom icon case
        if (customIcon && 'url' in customIcon) {
            const iconUrl =
                customIcon.category === 'image' && customIcon.thumbnailUrl
                    ? customIcon.thumbnailUrl
                    : customIcon.url;

            // Show spinner during processing
            if (customIcon.status === 'processing') {
                return (
                    <div className="w-12 h-12 flex items-center justify-center bg-base-neutral-700 rounded">
                        <IconLoaderSpinner classNames="w-6 h-6 animate-spin text-text-primary" />
                    </div>
                );
            }

            return (
                <ImageComponent
                    src={iconUrl}
                    alt={title}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded"
                />
            );
        }

        // Handle favicon case
        if (favicon) {
            return (
                <ImageComponent
                    src={favicon}
                    alt={title}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded"
                />
            );
        }

        // Default icon
        return (
            <IconButton
                icon={<IconLink />}
                size="medium"
                className="bg-base-neutral-700 rounded-md text-text-primary"
            />
        );
    };
    return (
        <div className="p-4 flex flex-col border-1 rounded-md border-card-stroke w-full bg-card-fill gap-4 text-text-primary">
            <div className="flex gap-2">
                <div className="flex-1 flex flex-col gap-2 w-full">
                    <div>
                        <h6 className="text-sm md:text-md text-text-primary ">
                            {dictionary.components.link.titleLabel}
                        </h6>
                        <InputField
                            value={title}
                            setValue={setTitle}
                            state={errors.title ? 'error' : 'filled'}
                            inputText={
                                dictionary.components.link.titlePlaceholder
                            }
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div>
                        <h6 className="text-sm md:text-md text-text-primary ">
                            {dictionary.components.link.urlLabel}
                        </h6>
                        <InputField
                            hasRightContent
                            rightContent={
                                <div title={dictionary.components.link.paste}>
                                    <IconPaste classNames="text-button-text-primary cursor-pointer" />
                                </div>
                            }
                            value={url}
                            setValue={setUrl}
                            type="url"
                            state={errors.url ? 'error' : 'filled'}
                            inputText={
                                dictionary.components.link.urlPlaceholder
                            }
                        />
                        {errors.url && (
                            <p className="text-sm text-red-500">{errors.url}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h6 className="text-sm md:text-md text-text-primary">
                    {dictionary.components.link.LinkIcon}
                </h6>
                <>
                    {customIcon || (favicon && /^https?:\/\//.test(url)) ? (
                        <div className="inline-flex items-center gap-2 mt-1">
                            {renderIcon()}
                        </div>
                    ) : (
                        <IconButton
                            icon={<IconLink />}
                            size="medium"
                            className="bg-base-neutral-700 rounded-md text-text-primary"
                        />
                    )}
                </>
                <div className="flex items-center gap-2 min-h-[40px] relative">
                    {/* We use a wrapper div with fixed height to prevent layout shift */}
                    <div className="min-h-[40px] flex items-center">
                        {/* Processing state (Cancel button) */}
                        <div
                            className={`absolute transition-all duration-300 ease-in-out transform ${
                                customIcon?.status === 'processing'
                                    ? 'opacity-100 translate-y-0 scale-100'
                                    : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                            }`}
                        >
                            <Button
                                text="Cancel"
                                onClick={handleCancelUpload}
                                hasIconRight
                                iconRight={
                                    <IconTrashAlt classNames="w-4 h-4" />
                                }
                                variant="secondary"
                                className="min-w-[120px]"
                                size="small"
                            />
                        </div>

                        {/* Upload button state */}
                        <div
                            className={`transition-all duration-300 ease-in-out transform ${
                                customIcon?.status !== 'processing'
                                    ? 'opacity-100 translate-y-0 scale-100'
                                    : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                            }`}
                        >
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-text-secondary text-xs mb-2">
                                    {
                                        dictionary.components.link
                                            .recommendedSize
                                    }
                                </p>
                                <div className="flex flex-row gap-3">
                                    <Button
                                        onClick={handleButtonClick}
                                        text={
                                            dictionary.components.link
                                                .customIcon
                                        }
                                        hasIconLeft
                                        iconLeft={<IconCloudUpload />}
                                        variant="secondary"
                                        size="small"
                                        className="min-w-[150px]"
                                    />
                                    {customIcon?.status === 'available' && (
                                        <IconButton
                                            onClick={() => {
                                                onDeleteIcon?.(
                                                    customIcon.id as string,
                                                );
                                                setCustomIcon(null);
                                            }}
                                            icon={<IconTrashAlt />}
                                            styles="text"
                                            size="small"
                                            className="transition-opacity duration-300"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="File upload"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    size="medium"
                    onClick={onDiscard}
                    variant="secondary"
                    className="w-full capitalize"
                    text={dictionary.components.link.discardText}
                />
                <Button
                    size="medium"
                    onClick={handleSave}
                    variant="primary"
                    className="w-full capitalize"
                    text={dictionary.components.link.saveText}
                />
            </div>
        </div>
    );
};

interface LinkPreviewProps {
    title: string;
    url: string;
    customIcon?: fileMetadata.TFileMetadata;
    onEdit?: () => void;
    onDelete?: () => void;
    preview?: boolean;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({
    title,
    url,
    customIcon,
    onDelete,
    onEdit,
    preview = false,
}) => {
    const [favicon, setFavicon] = useState<string>('');
    const ImageComponent = useImageComponent();

    useEffect(() => {
        if (url) {
            setFavicon(getFaviconUrl(url));
        } else {
            setFavicon('');
        }
    }, [url]);

    const renderIcon = () => {
        // Handle custom icon case
        if (customIcon && 'url' in customIcon) {
            const iconUrl =
                customIcon.category === 'image' && customIcon.thumbnailUrl
                    ? customIcon.thumbnailUrl
                    : customIcon.url;

            // Show spinner during processing
            if (customIcon.status === 'processing') {
                return (
                    <div className="w-10 h-10 flex items-center justify-center bg-base-neutral-700 rounded-md">
                        <IconLoaderSpinner classNames="w-5 h-5 animate-spin text-text-primary" />
                    </div>
                );
            }

            return (
                <ImageComponent
                    src={iconUrl}
                    alt={title}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-md"
                />
            );
        }

        // Handle favicon case
        if (favicon) {
            return (
                <ImageComponent
                    src={favicon}
                    alt={title}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-md"
                />
            );
        }

        // Default icon
        return (
            <IconButton
                icon={<IconLink />}
                size="medium"
                className="bg-base-neutral-700 rounded-md text-text-primary"
            />
        );
    };

    return (
        <div className="flex gap-2 h-auto text-text-primary w-full items-center justify-between ">
            <main className="flex flex-grow min-w-0">
                {' '}
                {/* Added min-w-0 to enable truncation */}
                <div className="w-full flex gap-2 items-center rounded-md">
                    <div className="flex-shrink-0">
                        {' '}
                        {/* Prevent icon from shrinking */}
                        {renderIcon()}
                    </div>
                    <div className="flex flex-col flex-grow min-w-0">
                        {' '}
                        {/* Added min-w-0 to enable truncation */}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={url}
                            className="md:text-xl flex gap-1 items-center truncate underline hover:text-button-primary-fill"
                        >
                            <span className="truncate">{title}</span>
                            <IconExternalLink classNames="w-4 h-4 flex-shrink-0 hover:text-button-primary-fill" />{' '}
                            {/* Prevent icon from shrinking */}
                        </a>
                        <p className="text-sm text-text-secondary truncate">
                            {url}
                        </p>
                    </div>
                </div>
            </main>
            {preview && (
                <div className="flex items-center gap-1 flex-shrink-0">
                    {' '}
                    {/* Added flex-shrink-0 to prevent shrinking */}
                    <IconButton
                        styles="text"
                        icon={<IconEdit />}
                        size="medium"
                        onClick={onEdit}
                    />
                    <IconButton
                        styles="text"
                        icon={<IconTrashAlt />}
                        size="medium"
                        onClick={onDelete}
                    />
                </div>
            )}
        </div>
    );
};

export { LinkEdit, LinkPreview };
