import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Uploader,
  UploaderProps,
} from '../lib/components/drag-and-drop-uploader/uploader';
import { fileMetadata } from '@maany_shr/e-class-models';
import { useState } from 'react';

const meta: Meta<typeof Uploader> = {
  title: 'Components/Uploader',
  component: Uploader,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['image', 'video', 'document', 'generic'],
      description: 'Type of files to upload',
    },
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Upload mode - single file or multiple files',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in MB',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Language locale',
    },
  },
} satisfies Meta<typeof Uploader>;

export default meta;
type Story = StoryObj<typeof Uploader>;

// Mock functions for handlers
const mockOnDelete = (id: string) => {
  console.log('Delete file:', id);
};

const mockOnDownload = (id: string) => {
  console.log('Download file:', id);
};

const mockOnFilesChange = async (
  file: fileMetadata.TFileUploadRequest,
  abortSignal?: AbortSignal,
): Promise<fileMetadata.TFileMetadata> => {
  // Simulate upload delay
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 2000);
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Upload cancelled'));
      });
    }
  });

  // Return mock file metadata based on file type
  const baseMetadata = {
    id: crypto.randomUUID(),
    name: file.name,
    mimeType: file.file.type,
    size: file.file.size,
    checksum: 'mock-checksum-' + Date.now(),
    status: 'available' as const,
  };

  if (file.file.type.startsWith('image/')) {
    return {
      ...baseMetadata,
      category: 'image' as const,
      url: URL.createObjectURL(file.file),
      thumbnailUrl: URL.createObjectURL(file.file),
    };
  } else if (file.file.type.startsWith('video/')) {
    return {
      ...baseMetadata,
      category: 'video' as const,
      videoId: Math.floor(Math.random() * 1000).toString(), // ✅ Convertido a string
      thumbnailUrl: 'https://via.placeholder.com/150x100?text=Video+Thumbnail',
    };
  } else if (
    file.file.type === 'application/pdf' ||
    file.name.endsWith('.doc') ||
    file.name.endsWith('.docx')
  ) {
    return {
      ...baseMetadata,
      category: 'document' as const,
      url: URL.createObjectURL(file.file),
    };
  } else {
    return {
      ...baseMetadata,
      category: 'generic' as const,
      url: URL.createObjectURL(file.file),
    };
  }
};

const mockOnUploadComplete = (file: fileMetadata.TFileMetadata) => {
  console.log('Upload complete:', file);
};

// Sample files for pre-populated stories
const sampleImageFile: fileMetadata.TFileMetadata = {
  id: 'sample-image-1',
  name: 'sample-image.jpg',
  mimeType: 'image/jpeg',
  size: 1024 * 500, // 500KB
  checksum: 'sample-checksum-image',
  status: 'available',
  category: 'image',
  url: 'https://via.placeholder.com/300x200?text=Sample+Image',
  thumbnailUrl: 'https://via.placeholder.com/150x100?text=Sample+Image',
};

const sampleVideoFile: fileMetadata.TFileMetadata = {
  id: 'sample-video-1',
  name: 'sample-video.mp4',
  mimeType: 'video/mp4',
  size: 1024 * 1024 * 10, // 10MB
  checksum: 'sample-checksum-video',
  status: 'available',
  category: 'video',
  videoId: '12345', // ✅ Como string directamente
  thumbnailUrl: 'https://via.placeholder.com/300x200?text=Video+Thumbnail',
};

const sampleDocumentFile: fileMetadata.TFileMetadata = {
  id: 'sample-doc-1',
  name: 'sample-document.pdf',
  mimeType: 'application/pdf',
  size: 1024 * 200, // 200KB
  checksum: 'sample-checksum-doc',
  status: 'available',
  category: 'document',
  url: 'https://via.placeholder.com/300x200?text=PDF+Document',
};

const sampleGenericFile: fileMetadata.TFileMetadata = {
  id: 'sample-generic-1',
  name: 'sample-file.txt',
  mimeType: 'text/plain',
  size: 1024 * 5, // 5KB
  checksum: 'sample-checksum-generic',
  status: 'available',
  category: 'generic',
  url: 'https://via.placeholder.com/300x200?text=Text+File',
};

// Sample file with broken thumbnail URL for testing error fallback
const sampleImageFileWithBrokenThumbnail: fileMetadata.TFileMetadata = {
  id: 'sample-image-broken',
  name: 'broken-thumbnail.jpg',
  mimeType: 'image/jpeg',
  size: 1024 * 300, // 300KB
  checksum: 'sample-checksum-broken',
  status: 'available',
  category: 'image',
  url: 'https://via.placeholder.com/300x200?text=Valid+Image',
  thumbnailUrl: 'https://broken-url-that-will-fail.invalid/thumbnail.jpg', // This will fail to load
};

