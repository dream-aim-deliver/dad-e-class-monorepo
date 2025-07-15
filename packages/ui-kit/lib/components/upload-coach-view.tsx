
import React from 'react';
import { Button } from "./button";
import { IconCloudUpload } from "./icons/icon-cloud-upload";
import { IconFile } from "./icons/icon-file";
import { uploadStudentTypes } from './course-builder-lesson-component/types';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
/**
 * Props interface for the Upload Coach View component
 * Extends UploadFileStudent to add file download capability
 */
export interface UploadCoachViewProps extends uploadStudentTypes, isLocalAware {
    /** Optional callback function triggered when a file download is requested */
    onDownload: (fileId: string) => void;
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
const UploadCoachView: React.FC<UploadCoachViewProps> = ({ files, comment, onDownload,locale }) => {
    const dictionary = getDictionary(locale); 
   
    return (
        <div className="bg-base-neutral-800 p-4 rounded-md">
            <div className="flex items-center gap-2 flex-1 text-text-primary py-2 border-b border-divider">
                <span className="min-w-0"><IconCloudUpload /></span>
                <p className="text-md font-important leading-[24px] word-break">{dictionary.components.courseBuilder.uploadFiles}</p>
            </div>
            <main>
                {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-4 justify-between border-b border-divider py-4 text-text-primary w-full">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <IconFile classNames="flex-shrink-0" />
                            <span
                                className="text-text-primary truncate"
                                title={file.name}
                            >
                                {file.name}
                            </span>
                        </div>
                        <span className="flex-shrink-0 text-text-secondary text-sm">
                           24-13-11
                        </span>
                        <Button
                            variant="text"
                            text={dictionary.components.courseBuilder.downloadFilesText}
                            onClick={() => onDownload?.(file.id)}
                            className="flex-shrink-0"
                        />
                    </div>
                ))}
            </main>
            <div className="flex flex-col gap-2 mt-4">
                <p className="leading-[150%] font-important text-text-primary">{dictionary.components.courseBuilder.studentComment}</p>
                <p className="text-text-secondary leading-[150%] text-xl">{comment}</p>
            </div>
        </div>
    );
}

export default UploadCoachView;