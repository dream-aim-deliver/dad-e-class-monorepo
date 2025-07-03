import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { fileMetadata } from '@maany_shr/e-class-models';
import { Uploader } from '../lib/components/drag-and-drop-uploader/uploader';

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
  const imageUrl = `https://source.unsplash.com/random/300×200/?city`;
  const thumbnailUrl = `https://picsum.photos/200/300`;

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
  const [file, setFile] = useState<fileMetadata.TFileMetadata | null>(null);

  const handleFilesChange = async (
    files: fileMetadata.TFileUploadRequest[],
  ): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];

      // Step 1: Create processing metadata immediately
      const processingMetadata: fileMetadata.TFileMetadata = {
        id: Date.now(), // Temporary ID
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
      return new Promise((resolve) => {
        setTimeout(() => {
          // Step 3: Replace with final metadata
          const finalMetadata = mockFileResponse(newFile.name);
          setFile(finalMetadata);
          resolve(finalMetadata);
        }, 2000);
      });
    } else {
      // Clear file when empty array is passed
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
  ): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];

      // Step 1: Create processing metadata immediately
      const processingMetadata: fileMetadata.TFileMetadata = {
        id: Date.now(), // Temporary ID
        name: newFile.name,
        mimeType: newFile.file.type || 'image/jpeg',
        size: newFile.file.size,
        checksum: 'processing',
        status: 'processing' as const,
        category: 'image' as const,
        url: '',
        thumbnailUrl: '',
      };
      setFile(processingMetadata);

      // Step 2: Simulate upload process
      return new Promise((resolve) => {
        setTimeout(() => {
          // Step 3: Replace with final metadata
          const finalMetadata = mockImageResponse(newFile.name);
          setFile(finalMetadata);
          resolve(finalMetadata);
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
  ): Promise<fileMetadata.TFileMetadata> => {
    if (files.length > 0) {
      const newFile = files[0];

      // Step 1: Create processing metadata immediately
      const processingMetadata: fileMetadata.TFileMetadata = {
        id: Date.now(), // Temporary ID
        name: newFile.name,
        mimeType: newFile.file.type || 'video/mp4',
        size: newFile.file.size,
        checksum: 'processing',
        status: 'processing' as const,
        category: 'video' as const,
        videoId: 0, // Temporary video ID
        thumbnailUrl: '',
      };
      setFile(processingMetadata);

      // Step 2: Simulate upload process
      return new Promise((resolve) => {
        setTimeout(() => {
          // Step 3: Replace with final metadata
          const finalMetadata = mockVideoResponse(newFile.name);
          setFile(finalMetadata);
          resolve(finalMetadata);
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
  ): Promise<fileMetadata.TFileMetadata> => {
    // Now the uploader only passes new upload requests
    if (newFiles.length === 0) {
      // No new files to process
      return Promise.resolve({} as fileMetadata.TFileMetadata);
    }

    // Step 1: Create processing metadata for new uploads
    const processingMetadata: fileMetadata.TFileMetadata[] = newFiles.map((upload, index) => ({
      id: Date.now() + index, // Unique temporary IDs
      name: upload.name,
      mimeType: upload.file.type || 'application/octet-stream',
      size: upload.file.size,
      checksum: 'processing',
      status: 'processing' as const,
      category: 'generic' as const,
      url: '',
    }));

    // Step 2: Add processing files to state immediately
    setFiles(currentFiles => [...currentFiles, ...processingMetadata]);

    // Step 3: Simulate upload process
    return new Promise((resolve) => {
      setTimeout(() => {
        // Step 4: Generate final metadata for each uploaded file
        const finalMetadata = newFiles.map(upload => mockFileResponse(upload.name));

        // Step 5: Replace processing files with final metadata
        setFiles(currentFiles => {
          // Keep non-processing files and replace processing ones
          const nonProcessingFiles = currentFiles.filter(
            f => !processingMetadata.some(p => p.id === f.id)
          );
          return [...nonProcessingFiles, ...finalMetadata];
        });

        // Return the last uploaded file's metadata
        resolve(finalMetadata[finalMetadata.length - 1] || {} as fileMetadata.TFileMetadata);
      }, 2000);
    });
  };

  const handleDelete = (id: number) => {
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id));
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
  const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);

  const handleFilesChange = async (
    newFiles: fileMetadata.TFileUploadRequest[],
  ): Promise<fileMetadata.TFileMetadata> => {
    // Now the uploader only passes new upload requests
    if (newFiles.length === 0) {
      // No new files to process
      return Promise.resolve({} as fileMetadata.TFileMetadata);
    }

    // Step 1: Create processing metadata for new uploads
    const processingMetadata: fileMetadata.TFileMetadata[] = newFiles.map((upload, index) => ({
      id: Date.now() + index, // Unique temporary IDs
      name: upload.name,
      mimeType: upload.file.type || 'image/jpeg',
      size: upload.file.size,
      checksum: 'processing',
      status: 'processing' as const,
      category: 'image' as const,
      url: '',
      thumbnailUrl: '',
    }));

    // Step 2: Add processing files to state immediately
    setFiles(currentFiles => [...currentFiles, ...processingMetadata]);

    // Step 3: Simulate upload process
    return new Promise((resolve) => {
      setTimeout(() => {
        // Step 4: Generate final metadata for each uploaded file
        const finalMetadata = newFiles.map(upload => mockImageResponse(upload.name));

        // Step 5: Replace processing files with final metadata
        setFiles(currentFiles => {
          // Keep non-processing files and replace processing ones
          const nonProcessingFiles = currentFiles.filter(
            f => !processingMetadata.some(p => p.id === f.id)
          );
          return [...nonProcessingFiles, ...finalMetadata];
        });

        // Return the last uploaded file's metadata
        resolve(finalMetadata[finalMetadata.length - 1] || {} as fileMetadata.TFileMetadata);
      }, 2000);
    });
  };

  const handleDelete = (id: number) => {
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id));
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
    maxSize: 10,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    locale: 'de',
  },
};
