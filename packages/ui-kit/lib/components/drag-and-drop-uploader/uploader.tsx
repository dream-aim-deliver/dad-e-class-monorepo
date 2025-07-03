import React, { useRef } from 'react';
import { DragAndDrop } from './drag-and-drop';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';
import { cn } from '../../utils/style-utils';
import { FilePreview } from './file-preview';

/**
 * Represents a file being uploaded with its associated state
 */

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
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  className?: string;
  acceptedFileTypes?: string[];
  variant: fileMetadata.TFileCategoryEnum;
  onFilesChange: (
    files: fileMetadata.TFileUploadRequest[],
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata | null>;
}

/**
 * Props for single file uploader
 */
type SingleUploaderProps = CommonUploaderProps & {
  type: 'single';
  file: fileMetadata.TFileMetadata | null;
};

/**
 * Props for multiple file uploader
 */
type MultipleUploaderProps = CommonUploaderProps & {
  type: 'multiple';
  maxFile: number;
  files: fileMetadata.TFileMetadata[] | null;
};

/**
 * Union type for all uploader props
 */
export type UploaderProps = SingleUploaderProps | MultipleUploaderProps;

/**
 * A universal file uploader component that can handle different file types with support for single or multiple file uploads.
 * 
 * @param maxSize Maximum file size in MB. Defaults to 5MB.
 * @param onDelete Callback function triggered when a file is deleted. Receives the file ID as a parameter.
 * @param onDownload Callback function triggered when a file download is requested. Receives the file ID as a parameter.
 * @param className Additional CSS classes for styling the uploader container.
 * @param variant Determines the type of files the uploader will handle. This affects the default acceptedFileTypes and UI text:
 *   - 'generic': General file uploader for any file type
 *   - 'document': For document uploads
 *   - 'image': Specialized for image uploads, defaults to accepting 'image/*'
 *   - 'video': Specialized for video uploads, defaults to accepting 'video/*'
 * @param acceptedFileTypes Optional array of MIME types to override the default accepted types for the chosen variant.
 *   Examples:
 *   - For images: ['image/jpeg', 'image/png', 'image/gif']
 *   - For videos: ['video/mp4', 'video/quicktime']
 *   - For files: ['application/pdf', '.doc', '.docx']
 *   If not provided, defaults are set based on the variant.
 * @param onFilesChange Main callback for handling file changes. Receives array of UploadedFileType and should return Promise<TFileMetadata>.
 * @param locale Locale string for translations (e.g., 'en', 'es')
 * @param isLocalAware Indicates if the component should use localized strings
 * @param type Upload mode: 'single' for one file only, 'multiple' for multiple files
 * @param maxFile For multiple upload mode: maximum number of files allowed
 * @param files For multiple upload mode: array of currently uploaded files
 * @param file For single upload mode: the currently uploaded file
 * 
 * @example
 * ```tsx
 * // Single image uploader
 * <Uploader
 *   maxSize={5}
 *   onDelete={handleDelete}
 *   onDownload={handleDownload}
 *   variant="image"
 *   acceptedFileTypes={['image/jpeg', 'image/png']}
 *   onFilesChange={handleFilesChange}
 *   locale="en"
 *   type="single"
 *   file={currentFile}
 * />
 * 
 * // Multiple file uploader
 * <Uploader
 *   maxSize={10}
 *   variant="file"
 *   acceptedFileTypes={['application/pdf', '.doc']}
 *   onFilesChange={handleFilesChange}
 *   type="multiple"
 *   maxFile={3}
 *   files={uploadedFiles}
 * />
 * ```
 */
export const Uploader: React.FC<UploaderProps> = (props) => {
  const { maxSize = 5, onDelete, onDownload, className, variant, locale, onFilesChange } = props;
  const files = props.type === 'single' ? (props.file ? [props.file] : []) : props.files ?? [];
  const dictionary = getDictionary(locale);
  const abortControllers = useRef(new Map<string, AbortController>());


  // Determine accepted file types based on variant
  const getAcceptedFileTypes = (): string[] => {
    switch (variant) {
      case 'image':
        return props.acceptedFileTypes || ['image/*'];
      case 'video':
        return props.acceptedFileTypes || ['video/*'];
      case 'document':
        return props.acceptedFileTypes || ['application/pdf', '.doc', '.docx', 'application/msword'];
      case 'generic':
        return ['*/*']; // Generic accepts all file types
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
      case 'document':
      case 'generic':
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
      const tempId = crypto.randomUUID();
      const controller = new AbortController();
      abortControllers.current.set(tempId, controller);

      try {
        const newFile: fileMetadata.TFileUploadRequest = {
          id: tempId,
          name: file.name,
          file: file,
        };
        await onFilesChange([newFile], controller.signal);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          return err;
        }
      } finally {
        abortControllers.current.delete(tempId);
      }
    } else {
      const successfulFiles = files.filter(file => (file.status === 'available' || file.status === 'processing')) || [];
      const remainingSlots = props.maxFile - successfulFiles.length;
      const filesToAdd = uploadedFiles.slice(0, remainingSlots);
      if (filesToAdd.length === 0) return;

      const newUploadingFiles = filesToAdd.map((file) => {
        const tempId = crypto.randomUUID();
        const controller = new AbortController();
        abortControllers.current.set(tempId, controller);
        return {
          id: tempId,
          name: file.name,
          file: file,
        };
      });

      try {
        const uploadPromises = newUploadingFiles.map(async (newFile) => {
          const controller = abortControllers.current.get(newFile.id);
          try {
            await onFilesChange([newFile], controller?.signal);
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
              return err;
            }
          } finally {
            abortControllers.current.delete(newFile.id);
          }
        });
        await Promise.all(uploadPromises);
      } catch (err) {
        return err;
      }
    }
  };
  const handleCancelUpload = async (id: string) => {
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(id);
    }

    // For single uploader, we also clear the file via onFilesChange
    if (props.type === 'single') {
      await onFilesChange([]);
    }
  };
  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
        <div className="flex flex-col gap-2 w-full">
          {files?.map((file, index) => (
            <div key={file.id}>
              <FilePreview
                uploadResponse={file}
                onDelete={onDelete}
                onDownload={onDownload}
                onCancelUpload={handleCancelUpload}
                locale={locale}
              />
            </div>
          ))}
        </div>

      {((props.type === 'single' && (!props.file || !props.file.name || files.filter(f => f.name).length === 0)) ||
        (props.type === 'multiple' && files.filter(f => f.name).length < props.maxFile)) && (
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
