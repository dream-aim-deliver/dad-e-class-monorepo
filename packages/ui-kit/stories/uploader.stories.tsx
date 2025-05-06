import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  Uploader,
  UploadedFileType,
  UploadResponse,
} from '../lib/components/drag&drop/uploader';

// Mock file data for demos
const createMockFile = (name: string, type: string, size: number): File => {
  return new File(['mock content'], name, { type });
};

// Mock response generators
const mockFileResponse = (file: File): UploadResponse => {
  return {
    file_id: `file-${Math.random().toString(36).substr(2, 9)}`,
    file_name: file.name,
  };
};

const mockImageResponse = (file: File): UploadResponse => {
  return {
    image_id: `image-${Math.random().toString(36).substr(2, 9)}`,
    image_thumbnail_url:URL.createObjectURL(file),
  };
};

const mockVideoResponse = (file: File): UploadResponse => {
  return {
    video_id: `video-${Math.random().toString(36).substr(2, 9)}`,
    thumbnail_url: 'https://via.placeholder.com/150',
  };
};

// Wrapper component to properly contain hooks
const UploaderStoryWrapper = (props: any) => {
  return <>{props.children}</>;
};

// Component Story Meta
const meta: Meta<typeof Uploader> = {
  title: 'Components/Uploader',
  component: Uploader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <UploaderStoryWrapper>
        <Story />
      </UploaderStoryWrapper>
    ),
  ],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Specifies whether to allow single or multiple file uploads',
    },
    variant: {
      control: 'select',
      options: ['file', 'image', 'video'],
      description: 'The type of files this uploader accepts',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    locale: {
      control: 'radio',
      options: ['en', 'de'],
      defaultValue: 'en',
    },
    acceptedFileTypes: {
      control: 'object',
      description: 'Array of accepted MIME types',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Uploader>;

// Render functions for stories
const SingleFileUploaderRender = (args: any) => {
  const [file, setFile] = useState<UploadedFileType | null>(null);

  const handleFilesChange = (files: UploadedFileType[]) => {
    console.log(files);
    if (files.length > 0) {
      // Simulate the upload process
      setTimeout(() => {
        const updatedFile = {
          ...files[0],
          isUploading: false,
          responseData: mockFileResponse(files[0].file),
        };
        setFile(updatedFile);
      }, 10000);

      // Update with loading state immediately
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleDelete = () => {
    setFile(null);
  };

  const handleDownload = () => {
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="file"
      file={file as UploadedFileType}
      files={file ? [file] : []}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

const SingleImageUploaderRender = (args: any) => {
  const [file, setFile] = useState<UploadedFileType | null>(null);

  const handleFilesChange = (files: UploadedFileType[]) => {
    if (files.length > 0) {
      // Simulate the upload process
      setTimeout(() => {
        const updatedFile = {
          ...files[0],
          isUploading: false,
          responseData: mockImageResponse(files[0].file),
        };
        setFile(updatedFile);
      }, 10000);

      // Update with loading state immediately
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleDelete = () => {
    setFile(null);
  };

  const handleDownload = () => {
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="image"
      file={file as UploadedFileType}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

const SingleVideoUploaderRender = (args: any) => {
  const [file, setFile] = useState<UploadedFileType | null>(null);

  const handleFilesChange = (files: UploadedFileType[]) => {
    if (files.length > 0) {
      // Simulate the upload process
      setTimeout(() => {
        const updatedFile = {
          ...files[0],
          isUploading: false,
          responseData: mockVideoResponse(files[0].file),
        };
        setFile(updatedFile);
      }, 10000);

      // Update with loading state immediately
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleDelete = () => {
    setFile(null);
  };

  const handleDownload = () => {
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="video"
      file={file as UploadedFileType}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

const MultipleFileUploaderRender = (args: any) => {
  const [files, setFiles] = useState<UploadedFileType[]>([]);

  const handleFilesChange = (newFiles: UploadedFileType[]) => {
    // Find which files are new (still uploading)
    const uploadingFiles = newFiles.filter((f) => f.isUploading);

    // Keep existing processed files
    const existingFiles = newFiles.filter((f) => !f.isUploading);

    // Set the files immediately with loading state
    setFiles(newFiles);

    // Process each uploading file
    if (uploadingFiles.length > 0) {
      setTimeout(() => {
        const processedFiles = newFiles.map((file) => {
          if (file.isUploading) {
            return {
              ...file,
              isUploading: false,
              responseData: mockFileResponse(file.file),
            };
          }
          return file;
        });

        setFiles(processedFiles);
      }, 10000);
    }
  };

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDownload = (index: number) => {
    alert(`Download clicked for file at index ${index}`);
  };

  return (
    <Uploader
      {...args}
      type="multiple"
      variant="file"
      files={files}
      maxFile={5}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

const MultipleImageUploaderRender = (args: any) => {
  const [files, setFiles] = useState<UploadedFileType[]>([]);

  const handleFilesChange = (newFiles: UploadedFileType[]) => {
    // Find which files are new (still uploading)
    const uploadingFiles = newFiles.filter((f) => f.isUploading);

    // Set the files immediately with loading state
    setFiles(newFiles);

    // Process each uploading file
    if (uploadingFiles.length > 0) {
      setTimeout(() => {
        const processedFiles = newFiles.map((file) => {
          if (file.isUploading) {
            return {
              ...file,
              isUploading: false,
              responseData: mockImageResponse(file.file),
            };
          }
          return file;
        });

        setFiles(processedFiles);
      }, 10000);
    }
  };

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDownload = (index: number) => {
    alert(`Download clicked for file at index ${index}`);
  };

  return (
    <Uploader
      {...args}
      type="multiple"
      variant="image"
      files={files}
      maxFile={5}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

const MultipleVideoUploaderRender = (args: any) => {
  const [files, setFiles] = useState<UploadedFileType[]>([]);

  const handleFilesChange = (newFiles: UploadedFileType[]) => {
    // Find which files are new (still uploading)
    const uploadingFiles = newFiles.filter((f) => f.isUploading);

    // Set the files immediately with loading state
    setFiles(newFiles);

    // Process each uploading file
    if (uploadingFiles.length > 0) {
      setTimeout(() => {
        const processedFiles = newFiles.map((file) => {
          if (file.isUploading) {
            // For demo purposes, set an error on video files
            if (file.file.name.endsWith('.mov')) {
              return {
                ...file,
                isUploading: false,
                error: 'Only MP4 video format is supported',
              };
            } else {
              return {
                ...file,
                isUploading: false,
                responseData: mockVideoResponse(file.file),
              };
            }
          }
          return file;
        });

        setFiles(processedFiles);
      }, 10000);
    }
  };

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDownload = (index: number) => {
    alert(`Download clicked for file at index ${index}`);
  };

  return (
    <Uploader
      {...args}
      type="multiple"
      variant="video"
      files={files}
      maxFile={3}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

const UploaderWithPreloadedFilesRender = (args: any) => {
  // Create mock files with completed uploads
  const mockPdfFile = createMockFile(
    'document.pdf',
    'application/pdf',
    1,
  );
  const mockDocFile = createMockFile(
    'report.docx',
    'application/msword',
    2 ,
  );

  // Create a file with error for demo purposes
  const mockErrorFile = createMockFile(
    'error_file.exe',
    'application/x-msdownload',
    3 ,
  );

  const [files, setFiles] = useState<UploadedFileType[]>([
    {
      file: mockPdfFile,
      isUploading: false,
      responseData: {
        file_id: 'existing-file-1',
        file_name: 'document.pdf',
      },
    },
    {
      file: mockDocFile,
      isUploading: false,
      responseData: {
        file_id: 'existing-file-2',
        file_name: 'report.docx',
      },
    },
    {
      file: mockErrorFile,
      isUploading: false,
      error: 'File type not allowed. Only documents are permitted.',
    },
  ]);

  const handleFilesChange = (newFiles: UploadedFileType[]) => {
    // Find which files are new (still uploading)
    const uploadingFiles = newFiles.filter((f) => f.isUploading);

    // Set the files immediately with loading state
    setFiles(newFiles);

    // Process each uploading file
    if (uploadingFiles.length > 0) {
      setTimeout(() => {
        const processedFiles = newFiles.map((file) => {
          if (file.isUploading) {
            return {
              ...file,
              isUploading: false,
              responseData: mockFileResponse(file.file),
            };
          }
          return file;
        });

        setFiles(processedFiles);
      }, 10000);
    }
  };

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDownload = (index: number) => {
    alert(`Download clicked for file at index ${index}`);
  };

  return (
    <Uploader
      {...args}
      type="multiple"
      variant="file"
      files={files}
      maxFile={5}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

// Error handling demo story
const ErrorHandlingUploaderRender = (args: any) => {
  const [files, setFiles] = useState<UploadedFileType[]>([]);
  const [fileCount, setFileCount] = useState(0);

  const handleFilesChange = (newFiles: UploadedFileType[]) => {
    // Find which files are new (still uploading)
    const uploadingFiles = newFiles.filter((f) => f.isUploading);

    // Set the files immediately with loading state
    setFiles(newFiles);

    // Process each uploading file
    if (uploadingFiles.length > 0) {
      setTimeout(() => {
        const processedFiles = newFiles.map((file) => {
          if (file.isUploading) {
            // Always produce an error for odd-numbered uploads
            if (fileCount % 2 === 0) {
              setFileCount(fileCount + 1);
              return {
                ...file,
                isUploading: false,
                error:
                  'This file failed to upload. Try uploading another file to see error handling in action.',
              };
            } else {
              setFileCount(fileCount + 1);
              return {
                ...file,
                isUploading: false,
                responseData: mockFileResponse(file.file),
              };
            }
          }
          return file;
        });

        setFiles(processedFiles);
      }, 10000);
    }
  };

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDownload = (index: number) => {
    alert(`Download clicked for file at index ${index}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Upload files to see the error handling in action. Every first upload
        will fail, every second upload will succeed. Notice how errors are
        cleared when uploading new files.
      </p>
      <Uploader
        {...args}
        type="multiple"
        variant="file"
        files={files}
        maxFile={5}
        onFilesChange={handleFilesChange}
        onDelete={handleDelete}
        onDownload={handleDownload}
        locale={args.locale || 'en'}
      />
    </div>
  );
};

// Story definitions using the render functions
export const SingleFileUploader: Story = {
  render: SingleFileUploaderRender,
  args: {
    // 5MB
    maxSize: 5,
    acceptedFileTypes: ['application/pdf', 'text/plain', 'application/msword'],
    variant: 'file',
    locale: 'en',
  },
};

export const SingleImageUploader: Story = {
  render: SingleImageUploaderRender,
  args: {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
  },
};

export const SingleVideoUploader: Story = {
  render: SingleVideoUploaderRender,
  args: {
    maxSize: 10, // 10MB
    acceptedFileTypes: ['video/mp4', 'video/quicktime'],
  },
};

export const MultipleFileUploader: Story = {
  render: MultipleFileUploaderRender,
  args: {
    // 5MB
    maxSize: 5,
    acceptedFileTypes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'image/*',
      'video/*',
    ],
    type: 'multiple',
    variant: 'file',
  },
};

export const MultipleImageUploader: Story = {
  render: MultipleImageUploaderRender,
  args: {
    // 10MB
    maxSize: 10,

    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    locale: 'de',
  },
};

export const MultipleVideoUploader: Story = {
  render: MultipleVideoUploaderRender,
  args: {
    maxSize: 10, // 10MB
    acceptedFileTypes: ['video/mp4', 'video/quicktime'],
  },
};

export const UploaderWithPreloadedFiles: Story = {
  render: UploaderWithPreloadedFilesRender,
  args: {
    maxSize: 5, // 5MB
    acceptedFileTypes: ['application/pdf', 'text/plain', 'application/msword'],
  },
};

export const UploaderWithErrorHandling: Story = {
  render: ErrorHandlingUploaderRender,
  args: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFileTypes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'image/*',
      'video/*',
    ],
    locale: 'en',
  },
};
