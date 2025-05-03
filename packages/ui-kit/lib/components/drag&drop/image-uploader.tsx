import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { useCallback } from 'react';

export type ImageUploadResponse = {
  image_id: string;
  image_thumbnail_url: string;
};

export type ImageUploaderProps = {
  files: ImageUploadedType[];
  type?: "multiple" | "single";
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  handleDelete: (index: number) => void;
  className?: string;
  onImageUpload?: (fileObject: File) => Promise<ImageUploadResponse>;
  maxSize?: number;
  text: {
    title?: string;
    buttontext?: string;
    dragtext?: string;
    filesize?: string;
    uploading?: string;
    cancelUpload?: string;
    maxFilesReached?: string;
    uploadError?: string;
  };
};

export type ImageUploadedType = {
  file: File;
  isUploading: boolean;
  error?: boolean;
  imageData?: ImageUploadResponse;
};

/**
 * A reusable component for managing image uploads with support for drag-and-drop, image previews, progress indicators, and deletion.
 *
 * @param files An array of uploaded images. Each file includes:
 *  - `file`: The actual `File` object being uploaded.
 *  - `isUploading`: A boolean indicating whether the file is currently being uploaded.
 *  - `error`: A boolean indicating if there was an error uploading the file.
 *  - `imageData`: Optional object containing image_id and image_thumbnail_url from server.
 * @param type Determines upload behavior - "single" (default) or "multiple"
 * @param maxFiles Maximum number of files allowed for multiple uploads
 * @param onUpload Callback function triggered when new images are uploaded. Receives an array of `File` objects.
 * @param handleDelete Callback function triggered when an image is deleted. Receives the index of the image to delete.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param onImageUpload Optional callback for server-side upload. Returns a Promise with image_id and thumbnail URL.
 * @param text Object containing customizable text for various parts of the component:
 *  - `title`: Text displayed when dragging images over the drop area.
 *  - `buttontext`: Text for the button in the drag-and-drop area.
 *  - `dragtext`: Instructional text displayed in the drag-and-drop area when no images are uploaded.
 *  - `filesize`: Label for displaying the maximum file size allowed.
 *  - `uploading`: Text displayed while an image is being uploaded.
 *  - `cancelUpload`: Text for the button to cancel an ongoing upload.
 *  - `maxFilesReached`: Text displayed when maximum file limit is reached.
 *  - `uploadError`: Text displayed when there's an error uploading a file.
 *
 * @example
 * <UploadedImage
 *   files={files}
 *   type="multiple"
 *   maxFiles={5}
 *   onUpload={handleUpload}
 *   handleDelete={handleDelete}
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
 *     maxFilesReached: "Maximum file limit reached",
 *     uploadError: "Failed to upload. Try again."
 *   }}
 * />
 */

export function ImageUploader({
  files,
  type = 'single',
  maxFiles = 5,
  onUpload,
  handleDelete,
  className,
  onImageUpload,
  text,
  maxSize
}: ImageUploaderProps) {
  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Count valid files (exclude files with errors)
  const validFilesCount = files.filter(file => !file.error).length;
  
  // Determine if we should show the drag & drop component
  const showDragDrop = type === 'multiple' && validFilesCount < maxFiles;
  
  // For single type, show drag & drop only if no valid files exist
  const showSingleDragDrop = type === 'single' && validFilesCount === 0;

  // Handle upload based on type and call the onImageUpload callback if provided
  const handleFileUpload = async (newFiles: File[]) => {
    console.log(newFiles);
    
    // Calculate how many more files we can accept based on valid files
    const slotsRemaining = type === 'single' ? (validFilesCount === 0 ? 1 : 0) : (maxFiles - validFilesCount);
    
    // Limit the number of files based on type and remaining slots
    const filesToProcess = newFiles.slice(0, slotsRemaining);
    
    if (filesToProcess.length === 0) return; // No files to process
    
    // Call the onUpload callback provided by the parent
    onUpload(filesToProcess);
    
    // If onImageUpload is provided, call it for each file with error handling
    if (onImageUpload) {
      try {
        for (const file of filesToProcess) {
          const updatedFileData = await onImageUpload(file);
          console.log('File uploaded successfully:', updatedFileData);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // The error state should be managed in the parent component
        // since the files state is managed there
      }
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
                    ) : imageData?.image_thumbnail_url ?(
                      // Use server-provided thumbnail if available
                      <img
                        data-testid="image-preview"
                        src={imageData.image_thumbnail_url}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      // Otherwise use local object URL
                      <img
                        data-testid="image-preview"
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
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
                      <Badge text={text.uploading} />
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
                    onClick={() => handleDelete(index)}
                    text={text.cancelUpload}
                  />
                ) : (
                  <div className="font-bold flex items-center cursor-pointer">
                    <IconButton
                      icon={<IconCloudDownload />}
                      size="small"
                      styles="text"
                      onClick={() => handleDownload(file)}
                    />
                    <IconButton
                      icon={<IconTrashAlt />}
                      styles="text"
                      size="small"
                      onClick={() => handleDelete(index)}
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
          onUpload={handleFileUpload}
          acceptedFileTypes={['image/*']}
          text={text}
          maxSize={maxSize*1024*1024 } // Convert MB to bytes
        />
      ) : (
        type === 'multiple' && validFilesCount >= maxFiles && (
          <p className="text-text-secondary text-sm mt-2">
            {text.maxFilesReached || `Maximum of ${maxFiles} files reached`}
          </p>
        )
      )}
    </div>
  );
}