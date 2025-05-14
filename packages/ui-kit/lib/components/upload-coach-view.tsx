import React from 'react';
import { Button } from "./button";
import { UploadFileType as UploadFileType } from "./course-builder-lesson-component/types";
import { IconCloudUpload } from "./icons/icon-cloud-upload";
import { IconFile } from "./icons/icon-file";
import { FileUploadResponse, ImageUploadResponse, VideoUploadResponse } from './drag-and-drop/uploader';

interface UploadCoachViewProps extends UploadFileType {
    onDownload?: (fileId: string) => void;
}

const UploadCoachView: React.FC<UploadCoachViewProps> = ({ studentUploadedFiles, studentComment, onDownload }) => {
    const getFileName = (file: FileUploadResponse | ImageUploadResponse | VideoUploadResponse & { url: string, uploadedAt: string }): string => {
        if ('fileName' in file) {
            return file.fileName;
        }
        if ('imageThumbnailUrl' in file) {
            return 'Image file';
        }
        if ('videoId' in file) {
            return 'Video file';
        }
        return 'Unknown file';
    };

    const getFileId = (file: FileUploadResponse | ImageUploadResponse | VideoUploadResponse & { url: string, uploadedAt: string }): string => {
        if ('fileId' in file) {
            return file.fileId;
        }
        if ('imageId' in file) {
            return file.imageId;
        }
        if ('videoId' in file) {
            return file.videoId;
        }
        return '';
    };

    return (
        <div className="bg-base-neutral-800 p-4 rounded-md">
            <div className="flex items-center gap-2 flex-1 text-text-primary py-2 border-b border-divider">
                <span className="min-w-0"><IconCloudUpload /></span>
                <p className="text-md font-important leading-[24px] word-break">Uploaded files</p>
            </div>
            <main>
                {studentUploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-4 justify-between border-b border-divider py-4 text-text-primary w-full">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <IconFile classNames="flex-shrink-0" />
                            <span
                                className="text-text-primary truncate"
                                title={getFileName(file)}
                            >
                                {getFileName(file)}
                            </span>
                        </div>
                        <span className="flex-shrink-0 text-text-secondary text-sm">
                            {file.uploadedAt}
                        </span>
                        <Button
                            variant="text"
                            text="Download"
                            onClick={() => onDownload?.(getFileId(file))}
                            className="flex-shrink-0"
                        />
                    </div>
                ))}
            </main>
            <div className="flex flex-col gap-2 mt-4">
                <p className="leading-[150%] font-important text-text-primary">Student Comment</p>
                <p className="text-text-secondary leading-[150%] text-xl">{studentComment}</p>
            </div>
        </div>
    );
}

export default UploadCoachView;