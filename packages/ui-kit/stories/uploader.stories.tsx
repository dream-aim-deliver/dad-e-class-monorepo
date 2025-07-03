import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  Uploader,
  UploadedFileType,
} from '../lib/components/drag-and-drop-uploader/uploader';
import { fileMetadata } from '@maany_shr/e-class-models';

// Mock response generators
const mockFileResponse = (fileName: string): fileMetadata.TFileMetadata => {
  return {
    id: Math.random(),
    name: fileName,
    mimeType: 'application/octet-stream',
    size: Math.floor(Math.random() * 5000000) + 100000, // Random size between 100KB and 5MB
    checksum: `checksum-${Math.random().toString(36).substr(2, 16)}`,
    status: 'available',
    category: 'generic',
    url: `https://example.com/files/${fileName}`,
  } as fileMetadata.TFileMetadata;
};

const mockImageResponse = (fileName: string): fileMetadata.TFileMetadata => {
  const imageUrl = `https://picsum.photos/400/300?random=${Math.random()}`;
  const thumbnailUrl = `https://picsum.photos/150/150?random=${Math.random()}`;

  return {
    id: Math.random(),
    name: fileName,
    mimeType: 'image/jpeg',
    size: Math.floor(Math.random() * 3000000) + 50000, // Random size between 50KB and 3MB
    checksum: `checksum-${Math.random().toString(36).substr(2, 16)}`,
    status: 'available',
    category: 'image',
    url: imageUrl,
    thumbnailUrl: thumbnailUrl,
  } as fileMetadata.TFileMetadata;
};

const mockVideoResponse = (fileName: string): fileMetadata.TFileMetadata => {
  return {
    id: Math.random(),
    name: fileName,
    mimeType: 'video/mp4',
    size: Math.floor(Math.random() * 50000000) + 1000000, // Random size between 1MB and 50MB
    checksum: `checksum-${Math.random().toString(36).substr(2, 16)}`,
    status: 'available',
    category: 'video',
    videoId: Math.floor(Math.random() * 1000),
    thumbnailUrl: `https://via.placeholder.com/300x200/4f46e5/white?text=VIDEO`,
  } as fileMetadata.TFileMetadata;
};

