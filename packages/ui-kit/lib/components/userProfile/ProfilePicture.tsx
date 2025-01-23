import React, { useRef, useState } from 'react';
import { Upload, CloudDownload, Trash2 } from 'lucide-react';
import { Button } from '../button';

interface ProfilePictureProps {
  defaultImage?: string;
  fileNameIs?: string;
  maxSizeInMB?: number;
  onUpload?: (file: File) => void;
  onDownload?: () => void;
  onRemove?: () => void;
  acceptedFileTypes?: string[];
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  defaultImage = '/api/placeholder/64/64',
  maxSizeInMB = 5,
  fileNameIs = 'No file selected',
  onUpload,
  onDownload,
  onRemove,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const [image, setImage] = useState<string>(defaultImage);
  const [fileName, setFileName] = useState<string>(fileNameIs);
  const [fileSize, setFileSize] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');

    if (!file) return;

    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a valid image file.');
      return;
    }

    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`File size should not exceed ${maxSizeInMB}MB`);
      return;
    }

    // Create preview and update state
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setFileName(file.name);
        setFileSize(formatFileSize(file.size));
        if (onUpload) onUpload(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (image && image !== defaultImage) {
      const link = document.createElement('a');
      link.href = image;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onDownload) onDownload();
    }
  };

  const handleRemove = () => {
    setImage(defaultImage);
    setFileName('No file selected');
    setFileSize('');
    if (onRemove) onRemove();
  };

  return (
    <div className="flex flex-col w-full max-w-md space-y-2">
      <label className="text-sm text-stone-300">Profile Picture</label>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <img
            src={image}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover bg-stone-800"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="text"
              size="medium"
              onClick={handleUploadClick}
              className=""
            >
              <Upload />
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-base text-stone-50 truncate">{fileName}</div>
          <div className="text-sm text-stone-400">{fileSize}</div>
          {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        </div>

        <div className="flex gap-4">
          {image == defaultImage ? (
            <>
              <Button variant="text" onClick={handleUploadClick} className="">
                <Upload />
              </Button>
            </>
          ) : (
            <>
              <Button variant="text" onClick={handleDownload} className="">
                <CloudDownload />
              </Button>
              <Button variant="text" onClick={handleRemove} className="">
                <Trash2 />
              </Button>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
