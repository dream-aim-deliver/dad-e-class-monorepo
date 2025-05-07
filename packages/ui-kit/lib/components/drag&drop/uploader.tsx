import React from 'react';
import { DragAndDrop } from './drag&drop';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { cn } from '../../utils/style-utils';
import { FilePreview } from './file-preview';

/**
 * Supported file types for the universal uploader
 */
export type FileVariant = 'file' | 'image' | 'video';

/**
 * Type-specific response types
 */
export type FileUploadResponse = {
  fileId: string;
  fileName: string;
};

export type ImageUploadResponse = {
  imageId: string;
  imageThumbnailUrl: string;
};

export type VideoUploadResponse = {
  videoId: string;
  thumbnailUrl?: string;
};

/**
 * Union type for all possible upload responses
 */
export type UploadResponse = FileUploadResponse | ImageUploadResponse | VideoUploadResponse;

/**
 * Represents a file being uploaded with its associated state
 */
export type UploadedFileType = {
  file: File;
  isUploading: boolean;
  error?: string;
  responseData?: UploadResponse;
};

/**
 * Common props shared between single and multiple uploaders
 * @param maxSize Maximum file size in MB
 * @param onDelete Callback for deleting a file
 * @param onDownload Callback for downloading a file
 * @param className Additional CSS classes
 * @param acceptedFileTypes Array of accepted file types
 * @param variant File variant (file, image, video)
 * @param onFilesChange Callback for handling file changes
 * @param locale Locale for translations
 * @param isLocalAware Indicates if the component is aware of localization
 *  @param maxFile Maximum number of files for multiple uploader
 * @param files Array of uploaded files
 * @param file Single uploaded file
 * @example
 * ```tsx?
 *<Uploader
 *  maxSize={5}
 * onDelete={handleDelete}
 *  onDownload={handleDownload}
 *  className="custom-class"
 *  acceptedFileTypes={['image/*']}
 * variant="image"
 * onFilesChange={handleFilesChange}
 * locale="en"
 * type="multiple"
 * maxFile={3}
 * files={uploadedFiles}
  />
  `
 * 
*/

interface CommonUploaderProps extends isLocalAware {
  maxSize?: number;
  onDelete: (fileId: number) => void;
  onDownload: (fileId: number) => void;
  className?: string;
  acceptedFileTypes?: string[];
  variant: FileVariant;
  onFilesChange: (files: UploadedFileType[]) => Promise<UploadResponse>; // The main callback for handling file changes
}

/**
 * Props for single file uploader
 */
type SingleUploaderProps = CommonUploaderProps & {
  type: 'single';
  file: UploadedFileType;
};

/**
 * Props for multiple file uploader
 */
type MultipleUploaderProps = CommonUploaderProps & {
  type: 'multiple';
  maxFile: number;
  files: UploadedFileType[];
};

/**
 * Union type for all uploader props
 */
export type UploaderProps = SingleUploaderProps | MultipleUploaderProps;

/**
 * A universal file uploader component that can handle different file types (files, images, videos)
 * with support for single or multiple file uploads.
 */
export const Uploader: React.FC<UploaderProps> = (props) => {
  const { maxSize = 5, onDelete, onDownload, className, variant, locale, onFilesChange } = props;
  const files = props.type === 'single' ? (props.file ? [props.file] : []) : props.files;
  const dictionary = getDictionary(locale);

  // Determine accepted file types based on variant
  const getAcceptedFileTypes = (): string[] => {
    switch (variant) {
      case 'image':
        return props.acceptedFileTypes || ['image/*'];
      case 'video':
        return props.acceptedFileTypes || ['video/*'];
      case 'file':
      default:
        return props.acceptedFileTypes || ['*/*'];
    }
  };

  // Get appropriate text based on variant
  const getUploaderText = () => {
    switch (variant) {
      case 'image':
        return {
          title: dictionary.components.uploadingSection.uploadImage.choseImages,
          description: dictionary.components.uploadingSection.uploadImage.description,
          maxSizeText: dictionary.components.uploadingSection.maxSizeText,
        };
      case 'video':
        return {
          title: dictionary.components.uploadingSection.uploadVideo.choseVideos,
          description: dictionary.components.uploadingSection.uploadVideo.description,
          maxSizeText: dictionary.components.uploadingSection.maxSizeText,
        };
      case 'file':
      default:
        return {
          title: dictionary.components.uploadingSection.uploadFile.choseFiles,
          description: dictionary.components.uploadingSection.uploadFile.description,
          maxSizeText: dictionary.components.uploadingSection.maxSizeText,
        };
    }
  };

  // Handle file upload
  const handleUpload = async (uploadedFiles: File[]) => {
    if (uploadedFiles.length === 0) return;

    if (props.type === 'single') {
      const file = uploadedFiles[0];
      try {
        // Create new file with uploading state
        const newFile: UploadedFileType = {
          file,
          isUploading: true,
        };

        // Only call onFilesChange once with the loading state
        await onFilesChange([newFile]);

        // Let the parent component handle the rest of the upload process
        return;
      } catch (err) {
        return err;
      }
    } else {
      try {
        const successfulFiles = files.filter(file => !file.error && !file.isUploading);
        const remainingSlots = props.maxFile - successfulFiles.length;
        const filesToAdd = uploadedFiles.slice(0, remainingSlots);

        if (filesToAdd.length === 0) return;

        // Create new files with uploading state
        const newUploadingFiles = filesToAdd.map(file => ({
          file,
          isUploading: true,
        }));

        // Single call to onFilesChange with loading state
        const updatedFiles = [...successfulFiles, ...newUploadingFiles];
        await onFilesChange(updatedFiles);

        return;
      } catch (err) {
        return err;
      }
    }
  };

  const handleCancelUpload = async (index: number) => {
    // For single uploader
    if (props.type === 'single') {
      await onFilesChange([]);
      return;
    }

    // For multiple uploader
    const updatedFiles = files.filter((_, i) => i !== index);
    await onFilesChange(updatedFiles);
  };

  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      {files?.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {files.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              index={index}
              onDelete={onDelete}
              onDownload={onDownload}
              locale={locale}
              onCancelUpload={handleCancelUpload}
            />
          ))}
        </div>
      )}

      {((props.type === 'single' && (!props.file || files.length === 0)) ||
        (props.type === 'multiple' && files.length < props.maxFile)) && (
          <DragAndDrop
            onUpload={handleUpload}
            maxSize={maxSize * 1024 * 1024}
            acceptedFileTypes={getAcceptedFileTypes()}
            multiple={props.type === 'multiple'}
            text={getUploaderText()}
            className='w-full'
          />
        )}
    </div>
  );
};
