import {
    CourseElementTemplate,
    CourseElementType,
    DesignerComponentProps,
    FormComponentProps,
} from '../course-builder/types';
import type { VideoElement } from './types';
import { getDictionary } from '@maany_shr/e-class-translations';
import { IconVideo } from '../icons/icon-video';
import DesignerLayout from '../designer-layout';
import { fileMetadata } from '@maany_shr/e-class-models';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { VideoPlayer } from '../video-player';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.VideoFile)
        return dictionary.components.lessons.typeValidationText;

    // Check if a video file is attached
    if (!elementInstance.file) {
        return dictionary.components.videoLesson.videoValidationText;
    }

    // Validate video file metadata
    const file = elementInstance.file;
    if (!file.id || !file.name || !file.url) {
        return dictionary.components.videoLesson.metadataValidationText;
    }

    // Validate that it's a video file
    if (file.category !== 'video') {
        return dictionary.components.videoLesson.categoryValidationText;
    }

    if (file.status !== 'available') {
        return dictionary.components.videoLesson.statusValidationText;
    }

    // Validate URL format
    try {
        new URL(file.url);
    } catch {
        return dictionary.components.videoLesson.urlValidationText;
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
        label: 'Video',
    },
    designerComponent: DesignerComponent as React.FC<DesignerComponentProps>,
    formComponent: FormComponent,
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
        abortSignal?: AbortSignal,
    ) => Promise<TVideoFile | null>;

    onUploadComplete: (file: TVideoFile) => void;
    onFileDelete: () => void;
    /** Callback function to handle file download */
    onFileDownload: () => void;
    /** Current upload progress percentage (0-100) */
    uploadProgress?: number;
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
    validationError,
    uploadProgress,
}: VideoFileEditProps) {
    if (elementInstance.type !== CourseElementType.VideoFile) return null;
    const dictionary = getDictionary(locale);

    const handleVideoFile = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<TVideoFile | null> => {
        return await onVideoUpload(fileRequest, abortSignal);
    };

    const handleUploadComplete = (
        videoMetadata: fileMetadata.TFileMetadata,
    ) => {
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
                onFilesChange={handleVideoFile as any}
                onUploadComplete={handleUploadComplete}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
                maxSize={maxSize}
                isDeletionAllowed={true}
                uploadProgress={uploadProgress}
            />
            <p className="text-xs text-text-secondary mt-2">
                {dictionary.components.uploadingSection.uploadVideo.processingHelperText}
            </p>
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
    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    // Type guard to ensure we're working with a VideoFile
    const videoFile = elementInstance as VideoElement;

    return (
        <section className="w-full flex justify-start p-4 rounded-lg">
            <div className="w-full max-w-[1000px]">
                <VideoPlayer
                    videoId={videoFile.file?.videoId ?? undefined}
                    thumbnailUrl={videoFile.file?.thumbnailUrl || undefined}
                    locale={locale}
                    className="aspect-video w-full"
                />
            </div>
        </section>
    );
}

export default videoFileElement;
