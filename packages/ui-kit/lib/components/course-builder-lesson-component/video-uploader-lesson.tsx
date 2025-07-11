import { useState } from "react";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { VideoFilePreview } from "./types";
import { VideoPlayer } from "../video-player";
import { IconVideo } from "../icons/icon-video";
/**
 * @fileoverview Video file component for the course builder.
 * Provides functionality for uploading, displaying, and managing video content.
 */

/**
 * Template configuration for the video file element in the course builder.
 * Defines the component's type, button appearance, and associated components.
 */
const videoFileElement: CourseElementTemplate = {
    type: CourseElementType.VideoFile,
    designerBtnElement: {
        icon: IconVideo,
        label: "Video"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

/**
 * Props interface for the video file edit component.
 * Extends DesignerComponentProps with additional properties for file handling.
 */
interface VideoFileEditProps extends DesignerComponentProps  {
    /** Callback function triggered when files are changed */
    onChange: (files: UploadedFileType[]) => Promise<UploadResponse>;
    /** Callback function to handle file deletion */
    onFileDelete: () => void;
    /** Callback function to handle file download */
    onFileDownload: () => void;
    /** Currently selected file or null if no file is selected */
    file: UploadedFileType | null;
}

/**
 * Designer component for managing video file uploads.
 * Provides UI for uploading, viewing, and managing video files.
 * 
 * @param elementInstance - The current video element instance
 * @param locale - The current locale for translations
 * @param onUpClick - Callback for moving the element up
 * @param onDownClick - Callback for moving the element down
 * @param onDeleteClick - Callback for deleting the element
 * @param file - The current video file
 * @param onChange - Callback for file changes
 * @param onFileDelete - Callback for file deletion
 * @param onFileDownload - Callback for file download
 */
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, file, onChange, onFileDelete, onFileDownload}: VideoFileEditProps) {
    if (elementInstance.type !== CourseElementType.VideoFile) return null;
    const dictionary = getDictionary(locale);
    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.videoFileText}
            icon={<IconVideo classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="single"
                variant="video"
                file={file}
                onFilesChange={onChange}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
            />
        </DesignerLayout>
    );
}

/**
 * Form component for displaying video content.
 * Renders a video player with error handling capabilities.
 * 
 * @param elementInstance - The video element instance containing the video ID
 * @param locale - The current locale for translations
 * @returns A video player component or null if the element type doesn't match
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.VideoFile) return null;
    const [error, setError] = useState<string | null>(null);

    return (
        <section className="w-full">
            <VideoPlayer
                videoId={(elementInstance as VideoFilePreview).videoId}
                locale={locale}
                onErrorCallback={(error) => {
                    setError(error);
                }}
            />
        </section>
    );
}

export default videoFileElement;