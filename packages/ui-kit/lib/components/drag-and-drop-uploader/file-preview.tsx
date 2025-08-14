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


interface FilePreviewProps extends isLocalAware {
    uploadResponse: fileMetadata.TFileMetadata;
    onDownload: (id: string) => void;
    onCancel: (id: string) => void;
    isDeletionAllowed?: boolean;
    className?: string;
    onDelete?: (id: string) => void;
    readOnly?: boolean;
}

/**
 *
 * A component that displays a preview of a file being uploaded, including its name, size, and options to delete or download it.
 *
 * @param file The file object containing information about the uploaded file.
 * @param index The index of the file in the list of uploaded files.
 * @param onDelete Callback function to handle file deletion.
 * @param onDownload Callback function to handle file download.
 * @param locale The locale for translations.
 **/

/**
 * Determines the file type based on file extension
 * @param fileName The name of the file
 * @returns The determined file type: 'image', 'video', or 'document'
 */
const getFileTypeFromExtension = (fileName: string): 'image' | 'video' | 'document' => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];

    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    return 'document';
};

export const FilePreview: React.FC<FilePreviewProps> = (props) => {
    const { uploadResponse, onDownload, locale } = props;
    const dictionary = getDictionary(locale);
    const [thumbnailError, setThumbnailError] = useState(false);
    const [thumbnailLoading, setThumbnailLoading] = useState(true);
    if (uploadResponse?.status === 'unavailable') {
        return <FeedBackMessage type="error" message="File upload failed" />;
    }

    /**
     * Gets the appropriate preview element based on file status and type
     */
    const getFilePreviewElement = () => {
        // For files in processing state
        if (uploadResponse?.status === 'processing') {
            return (
                <div className="select-none pointer-events-none">
                    <IconLoaderSpinner classNames="w-6 h-6 animate-spin text-text-primary" />
                </div>
            );
        }

        // Determine file category - use specified category or detect from extension if generic
        const fileCategory = uploadResponse?.category === 'generic'
            ? getFileTypeFromExtension(uploadResponse.name)
            : uploadResponse?.category;

        // Return appropriate element based on category
        if (fileCategory === 'image') {
            if (thumbnailError) {
                return <IconImage classNames="w-6 h-6 text-text-primary" />;
            }

            // Show loader while thumbnail is loading
            if (thumbnailLoading) {
                return (
                    <div className="relative  flex items-center justify-center">
                        <IconLoaderSpinner classNames="w-6 h-6 animate-spin text-text-secondary" />
                        <img
                            src={(uploadResponse as fileMetadata.TFileMetadata & { thumbnailUrl?: string }).thumbnailUrl || 'https://example.com'}
                            alt={uploadResponse.name}
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
                <img
                    src={(uploadResponse as fileMetadata.TFileMetadata & { thumbnailUrl?: string }).thumbnailUrl || ''}
                    alt={uploadResponse.name}
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
        <div className={cn('flex items-center justify-between gap-2 py-2 rounded-medium', 'bg-base-neutral-900', props.className)}>
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                    {getFilePreviewElement()}
                </div>
            </div>
            <div className="flex flex-col flex-1 w-full gap-1 truncate">
                {uploadResponse?.status === 'processing' ? (
                    <>
                        <div className="h-[1.2rem] w-full bg-divider rounded-small border border-divider animate-pulse bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] bg-no-repeat bg-left" />
                        <div className="h-3 w-16 bg-divider rounded-small border border-divider animate-pulse bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] bg-no-repeat bg-left" />
                    </>
                ) : (
                    <>
                        <span title={uploadResponse.name} className="text-sm font-medium text-text-primary truncate">
                            {uploadResponse.name}
                        </span>
                        <span className="text-xs text-text-secondary">
                            {(uploadResponse.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                    </>
                )}
            </div>
            <div>
                {uploadResponse?.status === 'processing' ? (
                    ('readOnly' in props && props.readOnly) ? (
                        <span className="text-sm text-text-secondary">
                            Processing...
                        </span>
                    ) : (
                        <Button
                            variant="text"
                            className="px-0"
                            onClick={() => {
                                if ('onCancel' in props) {
                                    props.onCancel(uploadResponse.id as string);
                                }
                            }}
                            text={dictionary.components.uploadingSection.cancelUpload}
                        />
                    )
                ) : (
                    <div className="font-bold flex items-center cursor-pointer">
                        <IconButton
                            icon={<IconCloudDownload />}
                            size="small"
                            styles="text"
                            title={dictionary.components.uploadingSection.downloadText}
                            onClick={() => onDownload(uploadResponse.id as string)}
                        />
                        {props.isDeletionAllowed &&
                            <IconButton
                                icon={<IconTrashAlt />}
                                styles="text"
                                size="small"
                                title={dictionary.components.uploadingSection.deleteText}
                                onClick={() => props.onDelete?.(uploadResponse.id as string)}
                            />
                        }
                    </div>
                )}
            </div>
        </div>
    );
};