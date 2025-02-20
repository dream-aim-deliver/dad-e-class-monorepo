import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../button';
import { IconCloudUpload } from '../icons/icon-cloud-upload';

export type DragAndDropProps = {
  onUpload: (files: File[]) => void;
  maxSize?: number;
  className?: string;
  acceptedFileTypes?: string[];
  text: {
    title?: string;
    buttontext?: string;
    dragtext?: string;
    filesize?: string;
  };
};

/**
 * A reusable Drag and Drop file upload component with customizable styles, file validation, and error handling.
 *
 * @param onUpload Callback function triggered when files are successfully uploaded. Receives an array of `File` objects.
 * @param maxSize Optional maximum file size allowed for uploads, in bytes. Defaults to 15 MB.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param acceptedFileTypes Optional array of accepted file types (e.g., `['image/*', 'application/pdf']`). Defaults to images and PDFs.
 * @param text Object containing customizable text for various parts of the component:
 *  - `title`: Text displayed when a file is being dragged over the drop area.
 *  - `buttontext`: Text for the button displayed in the drop area.
 *  - `dragtext`: Instructional text displayed in the drop area when no file is being dragged.
 *  - `filesize`: Text label for displaying the maximum file size allowed.
 *
 * @example
 * <DragAndDrop
 *   onUpload={(files) => console.log(files)}
 *   maxSize={10 * 1024 * 1024}
 *   acceptedFileTypes={['image/png', 'application/pdf']}
 *   text={{
 *     title: "Drop your files here",
 *     buttontext: "Choose Files",
 *     dragtext: "or drag and drop files here",
 *     filesize: "Max file size",
 *   }}
 * />
 */

export const DragAndDrop: React.FC<DragAndDropProps> = ({
  onUpload,
  maxSize = 15 * 1024 * 1024,
  className,
  acceptedFileTypes = ['image/*', 'application/pdf'],
  text,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: acceptedFileTypes.reduce(
        (acc, type) => {
          acc[type] = [];
          return acc;
        },
        {} as { [key: string]: string[] },
      ),
      maxSize,
      onDrop: (acceptedFiles: File[], fileRejections: string | any[]) => {
        setError(null);
        if (fileRejections.length > 0) {
          setError(
            `Some files were rejected. Max size: ${maxSize / (1024 * 1024)} MB`,
          );
        } else {
          onUpload(acceptedFiles);
        }
      },
    });

  return (
    <div
      data-testid="file-input"
      className="flex flex-col items-center space-y-2 "
    >
      <div
        {...getRootProps()}
        className={`flex flex-col items-center bg-base-neutral-900  gap-[2px] justify-center  md:p-6 p-2 md:pt-4 border-2 ${
          isDragActive
            ? 'border-button-primary-stroke'
            : 'border-base-neutral-700'
        } border-dashed border-base-neutral-700 custom-dashed-border rounded-medium cursor-pointer  transition-colors ${className}`}
      >
        <input {...getInputProps()} />
        <IconCloudUpload classNames="w-6 h-6 text-base-neutral-50 font-bold" />
        <div className="flex flex-col gap-1 items-center justify-center">
          <div className="flex gap-2 items-center justify-center">
            {isDragActive ? (
              <p className="text-sm text-button-secondary-text">
                {text?.title}
              </p>
            ) : (
              <>
                <Button
                  variant="text"
                  text={text?.buttontext}
                  className="px-0"
                />
                <p className="text-sm text-text-primary">{text?.dragtext}</p>
              </>
            )}
          </div>
          <p className="text-xs text-text-secondary flex items-start">
            {text?.filesize}: {maxSize / (1024 * 1024)} MB
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
