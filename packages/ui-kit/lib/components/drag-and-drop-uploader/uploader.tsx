import React, { useState, useRef } from 'react';
import { DragAndDrop } from './drag-and-drop';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';
import { cn } from '../../utils/style-utils';
import { FilePreview } from './file-preview';
import { ACCEPTED_FILE_TYPES, getDocumentFileTypes } from '../../utils/constants';

/**
 * Common properties shared by both single and multiple file uploaders.
 * This interface extends isLocalAware to support localization.
 * @props maxSize defines the maximum file size in MB.
 * @props onDelete callback to handle file deletion.
 * @props onDownload callback to handle file download.
 * @props className optional custom class name for styling.
 * @props acceptedFileTypes array of accepted file types, if not provided defaults to common types based on variant.
 * @props variant defines the category of files being uploaded (image, video, document, generic).
 * @props onFilesChange callback to handle file changes during upload.
 * @props onUploadComplete callback to handle actions after a file upload is complete.
 *  
 * * @remarks
 * This interface is used to define the properties for the Uploader component, which can handle both single and multiple file uploads.
 * It provides a consistent API for handling file uploads, deletions, downloads, and localization.
 *@example
  * ```tsx
  * <Uploader
  *   type="single"
  *   variant="image"
  *   onDelete={handleDelete}
  *   onDownload={handleDownload}
  *   onFilesChange={handleFilesChange}
  *   onUploadComplete={handleUploadComplete}
  * />
  * ``` 
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
    file: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
  isDeletionAllowed?: boolean;
}

/**
 * Uploader component that supports both single and multiple file uploads.
 * It provides drag-and-drop functionality, file previews, and handles file uploads with progress tracking.
 * 
 * @remarks
 * This component is designed to be flexible and can handle different types of files based on the variant prop.
 * It supports localization through the isLocalAware interface.
 *
 */
type SingleUploaderProps = CommonUploaderProps & {
  type: 'single';
  file: fileMetadata.TFileMetadata | null;
};

type MultipleUploaderProps = CommonUploaderProps & {
  type: 'multiple';
  maxFile: number;
  files: fileMetadata.TFileMetadata[] | null;
};

export type UploaderProps = SingleUploaderProps | MultipleUploaderProps;

export const Uploader: React.FC<UploaderProps> = (props) => {
  const {
    maxSize = 5,
    onDelete,
    onDownload,
    className,
    variant,
    onFilesChange,
    onUploadComplete,
    locale,
    isDeletionAllowed,
  } = props;

  const [uploadingFiles, setUploadingFiles] = useState<fileMetadata.TFileMetadata[]>([]);
  const abortControllers = useRef(new Map<string, AbortController>());

  const passedInFiles = (props.type === 'multiple'
    ? (props.files ?? [])
    : (props.file ? [props.file] : [])
  ).filter((f) => f !== null) as fileMetadata.TFileMetadata[];

  const allFiles = [...passedInFiles, ...uploadingFiles];

  const dictionary = getDictionary(locale);

  const getAcceptedFileTypes = (): string[] => {
    if (props.acceptedFileTypes) return props.acceptedFileTypes;

    switch (variant) {
      case 'image':
        return [...ACCEPTED_FILE_TYPES.IMAGE];
      case 'video':
        return [...ACCEPTED_FILE_TYPES.VIDEO];
      case 'document':
        return getDocumentFileTypes();
      case 'generic':
      default:
        return [];
    }
  };

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

  const handleUpload = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    let filesToProcess: File[] = [];
    if (props.type === 'single') {
      filesToProcess = [selectedFiles[0]];
    } else {
      const availableSlots = props.maxFile - allFiles.length;
      filesToProcess = selectedFiles.slice(0, availableSlots);
    }

    const newUploads: fileMetadata.TFileMetadata[] = filesToProcess.map((file) => {
      const tempId = crypto.randomUUID();
      const controller = new AbortController();
      abortControllers.current.set(tempId, controller);

      const baseMetadata = {
        id: tempId,
        name: file.name,
        size: file.size,
        status: 'processing' as const,
        category: variant,
      };

      // Create category-specific metadata based on the variant
      switch (variant) {
        case 'video':
          return {
            ...baseMetadata,
            category: 'video' as const,
            videoId: "0", // Temporary placeholder
            thumbnailUrl: '', // Temporary placeholder
          };
        case 'image':
          return {
            ...baseMetadata,
            category: 'image' as const,
            url: '', // Temporary placeholder
            thumbnailUrl: '', // Temporary placeholder
          };
        case 'document':
          return {
            ...baseMetadata,
            category: 'document' as const,
            url: '', // Temporary placeholder
          };
        case 'generic':
        default:
          return {
            ...baseMetadata,
            category: 'generic' as const,
            url: '', // Temporary placeholder
          };
      }
    });

    setUploadingFiles((prev) => [...prev, ...newUploads]);

    const uploadPromises = newUploads.map(async (processingFile) => {
      const originalFile = filesToProcess.find(
        (f) => f.name === processingFile.name && f.size === processingFile.size
      );
      if (!originalFile) return;

      const controller = abortControllers.current.get(processingFile.id as string);
      if (!controller) return;

      try {
        const finalMetadata = await onFilesChange(
          { id: processingFile.id, name: processingFile.name, file: originalFile },
          controller.signal
        );

        onUploadComplete(finalMetadata);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Upload failed:', err);
          onDelete(processingFile.id as string); // Notify parent to remove failed upload
        }
      } finally {
        abortControllers.current.delete(processingFile.id as string);
        setUploadingFiles((prev) => prev.filter((f) => f.id !== processingFile.id));
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleCancelUpload = (id: string) => {
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(id);
      setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className={cn('flex flex-col w-full gap-4', className)}>
      {allFiles.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {allFiles.map((file) => (
            <div key={file.id}>
              <FilePreview
                uploadResponse={file}
                onDelete={onDelete}
                onDownload={onDownload}
                onCancel={handleCancelUpload}
                locale={locale}
                isDeletionAllowed={props.isDeletionAllowed}
              />
            </div>
          ))}
        </div>
      )}

      {((props.type === 'single' && allFiles.length === 0) ||
        (props.type === 'multiple' && allFiles.length < props.maxFile)) && (
          <DragAndDrop
            onUpload={handleUpload}
            maxSize={maxSize * 1024 * 1024}
            acceptedFileTypes={getAcceptedFileTypes()}
            multiple={props.type === 'multiple'}
            text={getUploaderText()}
            className="w-full"
          />
        )}
    </div>
  );
};