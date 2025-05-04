import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconFile } from '../icons/icon-file';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

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

/**
 * Common props shared between single and multiple file uploaders
 */
interface  CommonFileUploaderProps extends isLocalAware {
  files: FileUploaderType[];
  maxSize: number;
  onDelete: (index: number) => void;
  onDownload: (file: File) => void;
  className?: string;
  onFileUpload: (fileObject: File) => Promise<UploadResponse>;
};

/**
 * Props specific to single file uploader
 */
type SingleFileUploaderProps = CommonFileUploaderProps & {
  type: 'single';
};

/**
 * Props specific to multiple file uploader
 */
type MultipleFileUploaderProps = CommonFileUploaderProps & {
  type: 'multiple';
  filesCount: number;
};

/**
 * Union type for file uploader props
 */
export type FileUploaderProps = SingleFileUploaderProps | MultipleFileUploaderProps;

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
 * @param filesCount Maximum number of files allowed for multiple uploads (default: 5)
 * @param maxSize Maximum file size allowed in MB (default: 5)
 *  @param onDelete Callback function triggered when a file is deleted. Receives the index of the file to delete.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param onFileUpload Optional callback for server-side upload. Returns a Promise with file_id and file_name. If not provided, only the onUpload callback will be used.
 *
 * @example
 * <FileUploader
 *   files={documentFiles}
 *   type="multiple"
 *   filesCount={10}
 *   maxSize={10}
 *   onUpload={handleFileUpload}
 *   onDelete={handleFileDelete}
 *   className="custom-class"
 *   onFileUpload={async (file) => {
 *     const response = await uploadFileToServer(file);
 *     return { 
 *       file_id: response.id, 
 *       file_name: response.name 
 *     };
 *   }}
 *  
 * />
 */
export function FileUploader(props: FileUploaderProps) {
  const {
    locale,
    files,
    type,
    onDelete,
    onDownload,
    className,
    onFileUpload,
    maxSize
  } = props;
  const dictionary = getDictionary(locale);
  const filesCount = type === 'multiple' ? props.filesCount : 1;
  const validFilesCount = files.filter((f) => !f.error).length;
  const showDrop = (type === 'multiple' && validFilesCount < filesCount) || (type === 'single' && validFilesCount === 0);



  const handleFileUpload =async (newFiles: File[]) => {
    const slotsRemaining = type === 'single' ? (validFilesCount === 0 ? 1 : 0) : (filesCount - validFilesCount);
    const filesToProcess = newFiles.slice(0, slotsRemaining);

    if (filesToProcess.length === 0) return;

    try {
      for (const file of filesToProcess) {
        const updatedFileData = await onFileUpload(file);
        console.log('Video uploaded successfully:', updatedFileData);
      }
    } catch (error) {
      return error
    }
  };

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
                    <Badge className='flex-inline' text={dictionary.components.uploadingSection.uploadingText}  />
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
                  onClick={() => onDelete(index)}
                  text={dictionary.components.uploadingSection.cancelUpload}
                />
              ) : (
                <div className="flex gap-2">
                  <IconButton
                    icon={<IconCloudDownload />}
                    size="small"
                    title={dictionary.components.uploadingSection.downloadText}
                    styles="text"
                    onClick={() => onDownload(file)}
                  />
                  <IconButton
                    icon={<IconTrashAlt />}
                    size="small"
                    title={dictionary.components.uploadingSection.deleteText}
                    styles="text"
                    onClick={() => onDelete(index)}
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
          text={{
            title:dictionary.components.uploadingSection.uploadFile.choseFiles,
            description:dictionary.components.uploadingSection.uploadFile.description,
            maxSizeText: dictionary.components.uploadingSection.maxSizeText,
          }}
          maxSize={maxSize * 1024 * 1024}
        />
      )}

      {!showDrop && type === 'multiple' && validFilesCount >= filesCount && (
        <p className="text-xs text-warning mt-2">{dictionary.components.uploadingSection.maxFilesText}</p>
      )}
    </div>
  );
}
