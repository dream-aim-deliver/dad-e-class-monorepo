import {
    CourseElementTemplate,
    CourseElementType,
    FormComponentProps,
    DesignerComponentProps as BaseDesignerComponentProps,
} from '../course-builder/types';
import { getDictionary } from '@maany_shr/e-class-translations';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import DesignerLayout from '../designer-layout';
import { fileMetadata } from '@maany_shr/e-class-models';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.DownloadFiles)
        return dictionary.components.lessons.typeValidationText;

    // Check if at least one file is attached
    if (!elementInstance.files || elementInstance.files.length === 0) {
        return dictionary.components.downloadFileLesson.fileCountValidationText;
    }

    // Validate each file has required metadata properties
    for (const file of elementInstance.files) {
        if (!file.id || !file.name || !file.url) {
            return dictionary.components.downloadFileLesson
                .metadataValidationText;
        }

        if (file.status !== 'available') {
            return dictionary.components.downloadFileLesson
                .statusValidationText;
        }

        // Validate URL format
        try {
            new URL(file.url);
        } catch {
            return dictionary.components.downloadFileLesson.urlValidationText;
        }
    }

    return undefined;
};

/** Props interface for the Download Files Designer component */
/**
 * Props interface for the Download Files Designer component
 * Extends the base designer component props with file handling capabilities
 */
export interface DownloadFilesDesignerProps extends BaseDesignerComponentProps {
    /** Callback function triggered when files are changed */
    onFilesUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata | null>;
    onUploadComplete?: (file: fileMetadata.TFileMetadata) => void;
    /** Callback function to handle file deletion */
    onFileDelete: (id: string) => void;
    /** Callback function to handle file download */
    onFileDownload: (id: string) => void;
    /** Maximum number of files allowed (default: 5) */
    maxFiles?: number;
    /** Maximum file size allowed in megabytes (default: 5MB) */
    maxSize?: number;
    /** Current upload progress percentage (0-100) */
    uploadProgress?: number;
}

/**
 * Designer Component for Download Files
 * Provides an interface for uploading and managing downloadable files in the course builder
 *
 * @param elementInstance - The current instance of the download files element
 * @param locale - The current locale for internationalization
 * @param onUpClick - Callback for moving the element up in order
 * @param onDownClick - Callback for moving the element down in order
 * @param onDeleteClick - Callback for deleting the element
 * @param onChange - Callback for handling file changes
 * @param onFileDelete - Callback for handling file deletion
 * @param onFileDownload - Callback for handling file downloads
 * @param files - Array of currently uploaded files
 */

export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onUploadComplete,
    onFilesUpload,
    onFileDelete,
    onFileDownload,
    validationError,
    maxFiles = 5,
    maxSize = 15, // Default to 15MB
    uploadProgress,
}: DownloadFilesDesignerProps) {
    if (elementInstance.type !== CourseElementType.DownloadFiles) return null;
    const dictionary = getDictionary(locale);
    const handleDownloadFile = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata | null> => {
        return await onFilesUpload(fileRequest, abortSignal);
    };

    const handleUploadComplete = (fileMetadata: fileMetadata.TFileMetadata) => {
        onUploadComplete?.(fileMetadata);
    };

    const handleFileDelete = (id: string) => {
        onFileDelete(id);
    };
    const handleFileDownload = (id: string) => {
        onFileDownload(id);
    };
    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.downloadFilesText}
            icon={<IconCloudDownload classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
            validationError={validationError}
        >
            <Uploader
                type="multiple"
                variant="generic"
                files={elementInstance.files}
                maxFile={maxFiles}
                onFilesChange={handleDownloadFile as any}
                onUploadComplete={handleUploadComplete}
                onDelete={handleFileDelete}
                onDownload={handleFileDownload}
                locale={locale}
                maxSize={maxSize}
                uploadProgress={uploadProgress}
            />
        </DesignerLayout>
    );
}

/**
 * Form Component for Download Files
 * Renders the preview of uploaded files with their metadata and action buttons
 * Supports different file types including images and videos with appropriate icons
 *
 * @param elementInstance - The current instance of the download files element containing file data
 * @returns JSX element displaying the files or null if invalid type
 */
export interface DownloadFilesFormProps extends FormComponentProps {
    onDownload: (id: string) => void;
}
export function FormComponent({
    elementInstance,
    locale,
    onDownload,
}: DownloadFilesFormProps) {
    if (elementInstance.type !== CourseElementType.DownloadFiles) return null;

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

    const handleDownload = (id: string) => {
        onDownload(id);
    };
    return (
        <div className="flex flex-col bg-card-fill p-4 rounded-md border-card-stroke gap-4">
            {elementInstance.files &&
                elementInstance.files.length > 0 &&
                elementInstance.files.map((file) => (
                    <FilePreview
                        key={file.id}
                        locale={locale}
                        readOnly={true}
                        onDownload={() => handleDownload(file.id as string)}
                        uploadResponse={file}
                        deletion={{
                            isAllowed: false,
                        }}
                    />
                ))}
        </div>
    );
}

/**
 * Template configuration for the Download Files course element
 * Defines the type, design elements, and component mappings for the downloadable files feature
 * This element allows course creators to add downloadable resources to their courses
 */
const downloadFilesElement: CourseElementTemplate = {
    type: CourseElementType.DownloadFiles,
    designerBtnElement: {
        icon: IconCloudDownload,
        label: 'Download Files',
    },
    designerComponent:
        DesignerComponent as React.FC<BaseDesignerComponentProps>,
    formComponent: FormComponent,
};

export default downloadFilesElement;
