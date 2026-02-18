import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { DesignerComponent, FormComponent, DownloadFilesDesignerProps } from '../../lib/components/course-builder-lesson-component/download-files-lesson';
import { CourseElementType } from '../../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof DesignerComponent> = {
  title: 'Components/CourseBuilder/DownloadFiles',
  component: DesignerComponent,
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Language locale',
    },
    files: {
      description: 'Array of file metadata for multiple file upload mode',
    },
    elementInstance: {
      description: 'The instance of the download files element',
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed (default: 5)',
      defaultValue: 5,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample files for pre-populated stories - following the structure from uploader.stories.tsx
const samplePDFFile: fileMetadata.TFileMetadata = {
  id: 'sample-pdf-1',
  name: 'sample-document.pdf',
  mimeType: 'application/pdf',
  size: 1024 * 500, // 500KB
  checksum: 'sample-checksum-pdf',
  status: 'available',
  category: 'document',
  url: 'https://via.placeholder.com/300x200?text=PDF+Document',
};

const samplePPTFile: fileMetadata.TFileMetadata = {
  id: 'sample-ppt-1',
  name: 'presentation.pptx',
  mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  size: 1024 * 1024 * 2, // 2MB
  checksum: 'sample-checksum-ppt',
  status: 'available',
  category: 'document',
  url: 'https://via.placeholder.com/300x200?text=PowerPoint+Presentation',
};

const sampleImageFile: fileMetadata.TFileMetadata = {
  id: 'sample-image-1',
  name: 'sample-image.jpg',
  mimeType: 'image/jpeg',
  size: 1024 * 300, // 300KB
  checksum: 'sample-checksum-image',
  status: 'available',
  category: 'image',
  url: 'https://via.placeholder.com/300x200?text=Sample+Image',
  thumbnailUrl: 'https://via.placeholder.com/150x100?text=Sample+Image',
};

const sampleTextFile: fileMetadata.TFileMetadata = {
  id: 'sample-text-1',
  name: 'instructions.txt',
  mimeType: 'text/plain',
  size: 1024 * 5, // 5KB
  checksum: 'sample-checksum-text',
  status: 'available',
  category: 'generic',
  url: 'https://via.placeholder.com/300x200?text=Text+File',
};

// Mock files collection
const mockFiles: fileMetadata.TFileMetadata[] = [
  samplePDFFile,
  samplePPTFile,
];

// Mock file upload handler with proper structure and simulated delay
const mockOnFilesUpload = async (
  fileRequest: fileMetadata.TFileUploadRequest,
  abortSignal?: AbortSignal
): Promise<fileMetadata.TFileMetadata> => {
  // Simulate upload delay
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 1500);
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Upload cancelled'));
      });
    }
  });

  // Create appropriate metadata based on file type
  const baseMetadata = {
    id: crypto.randomUUID(),
    name: fileRequest.name,
    mimeType: fileRequest.file.type,
    size: fileRequest.file.size,
    checksum: 'mock-checksum-' + Date.now(),
    status: 'available' as const,
  };

  if (fileRequest.file.type.startsWith('image/')) {
    return {
      ...baseMetadata,
      category: 'image' as const,
      url: URL.createObjectURL(fileRequest.file),
      thumbnailUrl: URL.createObjectURL(fileRequest.file),
    };
  } else if (fileRequest.file.type.startsWith('video/')) {
    return {
      ...baseMetadata,
      category: 'video' as const,
      videoId: Math.floor(Math.random() * 1000),
      thumbnailUrl: 'https://via.placeholder.com/150x100?text=Video+Thumbnail',
    };
  } else if (
    fileRequest.file.type === 'application/pdf' ||
    fileRequest.name.endsWith('.doc') ||
    fileRequest.name.endsWith('.docx')
  ) {
    return {
      ...baseMetadata,
      category: 'document' as const,
      url: URL.createObjectURL(fileRequest.file),
    };
  } else {
    return {
      ...baseMetadata,
      category: 'generic' as const,
      url: URL.createObjectURL(fileRequest.file),
    };
  }
};

