'use client';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../button';
import { IconCloudUpload } from '../icons/icon-cloud-upload';
import { FeedBackMessage } from '../feedback-message';

export type DragAndDropProps = {
  onUpload: (files: File[]) => void;
  maxSize?: number;
  className?: string;
  acceptedFileTypes?: string[];
  multiple?: boolean; // Added property to control multiple file selection
  text: {
    title: string;
    description: string;
    maxSizeText: string;
  };
};

/**
 * A reusable Drag and Drop file upload component with customizable styles, file validation, and error handling.
 *
 * @param onUpload Callback function triggered when files are successfully uploaded. Receives an array of `File` objects.
 * @param maxSize Optional maximum file size allowed for uploads, in bytes. Defaults to 15 MB.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param acceptedFileTypes Optional array of accepted file types using MIME type format. Can include:
 *  - Specific MIME types: 'application/pdf', 'image/png', 'image/jpeg'
 *  - Wildcard MIME types: 'image/*' (accepts all image formats)
 *  - Common categories: 'application/pdf', 'image/*', 'video/*', 'audio/*'
 *  Defaults to ['image/*', 'application/pdf'].
 * @param multiple Optional boolean to control if multiple files can be selected:
 *  - true (default): Allows uploading multiple files at once
 *  - false: Restricts to single file selection
 * @param text Object containing customizable text for various parts of the component:
 *  - `title`: Text displayed when a file is being dragged over the drop area
 *  - `description`: Instructional text displayed in the drop area
 *  - `maxSizeText`: Text label for displaying the maximum file size allowed
 *
 * @example
 * <DragAndDrop
 *   onUpload={(files) => console.log(files)}
 *   maxSize={10 * 1024 * 1024}
 *   acceptedFileTypes={['image/png', 'application/pdf']}
 *   multiple={false}
 *   text={{
 *     title: "Drop your file here",
 *     description: "or click to browse",
 *     maxSizeText: "Max file size"
 *   }}
 * />
 * */


export const DragAndDrop: React.FC<DragAndDropProps> = ({
  onUpload,
  maxSize = 15 * 1024 * 1024,
  className,
  acceptedFileTypes = ['image/*', 'application/pdf'],
  multiple = true, // Default to true for backward compatibility
  text,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: acceptedFileTypes.reduce(
        (acc, type) => {
          acc[type] = [];
          return acc;
        },
        {} as { [key: string]: string[] },
      ),
      maxSize,
      multiple, // Use the multiple prop to control file selection mode
      onDrop: (acceptedFiles: File[], fileRejections) => {
        setError(null);
        if (fileRejections.length > 0) {
          const sizeDisplay = maxSize >= 1024 * 1024 * 1024
            ? `${maxSize / (1024 * 1024 * 1024)} GB`
            : `${maxSize / (1024 * 1024)} MB`;
          setError(
            `Some files were rejected. Max size: ${sizeDisplay}. Accepted types: ${acceptedFileTypes.join(', ')}`,
          );
        } else if (!multiple && acceptedFiles.length > 1) {
          // Extra check for single file mode
          setError('Only one file can be uploaded');
          // Only pass the first file if in single mode
          onUpload([acceptedFiles[0]]);
        } else {
          onUpload(acceptedFiles);
        }
      },
    });

  return (
    <div
      data-testid="file-input"
      className="flex flex-col items-center space-y-2"
    >
      <div
        {...getRootProps()}
        className={`flex flex-col items-center bg-base-neutral-900 gap-[2px] justify-center md:p-6 p-2 md:pt-4 border-2 ${isDragActive
          ? 'border-button-primary-stroke'
          : 'border-base-neutral-700'
          } border-dashed border-base-neutral-700 custom-dashed-border rounded-medium cursor-pointer transition-colors ${className}`}
      >
        <input {...getInputProps()} />
        <IconCloudUpload classNames="w-6 h-6 text-base-neutral-50 font-bold" />
        <div className="flex flex-col gap-1 items-center justify-center">
          <div className="flex flex-wrap items-center justify-center text-center w-full">
            <Button variant="text" text={text.title} className="md:h-[2.5rem] h-4 px-1" type="button" />
            <p className="text-sm text-text-primary truncate max-w-[200px] sm:max-w-full">
              {text.description}
            </p>
          </div>
          <p className="text-xs text-text-secondary flex items-start">
            <span>{text.maxSizeText}</span>: {maxSize >= 1024 * 1024 * 1024
              ? `${maxSize / (1024 * 1024 * 1024)} GB`
              : `${maxSize / (1024 * 1024)} MB`}
          </p>
        </div>
      </div>
      {error && <FeedBackMessage type="error" message={error} />}
    </div>
  );
};
