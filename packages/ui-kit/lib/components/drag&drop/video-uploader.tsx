import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { IconVideo } from '../icons/icon-video';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

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

/**
 * Common props shared between single and multiple video uploaders
 */
interface CommonVideoUploaderProps extends isLocalAware {
  files: VideoType[];
  maxSize?: number;
  onDelete: (index: number) => void;
  onDownload: (file: File) => void;
  className?: string;
  onVideoUpload: (fileObject: File) => Promise<VideoUploadResponse>;
};

/**
 * Props specific to single video uploader
 */
type SingleVideoUploaderProps = CommonVideoUploaderProps & {
  type: 'single';
};

/**
 * Props specific to multiple video uploader
 */
type MultipleVideoUploaderProps = CommonVideoUploaderProps & {
  type: 'multiple';
  filesCount: number;
};

/**
 * Union type for video uploader props
 */
export type VideoUploaderProps = SingleVideoUploaderProps | MultipleVideoUploaderProps;

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
 * @param filesCount Maximum number of files allowed for multiple uploads (default: 5)
 * @param onDelete Callback function triggered when a video is deleted. Receives the index of the video to delete.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param onVideoUpload Callback for server-side upload. Returns a Promise with video_id and thumbnail URL.
 * @param maxSize Maximum file size allowed in MB
 *
 * @example
 * <VideoUploader
 *   files={videoFiles}
 *   type="multiple"
 *   filesCount={3}
 *   onDelete={handleVideoDelete}
 *   className="custom-class"
 *   onVideoUpload={async (file) => {
 *     const response = await uploadVideoToServer(file);
 *     return { 
 *       video_id: response.id, 
 *       thumbnail_url: response.thumbnail 
 *     };
 *   }}
 *   maxSize={100}
 * 
 * />
 */
export function VideoUploader(props: VideoUploaderProps) {
  const {
    locale,
    files,
    type,
    onDelete,
    onDownload,
    className,
    onVideoUpload,
    maxSize
  } = props;
  

  const dictionary=getDictionary(locale);
  const filesCount = type === 'multiple' ? props.filesCount : 1;
  
  

  const validFilesCount = files.filter(file => !file.error).length;
  const showDragDrop = type === 'multiple' && validFilesCount < filesCount;
  const showSingleDragDrop = type === 'single' && validFilesCount === 0;

  const handleFileUpload = async (newFiles: File[]) => {
    const slotsRemaining = type === 'single' ? (validFilesCount === 0 ? 1 : 0) : (filesCount - validFilesCount);
    const filesToProcess = newFiles.slice(0, slotsRemaining);

    if (filesToProcess.length === 0) return;
    
    try {
      for (const file of filesToProcess) {
        const updatedFileData = await onVideoUpload(file);
      
      }
    } catch (error) {
      return error;
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

      {(showDragDrop || showSingleDragDrop) ? (
        <DragAndDrop
          className="w-full"
          onUpload={handleFileUpload}
          acceptedFileTypes={['video/*']}
          text={{
            title:dictionary.components.uploadingSection.uploadVideo.choseVideos,
            description:dictionary.components.uploadingSection.uploadVideo.description,
            maxSizeText: dictionary.components.uploadingSection.maxSizeText,
          }}
          maxSize={maxSize * 1024 * 1024}
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