// Interactive Designer story with state management
const DesignerWithState = (args: Partial<DownloadFilesDesignerProps>) => {
  const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>(args.files || []);
  const [elementInstance, setElementInstance] = useState({
    ...args.elementInstance,
    files: (args.elementInstance as any)?.files || []
  });

  const handleFilesUpload = async (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ): Promise<fileMetadata.TFileMetadata | null> => {
    console.log('Upload requested:', fileRequest);
    try {
      const result = await mockOnFilesUpload(fileRequest, abortSignal);
      setFiles((prev) => [...prev, result]);
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleFileDelete = (id: string) => {
    console.log('Delete file:', id);
    setFiles((prev) => prev.filter((file) => file.id !== id));
    setElementInstance((prev) => ({
      ...prev,
      files: (prev.files || []).filter((file) => file.id !== id),
    }));
  };

  const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
    console.log('Upload complete:', file);
    setElementInstance((prev) => ({
      ...prev,
      files: [...(prev.files || []), file],
    }));
  };

  const handleFileDownload = (id: string) => {
    console.log('Download file:', id);
    alert(`Downloading file with ID: ${id}`);
  };

  return (
    <DesignerComponent
      locale={args.locale || 'en'}
      {...args}
      files={files}
      elementInstance={elementInstance}
      onFilesUpload={handleFilesUpload}
      onFileDelete={handleFileDelete}
      onUploadComplete={handleUploadComplete}
      onFileDownload={handleFileDownload}
      maxFiles={args.maxFiles}
    />
  );
};

// Interactive Form component with state management
const FormWithState = (args) => {
  const handleDownload = (id: string) => {
    console.log('Download file from form view:', id);
    const file = args.elementInstance?.files?.find(f => f.id === id);

    if (file && file.url) {
      console.log(`Downloading file from ${file.url}`);

      // For demo purposes, open the URL in a new tab if it's a valid URL
      if (file.url.startsWith('http') || file.url.startsWith('blob:')) {
        window.open(file.url, '_blank');
      }
    }
  };

  return (
    <FormComponent
      elementInstance={args.elementInstance}
      locale={args.locale}
      onDownload={handleDownload}
    />
  );
};


export const DesignerWithFiles: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.DownloadFiles,
      files: [],
      order: 1,
    },
    locale: 'en',
    onUpClick: () => console.log('Up clicked'),
    onDownClick: () => console.log('Down clicked'),
    onDeleteClick: () => console.log('Delete clicked'),
    files: [samplePDFFile, sampleImageFile],
  },
  render: (args) => <DesignerWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Designer component with pre-populated files',
      },
    },
  },
};

export const GermanLocaleDesigner: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.DownloadFiles,
      files: [],
      order: 1,
    },
    locale: 'de',
    onUpClick: () => console.log('Up clicked'),
    onDownClick: () => console.log('Down clicked'),
    onDeleteClick: () => console.log('Delete clicked'),
    files: [],
  },
  render: (args) => <DesignerWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Designer component with German locale',
      },
    },
  },
};

export const MaxFilesDesigner: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.DownloadFiles,
      files: [],
      order: 1,
    },
    locale: 'en',
    onUpClick: () => console.log('Up clicked'),
    onDownClick: () => console.log('Down clicked'),
    onDeleteClick: () => console.log('Delete clicked'),
    files: [samplePDFFile, samplePPTFile, sampleImageFile, sampleTextFile, {
      ...samplePDFFile,
      id: 'sample-pdf-2',
      name: 'another-document.pdf'
    }],
    maxFiles: 5,
  },
  render: (args) => <DesignerWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Designer with maximum number of files (5) uploaded',
      },
    },
  },
};

export const CustomMaxFilesDesigner: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.DownloadFiles,
      files: [],
      order: 1,
    },
    locale: 'en',
    onUpClick: () => console.log('Up clicked'),
    onDownClick: () => console.log('Down clicked'),
    onDeleteClick: () => console.log('Delete clicked'),
    files: [samplePDFFile, sampleImageFile],
    maxFiles: 3,
  },
  render: (args) => <DesignerWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Designer with custom maximum number of files (3) - demonstrates flexibility',
      },
    },
  },
};

export const EmptyFormView: Story = {
  args: {
    elementInstance: {
      id: 2,
      type: CourseElementType.DownloadFiles,
      files: [],
      order: 1,
    },
    locale: 'en',
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form view with no files to display',
      },
    },
  },
};

export const FormViewWithFiles: Story = {
  args: {
    elementInstance: {
      id: 2,
      type: CourseElementType.DownloadFiles,
      files: mockFiles,
      order: 1,
    },
    locale: 'en',
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form view with downloadable files displayed',
      },
    },
  },
};

export const FormViewWithMixedFiles: Story = {
  args: {
    elementInstance: {
      id: 2,
      type: CourseElementType.DownloadFiles,
      files: [samplePDFFile, sampleImageFile, sampleTextFile],
      order: 1,
    },
    locale: 'en',
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form view with different types of downloadable files (PDF, image, text)',
      },
    },
  },
};

export const GermanLocaleFormView: Story = {
  args: {
    elementInstance: {
      id: 2,
      type: CourseElementType.DownloadFiles,
      files: mockFiles,
      order: 1,
    },
    locale: 'de',
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form view with German locale',
      },
    },
  },
};