// Interactive wrapper component for stateful stories
const InteractiveUploader = (props: Partial<UploaderProps>) => {
  const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>(
    props.type === 'multiple' && props.files ? props.files : [],
  );
  const [singleFile, setSingleFile] =
    useState<fileMetadata.TFileMetadata | null>(
      props.type === 'single' && props.file ? props.file : null,
    );

  const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
    if (props.type === 'multiple') {
      setFiles((prev) => [...prev, file]);
    } else {
      setSingleFile(file);
    }
    mockOnUploadComplete(file);
  };

  const handleDelete = (id: string) => {
    if (props.type === 'multiple') {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      setSingleFile(null);
    }
    mockOnDelete(id);
  };

  const uploaderProps = {
    maxSize: 5,
    onDelete: handleDelete,
    onDownload: mockOnDownload,
    onFilesChange: mockOnFilesChange,
    onUploadComplete: handleUploadComplete,
    locale: 'en' as const,
    variant: 'generic' as const,
    ...props,
  };

  if (props.type === 'multiple') {
    return (
      <Uploader
        {...uploaderProps}
        type="multiple"
        maxFile={props.maxFile || 3}
        files={files}
      />
    );
  }

  return <Uploader {...uploaderProps} type="single" file={singleFile} />;
};

// Stories for Single File Upload
export const SingleImageUploadEmpty: Story = {
  render: () => (
    <InteractiveUploader type="single" variant="image" file={null} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single image uploader with no files selected',
      },
    },
  },
};

export const SingleImageUploadWithFile: Story = {
  render: () => (
    <InteractiveUploader type="single" variant="image" file={sampleImageFile} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single image uploader with a pre-selected file',
      },
    },
  },
};

export const SingleVideoUpload: Story = {
  render: () => (
    <InteractiveUploader
      type="single"
      variant="video"
      file={null}
      maxSize={20}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single video uploader with larger file size limit (20MB)',
      },
    },
  },
};

export const SingleDocumentUpload: Story = {
  render: () => (
    <InteractiveUploader
      type="single"
      variant="document"
      file={null}
      acceptedFileTypes={['application/pdf', '.doc', '.docx']}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single document uploader accepting PDF, DOC, and DOCX files',
      },
    },
  },
};

export const SingleGenericUpload: Story = {
  render: () => (
    <InteractiveUploader type="single" variant="generic" file={null} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single generic file uploader accepting any file type',
      },
    },
  },
};

// Stories for Multiple File Upload
export const MultipleImageUploadEmpty: Story = {
  render: () => (
    <InteractiveUploader
      type="multiple"
      variant="image"
      maxFile={5}
      files={[]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple image uploader allowing up to 5 files',
      },
    },
  },
};

export const MultipleImageUploadWithFiles: Story = {
  render: () => (
    <InteractiveUploader
      type="multiple"
      variant="image"
      maxFile={5}
      files={[
        sampleImageFile,
        { ...sampleImageFile, id: 'sample-image-2', name: 'another-image.png' },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple image uploader with 2 pre-selected files out of 5 maximum',
      },
    },
  },
};

export const MultipleVideoUpload: Story = {
  render: () => (
    <InteractiveUploader
      type="multiple"
      variant="video"
      maxFile={3}
      files={[]}
      maxSize={50}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple video uploader with larger file size limit (50MB) and max 3 files',
      },
    },
  },
};

export const MultipleDocumentUpload: Story = {
  render: () => (
    <InteractiveUploader
      type="multiple"
      variant="document"
      maxFile={10}
      files={[sampleDocumentFile]}
      acceptedFileTypes={['application/pdf', '.doc', '.docx', '.txt']}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple document uploader with one pre-selected file, accepting various document types',
      },
    },
  },
};

export const MultipleGenericUpload: Story = {
  render: () => (
    <InteractiveUploader
      type="multiple"
      variant="generic"
      maxFile={5}
      files={[sampleGenericFile]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple generic file uploader with one pre-selected file',
      },
    },
  },
};

// Stories for different locales
export const GermanLocale: Story = {
  render: () => (
    <InteractiveUploader
      type="multiple"
      variant="image"
      maxFile={3}
      files={[]}
      locale="de"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Image uploader with German locale',
      },
    },
  },
};

// Story with maximum files reached
export const MaximumFilesReached: Story = {
  render: () => (
    <InteractiveUploader
      type="multiple"
      variant="image"
      maxFile={2}
      files={[
        sampleImageFile,
        { ...sampleImageFile, id: 'sample-image-2', name: 'second-image.jpg' },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple uploader when maximum number of files is reached (drag and drop area hidden)',
      },
    },
  },
};

// Story with small file size limit
export const SmallFileSizeLimit: Story = {
  render: () => (
    <InteractiveUploader
      type="single"
      variant="image"
      file={null}
      maxSize={1} // 1MB limit
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Image uploader with small file size limit (1MB) to test validation',
      },
    },
  },
};

// Story to demonstrate thumbnail error fallback behavior
export const ThumbnailErrorFallback: Story = {
  render: () => (
    <InteractiveUploader
      type="single"
      variant="image"
      file={sampleImageFileWithBrokenThumbnail}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Single image uploader with broken thumbnail URL showing icon fallback behavior',
      },
    },
  },
};

// Comprehensive comparison story
export const UploaderComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Single Image Uploader</h3>
        <InteractiveUploader type="single" variant="image" file={null} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Multiple Image Uploader</h3>
        <InteractiveUploader
          type="multiple"
          variant="image"
          maxFile={3}
          files={[]}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Document Uploader</h3>
        <InteractiveUploader
          type="single"
          variant="document"
          file={null}
          acceptedFileTypes={['application/pdf', '.doc', '.docx']}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Video Uploader</h3>
        <InteractiveUploader
          type="single"
          variant="video"
          file={null}
          maxSize={20}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive comparison showing different uploader variants and types side by side',
      },
    },
  },
};
