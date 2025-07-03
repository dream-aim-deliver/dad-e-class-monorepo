import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fileMetadata } from '@maany_shr/e-class-models';
import { Uploader } from '../lib/components/drag-and-drop-uploader/uploader';

// Mock response generators
const mockFileResponse = (fileName: string): fileMetadata.TFileMetadata => {
  return {
    id: String(Math.floor(Math.random() * 1000000)), // Use a string for id
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
  const imageUrl = `https://source.unsplash.com/random/300×200/?city`;
  const thumbnailUrl = `https://picsum.photos/200/300`;

  return {
    id: String(Math.floor(Math.random() * 1000000)),
    name: fileName,
    mimeType: 'image/jpeg',
    size: Math.floor(Math.random() * 3000000) + 50000, // Random size between 50KB and 3MB
    checksum: `checksum-${Math.random().toString(36).substr(2, 16)}`,
    status: 'available',
    category: 'image',
    url: 'https://source.unsplash.com/random/300×200/?city',
    thumbnailUrl: 'https://picsum.photos/200/300',
  } as fileMetadata.TFileMetadata;
};

const mockVideoResponse = (fileName: string): fileMetadata.TFileMetadata => {
  return {
    id: String(Math.floor(Math.random() * 1000000)),
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
  const [file, setFile] = useState<fileMetadata.TFileMetadata | null>(null);

  const handleFilesChange = async (
    files: fileMetadata.TFileUploadRequest[],
    abortSignal?: AbortSignal,
  ): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];

      // Step 1: Create processing metadata immediately
      const processingMetadata: fileMetadata.TFileMetadata = {
        id: (newFile as any).id,
        name: newFile.name,
        mimeType: newFile.file.type || 'application/octet-stream',
        size: newFile.file.size,
        checksum: 'processing',
        status: 'processing' as const,
        category: 'generic' as const,
        url: '',
      };
      setFile(processingMetadata);

      // Step 2: Simulate upload process
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          const finalMetadata = mockFileResponse(newFile.name);
          finalMetadata.id = processingMetadata.id;
          setFile(finalMetadata);
          resolve(finalMetadata);
        }, 2000);

        abortSignal?.addEventListener('abort', () => {
          clearTimeout(timeout);
          setFile(null); // Or set a 'cancelled' state
          reject(new DOMException('Upload aborted', 'AbortError'));
        });
      });
    } else {
      // Clear file when empty array is passed
      setFile(null);
      return Promise.resolve({} as fileMetadata.TFileMetadata);
    }
  };

  const handleDelete = (id: string) => {
    console.log('Delete file with id:', id);
    setFile(null);
  };

  const handleDownload = (id: string) => {
    console.log('Download file with id:', id);
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="generic"
      file={file}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleImageUploaderRender = (args: any) => {
  const [file, setFile] = useState<fileMetadata.TFileMetadata | null>(null);

  const handleFilesChange = async (
    files: fileMetadata.TFileUploadRequest[],
    abortSignal?: AbortSignal,
  ): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];

      // Step 1: Create processing metadata immediately
      const processingMetadata: fileMetadata.TFileMetadata = {
        id: (newFile as any).id || crypto.randomUUID(),
        name: newFile.name,
        mimeType: newFile.file.type || 'application/octet-stream',
        size: newFile.file.size,
        checksum: 'processing',
        status: 'processing' as const,
        category: 'image' as const,
        url: '',
      };
      setFile(processingMetadata);

      // Step 2: Simulate upload process
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          const finalMetadata = mockImageResponse(newFile.name);
          finalMetadata.id = processingMetadata.id;
          setFile(finalMetadata);
          resolve(finalMetadata);
        }, 2000);

        abortSignal?.addEventListener('abort', () => {
          console.log('Upload aborted');
          clearTimeout(timeout);
          setFile(null);
          reject(new DOMException('Upload aborted', 'AbortError'));
        });
      });
    } else {
      setFile(null);
      return Promise.resolve({} as fileMetadata.TFileMetadata);
    }
  };

  const handleDelete = (id: string) => {
    setFile(null);
  };

  const handleDownload = (id: string) => {
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="image"
      file={file}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleVideoUploaderRender = (args: any) => {
  const [file, setFile] = useState<fileMetadata.TFileMetadata | null>(null);

  const handleFilesChange = async (
    files: fileMetadata.TFileUploadRequest[],
    abortSignal?: AbortSignal,
  ): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];
      const processingMetadata: fileMetadata.TFileMetadata = {
        id: (newFile as any).id || crypto.randomUUID(),
        name: newFile.name,
        mimeType: newFile.file.type || 'application/octet-stream',
        size: newFile.file.size,
        checksum: 'processing',
        status: 'processing' as const,
        category: 'video' as const,
      };
      setFile(processingMetadata);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          const finalMetadata = mockVideoResponse(newFile.name);
          finalMetadata.id = processingMetadata.id;
          setFile(finalMetadata);
          resolve(finalMetadata);
        }, 2000);

        abortSignal?.addEventListener('abort', () => {
          clearTimeout(timeout);
          setFile(null);
          reject(new DOMException('Upload aborted', 'AbortError'));
        });
      });
    } else {
      setFile(null);
      return Promise.resolve({} as fileMetadata.TFileMetadata);
    }
  };

  const handleDelete = (id: string) => {
    setFile(null);
  };

  const handleDownload = (id: string) => {
    alert('Download clicked - in a real app, this would download the file');
  };

  return (
    <Uploader
      {...args}
      type="single"
      variant="video"
      file={file}
      onFilesChange={handleFilesChange}
      onDelete={handleDelete}
      onDownload={handleDownload}
      locale={args.locale || 'en'}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MultipleFileUploaderRender = (args: any) => {
  const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);

  const handleFilesChange = async (
    newFiles: fileMetadata.TFileUploadRequest[],
    abortSignal?: AbortSignal,
  ): Promise<fileMetadata.TFileMetadata[]> => {
    if (newFiles.length === 0) {
      return Promise.resolve([]);
    }

    const uploadRequest = newFiles[0]; // Assuming one file at a time for simplicity with signal

    const mimeType = uploadRequest.file.type || 'application/octet-stream';
    let category: fileMetadata.TFileCategoryEnum = 'generic';
    if (mimeType.startsWith('image/')) {
      category = 'image';
    } else if (mimeType.startsWith('video/')) {
      category = 'video';
    } else if (mimeType.startsWith('application/pdf')) {
      category = 'document';
    }

    const processingMetadata: fileMetadata.TFileMetadata = {
      id: (uploadRequest as any).id || crypto.randomUUID(),
      name: uploadRequest.name,
      mimeType: mimeType,
      size: uploadRequest.file.size,
      checksum: 'processing',
      status: 'processing' as const,
      category: category,
      url: '',
    };

    setFiles((currentFiles) => [...currentFiles, processingMetadata]);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        let finalMetadata: fileMetadata.TFileMetadata;
        switch (category) {
          case 'image':
            finalMetadata = mockImageResponse(uploadRequest.name);
            break;
          case 'video':
            finalMetadata = mockVideoResponse(uploadRequest.name);
            break;
          default:
            finalMetadata = mockFileResponse(uploadRequest.name);
            break;
        }

        finalMetadata.id = processingMetadata.id;
        setFiles((currentFiles) =>
          currentFiles.map((f) =>
            f.id === finalMetadata.id ? finalMetadata : f,
          ),
        );
        resolve([finalMetadata]);
      }, 2000);

      abortSignal?.addEventListener('abort', () => {
        clearTimeout(timeout);
        setFiles((currentFiles) =>
          currentFiles.filter((f) => f.id !== processingMetadata.id),
        );
        reject(new DOMException('Upload aborted', 'AbortError'));
      });
    });
  };

  const handleDelete = (id: string) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => String(file.id) !== id),
    );
  };

  const handleDownload = (id: string) => {
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
  const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);

  const handleFilesChange = async (
    newFiles: fileMetadata.TFileUploadRequest[],
    abortSignal?: AbortSignal,
  ): Promise<fileMetadata.TFileMetadata[]> => {
    if (newFiles.length === 0) {
      return Promise.resolve([]);
    }

    const uploadRequest = newFiles[0];

    const processingMetadata: fileMetadata.TFileMetadata = {
      id: (uploadRequest as any).id || crypto.randomUUID(),
      name: uploadRequest.name,
      mimeType: uploadRequest.file.type || 'image/jpeg',
      size: uploadRequest.file.size,
      checksum: 'processing',
      status: 'processing' as const,
      category: 'image' as const,
      url: '',
      thumbnailUrl: '',
    };

    setFiles((currentFiles) => [...currentFiles, processingMetadata]);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const finalMetadata = mockImageResponse(uploadRequest.name);
        finalMetadata.id = processingMetadata.id;
        setFiles((currentFiles) =>
          currentFiles.map((f) =>
            f.id === finalMetadata.id ? finalMetadata : f,
          ),
        );
        resolve([finalMetadata]);
      }, 2000);

      abortSignal?.addEventListener('abort', () => {
        clearTimeout(timeout);
        setFiles((currentFiles) =>
          currentFiles.filter((f) => f.id !== processingMetadata.id),
        );
        reject(new DOMException('Upload aborted', 'AbortError'));
      });
    });
  };

  const handleDelete = (id: string) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => String(file.id) !== id),
    );
  };

  const handleDownload = (id: string) => {
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
    variant: 'generic',
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
    maxSize: 1,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    locale: 'de',
  },
};
