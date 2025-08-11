
import React from 'react';
import { Button } from "./button";
import { IconCloudUpload } from "./icons/icon-cloud-upload";
import { IconFile } from "./icons/icon-file";
import { UploadFilesForm } from './course-builder-lesson-component/types';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
/**
 * Props interface for the Upload Coach View component
 * Extends UploadFileStudent to add file download capability
 * 
 *  callback function triggered when a file download is requested 
 */
export interface UploadCoachViewProps extends UploadFilesForm, isLocalAware {
    onDownload: (fileId: string) => void;
    createdAt: string;
}

/**
 * Component for displaying student uploaded files in the coach's view
 * Shows a list of uploaded files with download options and student comments
 * 
 * @param param0 - Component props
 * @param param0.studentUploadedFiles - Array of files uploaded by the student
 * @param param0.studentComment - Comment provided by the student
 * @param param0.onDownload - Optional callback for handling file downloads
 */
const UploadCoachView: React.FC<UploadCoachViewProps> = ({ files, comment, onDownload, locale, createdAt }) => {
    const dictionary = getDictionary(locale);

    // Format the createdAt date to match the required format: 2024-07-23 23:31
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Return original if invalid date
            }

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}`;
        } catch {
            return dateString; // Return original if formatting fails
        }
    };

    return (
        <div className="bg-base-neutral-800 p-4 rounded-md">
            <div className="flex items-center gap-2 flex-1 text-text-primary py-2 border-b border-divider">
                <span className="min-w-0"><IconCloudUpload /></span>
                <p className="text-md font-important leading-[24px] word-break">{dictionary.components.courseBuilder.uploadFiles}</p>
            </div>
            <main>
                {files.map((file, index) => (
                    <div key={index} className="grid grid-cols-3 items-center gap-4 border-b border-divider py-4 text-text-primary w-full">
                        <div className="flex items-center gap-2 min-w-0">
                            <IconFile classNames="flex-shrink-0" />
                            <span
                                className="text-text-primary truncate"
                                title={file.name}
                            >
                                {file.name}
                            </span>
                        </div>
                        <span title={formatDate(createdAt)} className="text-text-secondary text-sm md:text-md text-end truncate">
                            {formatDate(createdAt)}
                        </span>
                        <div className="flex justify-end">
                            <Button
                                variant="text"
                                text={dictionary.components.courseBuilder.downloadFilesText}
                                onClick={() => onDownload?.(file.id)}
                                className="flex-shrink-0"
                            />
                        </div>
                    </div>
                ))}
            </main>
            <div className="flex flex-col gap-2 mt-4">
                <p className="leading-[150%] font-important text-text-primary text-sm md:text-md">{dictionary.components.courseBuilder.studentComment}</p>
                <p className="text-text-secondary leading-[150%] md:text-xl">
                    {comment?.trim() ? comment : 'No student comment'}
                </p>
            </div>
        </div>
    );
}

export default UploadCoachView;