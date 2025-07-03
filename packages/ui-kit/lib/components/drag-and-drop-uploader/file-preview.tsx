import React from 'react';
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

interface FilePreviewProps extends isLocalAware {
    uploadResponse: fileMetadata.TFileMetadata;
    index: number;
    onDelete: (id: number) => void;
    onDownload: (id: number) => void;
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

export const FilePreview: React.FC<FilePreviewProps> = ({ uploadResponse, index, onDelete, onDownload, onCancelUpload, locale }) => {
    const dictionary = getDictionary(locale);

    if (uploadResponse?.status === 'unavailable') {
        return <FeedBackMessage type="error" message="File upload failed" />;
    }
    return (
        <div className={cn('flex items-center justify-between gap-2 p-2 rounded-medium', 'bg-base-neutral-900')}>
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                    {uploadResponse?.status === 'processing' ? (
                        <div className="select-none pointer-events-none">
                            <IconLoaderSpinner classNames="w-6 h-6 animate-spin text-text-primary" />
                        </div>
                    ) : uploadResponse?.category === 'image' ? (
                        <img
                            src={(uploadResponse as fileMetadata.TFileMetadata & { category: 'image' }).thumbnailUrl}
                            alt={uploadResponse.name}
                            className="w-10 h-10 object-cover rounded-small"
                        />
                    ) : uploadResponse?.category === 'video' ? (
                        <IconVideo classNames="w-6 h-6 text-text-primary" />
                    ) : (
                        <IconFile classNames="w-6 h-6 text-text-primary" />
                    )}
                </div>
            </div>
            <div className="flex flex-col flex-1 w-full gap-1 truncate">
                {uploadResponse?.status === 'processing' ? (
                    <div className="h-[1.2rem] w-full bg-divider rounded-small border border-divider animate-pulse bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] bg-no-repeat bg-left" />
                ) : (
                    <span title={uploadResponse.name} className="text-sm font-medium text-text-primary truncate">
                        {uploadResponse.name}
                    </span>
                )}
                {uploadResponse?.status === 'processing' ? (
                    <div className="h-3 w-16 bg-divider rounded-small border border-divider animate-pulse bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] bg-no-repeat bg-left" />
                ) : (
                    <span className="text-xs text-text-secondary">
                        {(uploadResponse.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                )}
            </div>
            <div>
                {uploadResponse?.status === 'processing' ? (
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
                            onClick={() => onDownload(uploadResponse.id)}
                        />
                        <IconButton
                            icon={<IconTrashAlt />}
                            styles="text"
                            size="small"
                            title={dictionary.components.uploadingSection.deleteText}
                            onClick={() => onDelete(uploadResponse.id)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
