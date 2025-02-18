import { CloudUpload } from 'lucide-react';
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
    title?: string,
    buttontext?: string,
    dragtext?: string,
    filesize?: string
  }
};

export const DragAndDrop: React.FC<DragAndDropProps> = ({
  onUpload,
  maxSize = 15 * 1024 * 1024,
  className,
  acceptedFileTypes = ['image/*', 'application/pdf'], 
  text
}) => {
  const [error, setError] = useState<string | null>(null);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as { [key: string]: string[] }),
    maxSize,
    onDrop: (acceptedFiles: File[], fileRejections: string | any[]) => {
      setError(null);
      if (fileRejections.length > 0) {
        setError(`Some files were rejected. Max size: ${maxSize / (1024 * 1024)} MB`);
      } else {
        onUpload(acceptedFiles);
      }
    },
  });

  return (
    <div data-testid="file-input" className="flex flex-col items-center space-y-2 ">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center bg-base-neutral-900  gap-[2px] justify-center  p-6 pt-4 border-2 ${isDragActive ? 'border-button-primary-stroke' : 'border-base-neutral-700'
          } border-dashed border-base-neutral-700 custom-dashed-border rounded-medium cursor-pointer  transition-colors ${className}`}
      >
        <input {...getInputProps()} />
        <IconCloudUpload classNames="w-6 h-6 text-base-neutral-50 font-bold" />
        <div className='flex flex-col gap-1 items-center justify-center'>
          <div className='flex gap-2 items-center justify-center'>
            {isDragActive ? <p className='text-sm text-button-secondary-text'>
              {text?.title}
            </p> : <>
              <Button variant='text' text={text?.buttontext} className='px-0' />
              <p className='text-sm text-text-primary'>{text?.dragtext}</p>
            </>
            }
          </div>
          <p className="text-xs text-text-secondary flex items-start">{text?.filesize}: {maxSize / (1024 * 1024)} MB</p>
        </div>

      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};