import React from 'react';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconFile } from '../icons/icon-file';
import { IconVideo } from '../icons/icon-video';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { cn } from '../../utils/style-utils';
import { Button } from '../button';
import { IconError } from '../icons/icon-error';
import { UploadedFileType, FileUploadResponse, ImageUploadResponse } from './uploader';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { FeedBackMessage } from '../feedback-message';

interface FilePreviewProps extends isLocalAware {
    file: UploadedFileType;
    index: number;
    onDelete: (index: number) => void;
    onDownload: (index: number) => void;
    onCancelUpload: (index: number) => void;
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

export const FilePreview: React.FC<FilePreviewProps> = ({ file, index, onDelete, onDownload, onCancelUpload, locale }) => {
    const fileType = file.file.type.split('/')[0];
    const dictionary = getDictionary(locale);

    if (file.error) {
        return <FeedBackMessage type="error" message={file.error} />;
    }
    return (
        <div className={cn('flex items-center justify-between gap-2 p-2 rounded-medium', 'bg-base-neutral-900')}>
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                    {file.isUploading ? (
                        <IconLoaderSpinner classNames="w-6 h-6 animate-spin text-text-primary" />
                    ) : fileType === 'image' ? (
                        file.responseData && 'imageThumbnailUrl' in file.responseData ? (
                            <img
                                src={(file.responseData as ImageUploadResponse).imageThumbnailUrl}
                                alt={file.file.name}
                                className="w-10 h-10 object-cover rounded-small"
                            />
                        ) : null
                    ) : fileType === 'video' ? (
                        <IconVideo classNames="w-6 h-6 text-text-primary" />
                    ) : (
                        <IconFile classNames="w-6 h-6 text-text-primary" />
                    )}
                </div>
            </div>
            <div className="flex flex-col flex-1 w-full gap-1 truncate">
                {file.isUploading ? (
                    <div className="h-[1.2rem] w-full bg-divider rounded-small border border-divider animate-pulse bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] bg-no-repeat bg-left" />
                ) : (
                    <span title={file.responseData && 'fileName' in file.responseData
                        ? (file.responseData as FileUploadResponse).fileName
                        : file.file.name} className="text-sm font-medium text-text-primary truncate">
                        {file.responseData && 'fileName' in file.responseData
                            ? (file.responseData as FileUploadResponse).fileName
                            : file.file.name}
                    </span>
                )}
                <span className="text-xs text-text-secondary">
                    {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
            </div>
            <div>
                {file.isUploading ? (
                    <Button
                        variant="text"
                        className="px-0"
                        onClick={() => onCancelUpload(index)}
                        text={dictionary.components.uploadingSection.cancelUpload}
                    />
                ) : (
                    <div className="font-bold flex items-center cursor-pointer">
                        <IconButton
                            icon={<IconCloudDownload />}
                            size="small"
                            styles="text"
                            title={dictionary.components.uploadingSection.downloadText}
                            onClick={() => onDownload(index)}
                        />
                        <IconButton
                            icon={<IconTrashAlt />}
                            styles="text"
                            size="small"
                            title={dictionary.components.uploadingSection.deleteText}
                            onClick={() => onDelete(index)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
