import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner'
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export type ImageUploadResponse = {
  image_id: string;
  image_thumbnail_url: string;
};

export type ImageUploadedType = {
  file: File;
  isUploading: boolean;
  error?: boolean;
  imageData?: ImageUploadResponse;
};

/**
 * Common props shared between single and multiple image uploaders
 */
interface CommonImageUploaderProps extends isLocalAware{
  files: ImageUploadedType[];
  maxSize?: number;
  onDelete: (index: number) => void;
  onDownload: (file: File) => void;
  className?: string;
  onImageUpload: (fileObject: File) => Promise<ImageUploadResponse>;
};

/**
 * Props specific to single image uploader
 */
type SingleImageUploaderProps = CommonImageUploaderProps & {
  type: 'single';
};

/**
 * Props specific to multiple image uploader
 */
type MultipleImageUploaderProps = CommonImageUploaderProps & {
  type: 'multiple';
  filesCount: number;
};

/**
 * Union type for image uploader props
 */
export type ImageUploaderProps = SingleImageUploaderProps | MultipleImageUploaderProps;

/**
 * A reusable component for managing image uploads with support for drag-and-drop, image previews, progress indicators, and deletion.
 *
 * @param files An array of uploaded images. Each file includes:
 *  - `file`: The actual `File` object being uploaded.
 *  - `isUploading`: A boolean indicating whether the file is currently being uploaded.
 *  - `error`: A boolean indicating if there was an error uploading the file.
 *  - `imageData`: Optional object containing image_id and image_thumbnail_url from server.
 * @param type Determines upload behavior - "single" (default) or "multiple"
 * @param filesCount Maximum number of files allowed for multiple uploads
 * @param handleDelete Callback function triggered when an image is deleted. Receives the index of the image to delete.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param onImageUpload Optional callback for server-side upload. Returns a Promise with image_id and thumbnail URL.
 *
 * @example
 * <ImageUploader
 *   files={files}
 *   type="multiple"
 *   filesCount={5}
 *   onUpload={handleUpload}
 *   onDelete={onDelete}
 *   className="custom-class"
 *   onImageUpload={async (file) => {
 *     const response = await uploadToServer(file);
 *     return { 
 *       image_id: response.id, 
 *       image_thumbnail_url: response.url 
 *     };
 *   }}
 *   text={{
 *     title: "Drop your images here",
 *     buttontext: "Choose Images",
 *     dragtext: "or drag and drop images here",
 *     filesize: "Max size",
 *     uploading: "Uploading...",
 *     cancelUpload: "Cancel",
 *     filesCountReached: "Maximum file limit reached",
 *     uploadError: "Failed to upload. Try again."
 *   }}
 * />
 */

export function ImageUploader(props: ImageUploaderProps) {
  const {
    locale,
    files,
    type,
    onDelete,
    onDownload,
    className,
    onImageUpload,
    maxSize = 5
  } = props;
  
  const dictionary=getDictionary(locale);
  // Get filesCount based on type
  const filesCount = type === 'multiple' ? props.filesCount : 1;
  
 

  // Count valid files (exclude files with errors)
  const validFilesCount = files.filter(file => !file.error).length;
  
  // Determine if we should show the drag & drop component
  const showDragDrop = type === 'multiple' && validFilesCount < filesCount;
  
  // For single type, show drag & drop only if no valid files exist
  const showSingleDragDrop = type === 'single' && validFilesCount === 0;

  // Handle upload based on type and call the onImageUpload callback if provided
  const handleImageUpload = async (newFiles: File[]) => {
    const slotsRemaining = type === 'single' ? (validFilesCount === 0 ? 1 : 0) : (filesCount - validFilesCount);
    const filesToProcess = newFiles.slice(0, slotsRemaining);

    if (filesToProcess.length === 0) return;
    
    try {
      for (const file of filesToProcess) {
        await onImageUpload(file);
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <div>
      {/* Show files if any exist */}
      {files.length > 0 && (
        <div className={clsx('w-full', className)}>
          {files.map(({ file, isUploading, error, imageData }, index) => (
            <div
              key={index}
              className={clsx(
                "rounded flex w-full justify-between items-center mb-3",
                error && "border border-red-500 bg-red-50 bg-opacity-10 p-2 rounded"
              )}
            >
              <div className="flex gap-3">
                {file && (
                  <>
                    {isUploading ? (
                      <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                        <IconLoaderSpinner classNames="w-6 h-6 animate-spin text-text-primary" />
                      </div>
                    ) : imageData?.image_thumbnail_url &&(
                      // Use server-provided thumbnail if available
                      <img
                        data-testid="image-preview"
                        src={imageData.image_thumbnail_url}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )
                    
                    }
                  </>
                )}

                <div className="flex flex-col gap-1 justify-center">
                  <p
                    className="text-sm text-base-neutral-50 line-clamp-2 truncate max-w-[200px] tooltip cursor-pointer"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-text-secondary text-xs flex items-start">
                    {isUploading ? (
                      <Badge text={dictionary.components.uploadingSection.uploadingText} />
                    ) : (
                      <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    )}
                  </p>
                </div>
              </div>
              <div>
                {isUploading ? (
                  <Button
                    variant="text"
                    className="px-0"
                    onClick={() => onDelete(index)}
                    text={dictionary.components.uploadingSection.cancelUpload}
                  />
                ) : (
                  <div className="font-bold flex items-center cursor-pointer">
                    <IconButton
                      icon={<IconCloudDownload />}
                      size="small"
                      styles="text"
                      title={dictionary.components.uploadingSection.downloadText}
                      onClick={() => onDownload(file)}
                    />
                    <IconButton
                      icon={<IconTrashAlt />}
                      styles="text"
                      size="small"
                      title={dictionary.components.uploadingSection.deleteText}
                      onClick={() => onDelete(index)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show drag & drop for multiple type (if not at max valid files) or for single type (if no valid files) */}
      {(showDragDrop || showSingleDragDrop) ? (
        <DragAndDrop
          className="w-full"
          onUpload={handleImageUpload}
          acceptedFileTypes={['image/*']}
          text={{
            title:dictionary.components.uploadingSection.uploadImage.choseImages,
            description:dictionary.components.uploadingSection.uploadImage.description,
            maxSizeText: dictionary.components.uploadingSection.maxSizeText,
          }}
          maxSize={maxSize*1024*1024 } // Convert MB to bytes
        />
      ) : (
        type === 'multiple' && validFilesCount >= filesCount && (
          <p className="text-text-secondary text-sm mt-2">
            {dictionary.components.uploadingSection.maxFilesText}
          </p>
        )
      )}
    </div>
  );
}