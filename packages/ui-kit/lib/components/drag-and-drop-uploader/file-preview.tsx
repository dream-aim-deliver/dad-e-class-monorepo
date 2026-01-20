'use client';

import React, { useState } from 'react';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconFile } from '../icons/icon-file';
import { IconVideo } from '../icons/icon-video';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { cn } from '../../utils/style-utils';
import { Button } from '../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';
import { FeedBackMessage } from '../feedback-message';
import { IconImage } from '../icons/icon-image';
import { useImageComponent } from '../../contexts/image-component-context';

interface DeletionAllowed {
    isAllowed: true;
    onDelete: (id: string) => void;
}

interface DeletionNotAllowed {
    isAllowed: false;
}

type Deletion = DeletionAllowed | DeletionNotAllowed;

interface FilePreviewProps extends isLocalAware {
    uploadResponse: fileMetadata.TFileMetadata;
    onDownload: (id: string) => void;
    onCancel?: (id: string) => void;
    deletion: Deletion;
    className?: string;
    readOnly: boolean;
}

/**
 *
 * A component that displays a preview of a file being uploaded, including its name, size, and options to delete or download it.
 *
 * @param file The file object containing information about the uploaded file.
 * @param index The index of the file in the list of uploaded files.
 * @param deletion Contains isAllowed (to delete), if the user is allowed to delete the file, and if so, also an onDelete callback function to handle file deletion.
 * @param onDownload Callback function to handle file download.
 * @param locale The locale for translations.
 * @param readOnly If the user has read-only permission to the file while it is processing
 * @param onCancel Optional callback, if passed, renders a button to cancel the upload while it is processing
 * @param
 **/

/**
 * Determines the file type based on file extension
 * @param fileName The name of the file
 * @returns The determined file type: 'image', 'video', or 'document'
 */
const getFileTypeFromExtension = (
    fileName: string,
): 'image' | 'video' | 'document' => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoTypes = [
        'mp4',
        'webm',
        'ogg',
        'mov',
        'avi',
        'wmv',
        'flv',
        'mkv',
    ];

    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    return 'document';
};

