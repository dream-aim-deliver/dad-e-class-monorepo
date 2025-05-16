import { CourseElementTemplate, CourseElementType, FormComponentProps, DesignerComponentProps as BaseDesignerComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconCloudDownload } from "../icons/icon-cloud-download";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { IconFile } from "../icons/icon-file";
import { IconVideo } from "../icons/icon-video";
import { IconEdit } from "../icons/icon-edit";
import { IconTrashAlt } from "../icons/icon-trash-alt";
import { IconButton } from "../icon-button";

/** 
 * Template configuration for the Download Files course element
 * Defines the type, design elements, and component mappings
 */
/**
 * Template configuration for the Download Files course element
 * Defines the type, design elements, and component mappings for the downloadable files feature
 * This element allows course creators to add downloadable resources to their courses
 */
const downloadFilesElement: CourseElementTemplate = {
    type: CourseElementType.DownloadFiles,
    designerBtnElement: {
        icon: IconCloudDownload,
        label: "Download Files"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

/** Props interface for the Download Files Designer component */
/** 
 * Props interface for the Download Files Designer component
 * Extends the base designer component props with file handling capabilities
 */
interface DownloadFilesDesignerProps extends BaseDesignerComponentProps {
    /** Callback function triggered when files are changed */
    onChange: (files: UploadedFileType[]) => Promise<UploadResponse>;
    /** Callback function to handle file deletion */
    onFileDelete: (fileId: number) => void;
    /** Callback function to handle file download */
    onFileDownload: (fileId: number) => void;
    /** Currently selected files or null if no files are selected */
    files: UploadedFileType[] | null;
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

function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, onChange, onFileDelete, onFileDownload, files }: DownloadFilesDesignerProps) {
    if (elementInstance.type !== CourseElementType.DownloadFiles) return null;
    const dictionary = getDictionary(locale);

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.downloadFilesText}
            icon={<IconCloudDownload classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="multiple"
                variant="file"
                files={files}
                maxFile={5}
                onFilesChange={onChange}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
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

export function FormComponent({ elementInstance }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.DownloadFiles) return null;
    if ('fileUrls' in elementInstance) {
        return (
            <div className="text-text-primary flex flex-col gap-2">
                {elementInstance.fileUrls.map((file, index) => {
                    // Determine the file type based on response data properties
                    const isImage = 'imageId' in file && 'imageThumbnailUrl' in file;
                    const isVideo = 'videoId' in file && 'thumbnailUrl' in file;

                    // Get display name based on file type
                    const getDisplayName = () => {
                        if (isImage) return 'Image';
                        if (isVideo) return 'Video';
                        return 'fileId' in file && 'fileName' in file ? file.fileName : 'File';
                    };

                    return (
                        <div key={index} className="flex items-center justify-between gap-2 p-2 rounded-medium bg-base-neutral-900">
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                                    {isImage ? (
                                        <img
                                            src={file.imageThumbnailUrl}
                                            alt="Image preview"
                                            className="w-10 h-10 object-cover rounded-small"
                                        />
                                    ) : isVideo ? (
                                        <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700 relative">

                                            <IconVideo classNames="w-6 h-6 text-text-primary" />
                                        </div>
                                    ) : (
                                        <IconFile classNames="w-6 h-6 text-text-primary" />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 w-full gap-1 truncate">
                                <span
                                    title={getDisplayName()}
                                    className="text-sm font-medium text-text-primary truncate"
                                >
                                    {getDisplayName()}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    {((file.fileSize || 0) / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconButton
                                    icon={<IconEdit />}
                                    size="small"
                                    styles="text"
                                    title="Edit file"
                                />
                                <IconButton
                                    icon={<IconTrashAlt />}
                                    size="small"
                                    styles="text"
                                    title="Delete file"

                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
}

export default downloadFilesElement;