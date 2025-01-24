import React, { useRef, useState } from 'react';
import { Upload, CloudDownload, Trash2 } from 'lucide-react';
import { Button } from '../button';

interface FileSelectorProps {
  defaultFile?: string;
  maxSizeInMB?: number;
  onUpload?: (file: File) => void;
  onDownload?: () => void;
  onRemove?: () => void;
  acceptedFileTypes?: string[];
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  defaultFile = '',
  maxSizeInMB = 10,
  onUpload,
  onDownload,
  onRemove,
  acceptedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
}) => {
  const [fileName, setFileName] = useState<string>('No file selected');
  const [fileSize, setFileSize] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [file, setFile] = useState<string | null>(
    defaultFile === '' ? null : defaultFile,
  );
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
    const selectedFile = event.target.files?.[0];
    setError('');

    if (!selectedFile) return;

    // Validate file type
    if (!acceptedFileTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a valid document.');
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
      setError(`File size should not exceed ${maxSizeInMB}MB`);
      return;
    }

    setFileName(selectedFile.name);
    setFileSize(formatFileSize(selectedFile.size));
    setFile(selectedFile.name);
    if (onUpload) onUpload(selectedFile);
  };

  const handleDownload = () => {
    if (file && file !== defaultFile) {
      const link = document.createElement('a');
      link.href = file;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onDownload) onDownload();
    }
  };

  const handleRemove = () => {
    setFile(null);
    setFileName('No file selected');
    setFileSize('');
    if (onRemove) onRemove();
  };

  return (
    <div className="flex flex-col w-full max-w-md space-y-2">
      <label className="text-sm text-stone-300" id="file-selector-label">
        Upload Document
      </label>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center w-12 h-12 rounded-lg border border-solid bg-stone-800 border-stone-700 justify-center"
            id="upload-icon-container"
          >
            <Upload size={20} className="text-stone-400" />
          </div>
          <div>
            <div
              className="text-base text-stone-50 truncate"
              id="file-name-display"
            >
              {fileName}
            </div>
            <div className="text-sm text-stone-400" id="file-size-display">
              {fileSize}
            </div>
            {error && (
              <div className="text-sm text-red-500 mt-1" id="error-message">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!file && (
            <div id="upload-button-container">
              <Button
                variant="text"
                size="small"
                onClick={handleUploadClick}
                className=""
              >
                <Upload />
              </Button>
            </div>
          )}

          {file && (
            <>
              <div id="download-button-container">
                <Button
                  variant="text"
                  size="small"
                  onClick={handleDownload}
                  className=""
                >
                  <CloudDownload />
                </Button>
              </div>
              <div id="remove-button-container">
                <Button
                  variant="text"
                  size="small"
                  onClick={handleRemove}
                  className=""
                >
                  <Trash2 />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <input
        role="textbox"
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileChange}
        id="file-input"
        className="hidden"
      />
    </div>
  );
};