export const FilePreview = (props: FilePreviewProps) => {
    const { uploadResponse, onDownload, locale } = props;
    const ImageComponent = useImageComponent();
    const dictionary = getDictionary(locale);
    const [thumbnailError, setThumbnailError] = useState(false);
    const [thumbnailLoading, setThumbnailLoading] = useState(true);
    if (uploadResponse?.status === 'unavailable') {
        return <FeedBackMessage type="error" message={dictionary.components.uploadingSection.fileUploadFailedText} />;
    }

    /**
     * Gets the appropriate preview element based on file status and type
     */
    const getFilePreviewElement = () => {
        // For files in processing state
        if (uploadResponse?.status === 'processing') {
            // If we have progress, show progress bar instead of spinner
            if (uploadResponse.uploadProgress !== undefined) {
                return (
                    <div className="flex flex-col items-center justify-center gap-0.5">
                        <div className="w-5 h-5 relative">
                            <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 24 24">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    className="text-base-neutral-700"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 10}`}
                                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - uploadResponse.uploadProgress / 100)}`}
                                    className="text-base-neutral-300 transition-all duration-300"
                                />
                            </svg>
                        </div>
                    </div>
                );
            }
            return (
                <div className="select-none pointer-events-none">
                    <IconLoaderSpinner classNames="w-6 h-6 animate-spin text-text-primary" />
                </div>
            );
        }

        // Determine file category - use specified category or detect from extension if generic
        const fileCategory =
            uploadResponse?.category === 'generic'
                ? getFileTypeFromExtension(uploadResponse.name as string)
                : uploadResponse?.category;

        // Return appropriate element based on category
        if (fileCategory === 'image') {
            if (thumbnailError) {
                return <IconImage classNames="w-6 h-6 text-text-primary" />;
            }

            // Get thumbnailUrl or url for image display
            const imageUrl = (
                uploadResponse as fileMetadata.TFileMetadata & {
                    thumbnailUrl?: string;
                }
            ).thumbnailUrl || uploadResponse.url;

            // If no valid image URL, show icon instead
            if (!imageUrl || imageUrl === '') {
                return <IconImage classNames="w-6 h-6 text-text-primary" />;
            }

            // Show loader while thumbnail is loading
            if (thumbnailLoading) {
                return (
                    <div className="relative  flex items-center justify-center">
                        <IconLoaderSpinner classNames="w-6 h-6 animate-spin text-text-secondary" />
                        <ImageComponent
                            src={imageUrl}
                            alt={uploadResponse.name}
                            width={40}
                            height={40}
                            className="absolute inset-0 w-full h-full object-cover rounded-small opacity-0"
                            onLoad={() => setThumbnailLoading(false)}
                            onError={() => {
                                setThumbnailError(true);
                                setThumbnailLoading(false);
                            }}
                        />
                    </div>
                );
            }

            return (
                <ImageComponent
                    src={imageUrl}
                    alt={uploadResponse.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-small"
                    onError={() => setThumbnailError(true)}
                />
            );
        }

        if (fileCategory === 'video') {
            return <IconVideo classNames="w-6 h-6 text-text-primary" />;
        }

        // Default to file icon for all other types
        return <IconFile classNames="w-6 h-6 text-text-primary" />;
    };

    return (
        <div
            className={cn(
                'flex items-center justify-between gap-2 py-2 rounded-medium',
                props.className,
            )}
        >
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                    {getFilePreviewElement()}
                </div>
            </div>
            <div className="flex flex-col flex-1 w-full gap-1 truncate">
                {uploadResponse?.status === 'processing' ? (
                    <>
                        <span
                            title={uploadResponse.name}
                            className="text-sm font-medium text-text-primary truncate"
                        >
                            {uploadResponse.name}
                        </span>
                        {uploadResponse.uploadProgress !== undefined ? (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-base-neutral-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-500 transition-all duration-300"
                                        style={{ width: `${uploadResponse.uploadProgress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-text-secondary">
                                    {uploadResponse.uploadProgress}%
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs text-text-secondary">
                                {dictionary.components.uploadingSection.uploadingText}...
                            </span>
                        )}
                    </>
                ) : (
                    <>
                        <span
                            title={uploadResponse.name}
                            className="text-sm font-medium text-text-primary truncate"
                        >
                            {uploadResponse.name}
                        </span>
                        <span className="text-xs text-text-secondary">
                            {(uploadResponse.size as number) >= 1024 * 1024 * 1024
                                ? `${((uploadResponse.size as number) / (1024 * 1024 * 1024)).toFixed(2)} GB`
                                : `${((uploadResponse.size as number) / (1024 * 1024)).toFixed(2)} MB`}
                        </span>
                    </>
                )}
            </div>
            <div>
                {uploadResponse?.status === 'processing' ? (
                    props.readOnly ? (
                        <span className="text-sm text-text-secondary">
                            {dictionary.components.uploadingSection.processingText}
                        </span>
                    ) : (
                        // Only show the Button if 'onCancel' exists in props
                        props.onCancel && (
                            <Button
                                variant="text"
                                className="px-0"
                                type="button"
                                onClick={() => {
                                    props.onCancel!(
                                        uploadResponse.id as string,
                                    );
                                }}
                                text={
                                    dictionary.components.uploadingSection
                                        .cancelUpload
                                }
                            />
                        )
                    )
                ) : (
                    <div className="font-bold flex items-center cursor-pointer">
                        <IconButton
                            icon={<IconCloudDownload />}
                            size="small"
                            styles="text"
                            title={
                                dictionary.components.uploadingSection
                                    .downloadText
                            }
                            onClick={() =>
                                onDownload(uploadResponse.id as string)
                            }
                        />
                        {props.deletion.isAllowed === true && (
                            <IconButton
                                icon={<IconTrashAlt />}
                                styles="text"
                                size="small"
                                title={
                                    dictionary.components.uploadingSection
                                        .deleteText
                                }
                                onClick={() => {
                                    if (props.deletion.isAllowed) {
                                        props.deletion.onDelete(
                                            uploadResponse.id as string,
                                        );
                                    }
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
