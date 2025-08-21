import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import type { VideoElement } from "./types";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconVideo } from "../icons/icon-video";
import DesignerLayout from "../designer-layout";
import { fileMetadata } from "@maany_shr/e-class-models";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { VideoPlayer } from "../video-player";
import { ElementValidator } from "../lesson/types";
import DefaultError from "../default-error";

// TODO: Translate validation errors
export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.VideoFile)
        return 'Wrong element type';

    // Check if a video file is attached
    if (!elementInstance.file) {
        return 'There should be a file attached';
    }

    // Validate video file metadata
    const file = elementInstance.file;
    if (!file.id || !file.name || !file.url) {
        return 'Invalid video metadata: missing required properties';
    }


    // Validate that it's a video file
    if (file.category !== 'video') {
        return 'File must be a video';
    }

    if (file.status !== 'available') {
        return 'Video file must be available';
    }

    // Validate URL format
    try {
        new URL(file.url);
    } catch {
        return 'Invalid video URL format';
    }

    return undefined;
};


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
    // @ts-ignore
    designerComponent: DesignerComponent,
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
    onVideoUpload,
    onUploadComplete,
    onFileDelete,
    onFileDownload,
    maxSize,
    validationError
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
            validationError={validationError}
        >
            <Uploader
                type="single"
                variant="video"
                file={elementInstance.file}
                onFilesChange={handleVideoFile}
                onUploadComplete={handleUploadComplete}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
                maxSize={maxSize}
                isDeletionAllowed={true}
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

    const dictionary = getDictionary(locale);
console.log(locale)
    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                locale={locale}
                title={'Element is invalid'}
                description={validationError}
            />
        );
    }

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