import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconFile } from '../icons/icon-file';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { useCallback } from 'react';

/**
 * Response type for file upload operations
 */
export type UploadResponse = {
  file_id: string;
  file_name: string;
};

/**
 * Represents a file being uploaded with its associated state
 */
export type FileUploaderType = {
  file: File;
  isUploading: boolean;
  error?: boolean;
  serverData?: UploadResponse;
};

export type EnhancedUploadFileProps = {
  files: FileUploaderType[];
  type?: 'single' | 'multiple';
  maxFiles?: number;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  handleDelete: (index: number) => void;
  className?: string;
  onFileUpload?: (fileObject: File) => Promise<UploadResponse>;
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

/**
 * A reusable component for managing file uploads with support for drag-and-drop, 
 * file previews, progress indicators, and deletion.
 *
 * @param files An array of uploaded files. Each file includes:
 *  - `file`: The actual `File` object being uploaded.
 *  - `isUploading`: A boolean indicating whether the file is currently being uploaded.
 *  - `error`: A boolean indicating if there was an error uploading the file.
 *  - `serverData`: Optional object containing file_id and file_name from server.
 * @param type Determines upload behavior - "single" (default) or "multiple"
 * @param maxFiles Maximum number of files allowed for multiple uploads (default: 5)
 * @param maxSize Maximum file size allowed in MB (default: 5)
 * @param onUpload Callback function triggered when new files are uploaded. Receives an array of `File` objects.
 * @param handleDelete Callback function triggered when a file is deleted. Receives the index of the file to delete.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param onFileUpload Optional callback for server-side upload. Returns a Promise with file_id and file_name.
 * @param text Object containing customizable text for various parts of the component:
 *  - `title`: Text displayed when dragging files over the drop area.
 *  - `buttontext`: Text for the button in the drag-and-drop area.
 *  - `dragtext`: Instructional text displayed in the drag-and-drop area when no files are uploaded.
 *  - `filesize`: Label for displaying the maximum file size allowed.
 *  - `uploading`: Text displayed while a file is being uploaded.
 *  - `cancelUpload`: Text for the button to cancel an ongoing upload.
 *  - `maxFilesReached`: Text displayed when maximum file limit is reached.
 *  - `uploadError`: Text displayed when there's an error uploading a file.
 *
 * @example
 * <FileUploader
 *   files={documentFiles}
 *   type="multiple"
 *   maxFiles={10}
 *   maxSize={10}
 *   onUpload={handleFileUpload}
 *   handleDelete={handleFileDelete}
 *   className="custom-class"
 *   onFileUpload={async (file) => {
 *     const response = await uploadFileToServer(file);
 *     return { 
 *       file_id: response.id, 
 *       file_name: response.name 
 *     };
 *   }}
 *   text={{
 *     title: "Drop your documents here",
 *     buttontext: "Choose Files",
 *     dragtext: "or drag and drop PDF files here",
 *     filesize: "Max size",
 *     uploading: "Uploading...",
 *     cancelUpload: "Cancel",
 *     maxFilesReached: "Maximum of 10 files reached",
 *     uploadError: "Failed to upload. Try again."
 *   }}
 * />
 */
export function FileUploader({
  files,
  type = 'single',
  maxFiles = 5,
  onUpload,
  handleDelete,
  className,
  onFileUpload,
  text,
  maxSize = 5
}: EnhancedUploadFileProps) {
  const validFilesCount = files.filter((f) => !f.error).length;
  const showDrop = (type === 'multiple' && validFilesCount < maxFiles) || (type === 'single' && validFilesCount === 0);

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

  const handleFileUpload = useCallback(async (incomingFiles: File[]) => {
    const slotsRemaining = type === 'single' ? (validFilesCount === 0 ? 1 : 0) : maxFiles - validFilesCount;
    const filesToUpload = incomingFiles.slice(0, slotsRemaining);
    onUpload(filesToUpload);

    // Optional server-side upload
    if (onFileUpload) {
      for (const file of filesToUpload) {
        try {
          await onFileUpload(file);
        } catch {
          // Handle upload error per file (not implemented here for brevity)
        }
      }
    }
  }, [validFilesCount, maxFiles, onFileUpload, onUpload, type]);

  return (
    <div>
      <div className={clsx('w-full', className)}>
        {files.map(({ file, isUploading, error }, index) => (
          <div key={index} className="rounded flex w-full justify-between items-center py-2">
            <div className="flex gap-3 items-center">
              <div className="min-w-12 h-12 flex items-center justify-center rounded bg-base-neutral-800 border-base-neutral-700 border">
                {isUploading ? (
                  <IconLoaderSpinner classNames="w-6 h-6 fill-base-neutral-50 animate-spin" />
                ) : (
                  <IconFile classNames="fill-text-primary" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-base-neutral-50 truncate max-w-[200px]" title={file.name}>
                  {file.name}
                </p>
                <p className="text-text-secondary text-xs flex items-start">

                  {isUploading ? (
                    <Badge className='flex-inline' text={text.uploading} />
                  ) : (
                    `${(file.size / (1024 * 1024)).toFixed(2)} MB`
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
                <div className="flex gap-2">
                  <IconButton
                    icon={<IconCloudDownload />}
                    size="small"
                    styles="text"
                    onClick={() => handleDownload(file)}
                  />
                  <IconButton
                    icon={<IconTrashAlt />}
                    size="small"
                    styles="text"
                    onClick={() => handleDelete(index)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showDrop && (
        <DragAndDrop
          className="w-full mt-4"
          onUpload={handleFileUpload}
          acceptedFileTypes={['application/pdf']}
          text={text}
          maxSize={maxSize * 1024 * 1024}
        />
      )}

      {!showDrop && type === 'multiple' && validFilesCount >= maxFiles && (
        <p className="text-xs text-warning mt-2">{text.maxFilesReached}</p>
      )}
    </div>
  );
}