// Wrapper component to properly contain hooks
const UploaderStoryWrapper = (props: { children: React.ReactNode }) => {
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
      options: ['generic', 'image', 'video', 'document'],
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleFileUploaderRender = (args: any) => {
  const [file, setFile] = useState<UploadedFileType | null>(null);

  const handleFilesChange = async (files: UploadedFileType[]): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];

      // In a real application, you would:
      // 1. Get a pre-signed URL from your backend
      // const presignedUrl = await getPresignedUrl(newFile.request.name);
      // 
      // 2. Upload the file directly to storage (e.g., S3)
      // await fetch(presignedUrl, {
      //   method: 'PUT',
      //   body: newFile.request.file,
      //   headers: {
      //     'Content-Type': newFile.request.file.type,
      //   },
      // });
      // 
      // 3. Update the UI with the response from your backend

      // For this demo, we'll simulate the upload process
      // First, set the file with processing status
      const processingFile = {
        ...newFile,
        responseData: {
          id: Math.random(),
          name: newFile.request.name,
          mimeType: 'application/octet-stream',
          size: newFile.request.file.size,
          checksum: 'processing',
          status: 'processing' as const,
          category: 'generic' as const,
          url: '',
        } as fileMetadata.TFileMetadata
      };
      setFile(processingFile);

      // Simulate the upload process
      return new Promise((resolve) => {
        setTimeout(() => {
          const responseData = mockFileResponse(newFile.request.name);
          const updatedFile = {
            ...newFile,
            responseData,
          };
          setFile(updatedFile);
          resolve(responseData);
        }, 2000);
      });
    } else {
      setFile(null);
      return Promise.resolve({} as fileMetadata.TFileMetadata);
    }
  };

  const handleDelete = (id: number) => {
    console.log('Delete file with id:', id);
    setFile(null);
  };

  const handleDownload = (id: number) => {
    console.log('Download file with id:', id);
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="generic"
      file={file || {
        request: { name: '', file: new File([], '') },
      }}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleImageUploaderRender = (args: any) => {
  const [file, setFile] = useState<UploadedFileType | null>(null);

  const handleFilesChange = async (files: UploadedFileType[]): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];

      // First, set the file with processing status
      const processingFile = {
        ...newFile,
        responseData: {
          id: Math.random(),
          name: newFile.request.name,
          mimeType: 'image/jpeg',
          size: newFile.request.file.size,
          checksum: 'processing',
          status: 'processing' as const,
          category: 'image' as const,
          url: '',
          thumbnailUrl: '',
        } as fileMetadata.TFileMetadata
      };
      setFile(processingFile);

      return new Promise((resolve) => {
        setTimeout(() => {
          const responseData = mockImageResponse(newFile.request.name);
          const updatedFile = {
            ...newFile,
            responseData,
          };
          setFile(updatedFile);
          resolve(responseData);
        }, 2000);
      });
    } else {
      setFile(null);
      return Promise.resolve({} as fileMetadata.TFileMetadata);
    }
  };

  const handleDelete = (id: number) => {
    setFile(null);
  };

  const handleDownload = (id: number) => {
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="image"
      file={file || {
        request: { name: '', file: new File([], '') },
      }}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleVideoUploaderRender = (args: any) => {
  const [file, setFile] = useState<UploadedFileType | null>(null);

  const handleFilesChange = async (files: UploadedFileType[]): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];

      // First, set the file with processing status
      const processingFile = {
        ...newFile,
        responseData: {
          id: Math.random(),
          name: newFile.request.name,
          mimeType: 'video/mp4',
          size: newFile.request.file.size,
          checksum: 'processing',
          status: 'processing' as const,
          category: 'video' as const,
          videoId: 0,
          thumbnailUrl: '',
        } as fileMetadata.TFileMetadata
      };
      setFile(processingFile);

      return new Promise((resolve) => {
        setTimeout(() => {
          const responseData = mockVideoResponse(newFile.request.name);
          const updatedFile = {
            ...newFile,
            responseData,
          };
          setFile(updatedFile);
          resolve(responseData);
        }, 2000);
      });
    } else {
      setFile(null);
      return Promise.resolve({} as fileMetadata.TFileMetadata);
    }
  };

  const handleDelete = (id: number) => {
    setFile(null);
  };

  const handleDownload = (id: number) => {
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="video"
      file={file || {
        request: { name: '', file: new File([], '') },
      }}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MultipleFileUploaderRender = (args: any) => {
  const [files, setFiles] = useState<UploadedFileType[]>([]);

  const handleFilesChange = async (newFiles: UploadedFileType[]): Promise<fileMetadata.TFileMetadata> => {
    // Find files that need processing (without responseData)
    const filesToProcess = newFiles.filter(f => !f.responseData);

    if (filesToProcess.length > 0) {
      // First, set files with processing status for new uploads
      const filesWithProcessing = newFiles.map(file => {
        if (!file.responseData) {
          return {
            ...file,
            responseData: {
              id: Math.random(),
              name: file.request.name,
              mimeType: 'application/octet-stream',
              size: file.request.file.size,
              checksum: 'processing',
              status: 'processing' as const,
              category: 'generic' as const,
              url: '',
            } as fileMetadata.TFileMetadata
          };
        }
        return file;
      });
      setFiles(filesWithProcessing);

      return new Promise((resolve) => {
        setTimeout(() => {
          const processedFiles = newFiles.map((file) => {
            if (!file.responseData) {
              const responseData = mockFileResponse(file.request.name);
              return {
                ...file,
                responseData,
              };
            }
            return file;
          });

          setFiles(processedFiles);
          // Return the last processed file's response
          const lastProcessed = processedFiles[processedFiles.length - 1];
          resolve(lastProcessed.responseData || {} as fileMetadata.TFileMetadata);
        }, 2000);
      });
    } else {
      setFiles(newFiles);
    }

    return Promise.resolve({} as fileMetadata.TFileMetadata);
  };

  const handleDelete = (id: number) => {
    setFiles(currentFiles => currentFiles.filter(file => file.responseData?.id !== id));
  };

  const handleDownload = (id: number) => {
    alert(`Download clicked for file with id: ${id}`);
  };

  return (
    <Uploader
      {...args}
      type="multiple"
      variant="generic"
      files={files}
      maxFile={5}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MultipleImageUploaderRender = (args: any) => {
  const [files, setFiles] = useState<UploadedFileType[]>([]);

  const handleFilesChange = async (newFiles: UploadedFileType[]): Promise<fileMetadata.TFileMetadata> => {
    const filesToProcess = newFiles.filter(f => !f.responseData);

    if (filesToProcess.length > 0) {
      // First, set files with processing status for new uploads
      const filesWithProcessing = newFiles.map(file => {
        if (!file.responseData) {
          return {
            ...file,
            responseData: {
              id: Math.random(),
              name: file.request.name,
              mimeType: 'image/jpeg',
              size: file.request.file.size,
              checksum: 'processing',
              status: 'processing' as const,
              category: 'image' as const,
              url: '',
              thumbnailUrl: '',
            } as fileMetadata.TFileMetadata
          };
        }
        return file;
      });
      setFiles(filesWithProcessing);

      return new Promise((resolve) => {
        setTimeout(() => {
          const processedFiles = newFiles.map((file) => {
            if (!file.responseData) {
              const responseData = mockImageResponse(file.request.name);
              return {
                ...file,
                responseData,
              };
            }
            return file;
          });

          setFiles(processedFiles);
          const lastProcessed = processedFiles[processedFiles.length - 1];
          resolve(lastProcessed.responseData || {} as fileMetadata.TFileMetadata);
        }, 2000);
      });
    } else {
      setFiles(newFiles);
    }

    return Promise.resolve({} as fileMetadata.TFileMetadata);
  };

  const handleDelete = (id: number) => {
    setFiles(currentFiles => currentFiles.filter(file => file.responseData?.id !== id));
  };

  const handleDownload = (id: number) => {
    alert(`Download clicked for file with id: ${id}`);
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
      locale={args.locale || 'de'}
    />
  );
};

// Story definitions using the render functions
export const SingleFileUploader: Story = {
  render: SingleFileUploaderRender,
  args: {
    maxSize: 5,
    acceptedFileTypes: ['application/pdf', 'text/plain', 'application/msword'],
    variant: 'generic',
    locale: 'en',
  },
};

export const SingleImageUploader: Story = {
  render: SingleImageUploaderRender,
  args: {
    maxSize: 10,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
  },
};

export const SingleVideoUploader: Story = {
  render: SingleVideoUploaderRender,
  args: {
    maxSize: 10,
    acceptedFileTypes: ['video/mp4', 'video/quicktime'],
  },
};

export const MultipleFileUploader: Story = {
  render: MultipleFileUploaderRender,
  args: {
    maxSize: 5,
    acceptedFileTypes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'image/*',
      'video/*',
    ],
    type: 'multiple',
    variant: 'generic',
  },
};

export const MultipleImageUploader: Story = {
  render: MultipleImageUploaderRender,
  args: {
    maxSize: 10,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    locale: 'de',
  },
};
