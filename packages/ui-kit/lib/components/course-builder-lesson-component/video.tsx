import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import type { VideoElement } from "./types";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconVideo } from "../icons/icon-video";
import DesignerLayout from "../designer-layout";
import { fileMetadata } from "@maany_shr/e-class-models";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { VideoPlayer } from "../video-player";


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
    designerComponent: DesignerComponent as React.FC<DesignerComponentProps>,
    formComponent: FormComponent
};

type TVideoFile = fileMetadata.TFileMetadata & { category: 'video' };

/**
 * Props interface for the video file edit component.
 * Extends DesignerComponentProps with additional properties for file handling.
 */
interface VideoFileEditProps extends DesignerComponentProps {
    /** Maximum file size allowed for upload in MB */
    maxSize: number;
    /** Callback function triggered when files are changed. Returns a Promise with upload response */
    onVideoUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ) => Promise<TVideoFile | null>;

    onUploadComplete: (file: TVideoFile) => void;
    onFileDelete: () => void;
    /** Callback function to handle file download */
    onFileDownload: () => void;
    /** Currently selected file or null if no file is selected */
    file: TVideoFile | null;
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
 * @param onVideoUpload - Callback for file uploads
 * @param onUploadComplete - Callback when upload is complete
 * @param onFileDelete - Callback for file deletion
 * @param onFileDownload - Callback for file download
 * @param maxSize - Maximum file size allowed for upload, in MB
 */
export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    file,
    onVideoUpload,
    onUploadComplete,
    onFileDelete,
    onFileDownload,
    maxSize
}: VideoFileEditProps) {
    if (elementInstance.type !== CourseElementType.VideoFile) return null;
    const dictionary = getDictionary(locale);

    const handleVideoFile = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ): Promise<TVideoFile | null> => {
        return await onVideoUpload(fileRequest, abortSignal);
    };

    const handleUploadComplete = (videoMetadata: fileMetadata.TFileMetadata) => {
        onUploadComplete?.(videoMetadata as TVideoFile);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.videoFileText}
            icon={<IconVideo classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="single"
                variant="video"
                file={file}
                onFilesChange={handleVideoFile as any}
                onUploadComplete={handleUploadComplete}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
                maxSize={maxSize}
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

    // Type guard to ensure we're working with a VideoFile
    const videoFile = elementInstance as VideoElement;

    return (
        <section className="w-full">
            <VideoPlayer
                videoId={videoFile.file?.videoId ?? undefined}
                thumbnailUrl={videoFile.file?.thumbnailUrl ?? undefined}
                locale={locale}
                className="aspect-video w-full"
            />
        </section>
    );
}

export default videoFileElement;