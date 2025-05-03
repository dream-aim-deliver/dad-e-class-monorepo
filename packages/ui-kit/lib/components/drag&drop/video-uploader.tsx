import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { IconVideo } from '../icons/icon-video';

/**
 * Response type for video upload operations
 */
export type VideoUploadResponse = {
  video_id: string;
  thumbnail_url?: string;
};

/**
 * Represents a file being uploaded with its associated state
 */
export type VideoType = {
  file: File;
  isUploading: boolean;
  error?: boolean;
  videoData?: VideoUploadResponse;
};

export type UploadedVideoProps = {
  files: VideoType[];
  type?: "multiple" | "single";
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  handleDelete: (index: number) => void;
  className?: string;
  onVideoUpload?: (fileObject: File) => Promise<VideoUploadResponse>;
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

/**
 * A reusable component for managing video uploads with support for drag-and-drop, 
 * video previews, progress indicators, and deletion.
 *
 * @param files An array of uploaded videos. Each file includes:
 *  - `file`: The actual `File` object being uploaded.
 *  - `isUploading`: A boolean indicating whether the file is currently being uploaded.
 *  - `error`: A boolean indicating if there was an error uploading the file.
 *  - `videoData`: Optional object containing video_id and thumbnail_url from server.
 * @param type Determines upload behavior - "single" (default) or "multiple"
 * @param maxFiles Maximum number of files allowed for multiple uploads (default: 5)
 * @param onUpload Callback function triggered when new videos are uploaded. Receives an array of `File` objects.
 * @param handleDelete Callback function triggered when a video is deleted. Receives the index of the video to delete.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param onVideoUpload Optional callback for server-side upload. Returns a Promise with video_id and thumbnail URL.
 * @param maxSize Maximum file size allowed in MB
 * @param text Object containing customizable text for various parts of the component:
 *  - `title`: Text displayed when dragging videos over the drop area.
 *  - `buttontext`: Text for the button in the drag-and-drop area.
 *  - `dragtext`: Instructional text displayed in the drag-and-drop area when no videos are uploaded.
 *  - `filesize`: Label for displaying the maximum file size allowed.
 *  - `uploading`: Text displayed while a video is being uploaded.
 *  - `cancelUpload`: Text for the button to cancel an ongoing upload.
 *  - `maxFilesReached`: Text displayed when maximum file limit is reached.
 *  - `uploadError`: Text displayed when there's an error uploading a file.
 *
 * @example
 * <UploadedVideo
 *   files={videoFiles}
 *   type="multiple"
 *   maxFiles={3}
 *   onUpload={handleVideoUpload}
 *   handleDelete={handleVideoDelete}
 *   className="custom-class"
 *   onVideoUpload={async (file) => {
 *     const response = await uploadVideoToServer(file);
 *     return { 
 *       video_id: response.id, 
 *       thumbnail_url: response.thumbnail 
 *     };
 *   }}
 *   maxSize={100}
 *   text={{
 *     title: "Drop your videos here",
 *     buttontext: "Choose Videos",
 *     dragtext: "or drag and drop videos here",
 *     filesize: "Max size",
 *     uploading: "Uploading...",
 *     cancelUpload: "Cancel",
 *     maxFilesReached: "Maximum of 3 videos reached",
 *     uploadError: "Failed to upload. Try again."
 *   }}
 * />
 */
export function VideoUploader({
  files,
  type = 'single',
  maxFiles = 5,
  onUpload,
  handleDelete,
  className,
  onVideoUpload,
  text,
  maxSize
}: UploadedVideoProps) {
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

  const validFilesCount = files.filter(file => !file.error).length;
  const showDragDrop = type === 'multiple' && validFilesCount < maxFiles;
  const showSingleDragDrop = type === 'single' && validFilesCount === 0;

  const handleFileUpload = async (newFiles: File[]) => {
    const slotsRemaining = type === 'single' ? (validFilesCount === 0 ? 1 : 0) : (maxFiles - validFilesCount);
    const filesToProcess = newFiles.slice(0, slotsRemaining);

    if (filesToProcess.length === 0) return;
    onUpload(filesToProcess);

    if (onVideoUpload) {
      try {
        for (const file of filesToProcess) {
          const updatedFileData = await onVideoUpload(file);
          console.log('Video uploaded successfully:', updatedFileData);
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  return (
    <div>
      {files.length > 0 && (
        <div className={clsx('w-full', className)}>
          {files.map(({ file, isUploading, error, videoData }, index) => (
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
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                        <IconVideo classNames='text-text-primary w-6 h-6' />
                      </div>
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

      {(showDragDrop || showSingleDragDrop) ? (
        <DragAndDrop
          className="w-full"
          onUpload={handleFileUpload}
          acceptedFileTypes={['video/*']}
          text={text}
          maxSize={maxSize * 1024 * 1024}
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
