import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { DesignerComponent, FormComponent, UploadFilesFormProps } from '../../lib/components/course-builder-lesson-component/upload-files-lesson';
import { CourseElementType } from '../../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof FormComponent> = {
  title: 'Components/CourseBuilder/UploadFiles',
  component: FormComponent,
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Language locale',
    },
    files: {
      description: 'Array of file metadata for uploaded files',
    },
    elementInstance: {
      description: 'The instance of the upload files element',
    },
    onStudentCommentChange: {
      description: 'Callback function triggered when student comment changes',
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample files for pre-populated stories
const samplePDFFile: fileMetadata.TFileMetadata = {
  id: 'sample-pdf-1',
  name: 'assignment-1.pdf',
  mimeType: 'application/pdf',
  size: 1024 * 500, // 500KB
  checksum: 'sample-checksum-pdf',
  status: 'available',
  category: 'document',
  url: 'https://via.placeholder.com/300x200?text=PDF+Assignment',
};

const sampleDocFile: fileMetadata.TFileMetadata = {
  id: 'sample-doc-1',
  name: 'report.docx',
  mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  size: 1024 * 300, // 300KB
  checksum: 'sample-checksum-doc',
  status: 'available',
  category: 'document',
  url: 'https://via.placeholder.com/300x200?text=Word+Document',
};

const sampleImageFile: fileMetadata.TFileMetadata = {
  id: 'sample-image-1',
  name: 'diagram.jpg',
  mimeType: 'image/jpeg',
  size: 1024 * 200, // 200KB
  checksum: 'sample-checksum-image',
  status: 'available',
  category: 'image',
  url: 'https://via.placeholder.com/300x200?text=Sample+Diagram',
  thumbnailUrl: 'https://via.placeholder.com/150x100?text=Sample+Diagram',
};

const sampleZipFile: fileMetadata.TFileMetadata = {
  id: 'sample-zip-1',
  name: 'project-files.zip',
  mimeType: 'application/zip',
  size: 1024 * 1024 * 2, // 2MB
  checksum: 'sample-checksum-zip',
  status: 'available',
  category: 'generic',
  url: 'https://via.placeholder.com/300x200?text=ZIP+Archive',
};

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

// Interactive Designer component with state management
const DesignerWithState = (args) => {
  const [description, setDescription] = useState(args.elementInstance?.description || '');

  const handleDescriptionChange = (newDescription: string) => {
    console.log('Description changed:', newDescription);
    setDescription(newDescription);
  };

  return (
    <DesignerComponent
      {...args}
      elementInstance={{
        ...args.elementInstance,
        description
      }}
      onChange={handleDescriptionChange}
    />
  );
};

// Interactive Form component with state management
const FormWithState = (args: Partial<UploadFilesFormProps>) => {
  const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>(args.files || []);
  const [studentComment, setStudentComment] = useState('');

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
  };

  const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
    console.log('Upload complete:', file);
  };

  const handleFileDownload = (id: string) => {
    console.log('Download file:', id);
    alert(`Downloading file with ID: ${id}`);
  };

  const handleStudentCommentChange = (comment: string) => {
    console.log('Student comment:', comment);
    setStudentComment(comment);
  };

  return (
    <FormComponent
      {...args}
      locale='en'
      elementInstance={args.elementInstance}
      files={files}
      onFilesUpload={handleFilesUpload}
      onFileDelete={handleFileDelete}
      onUploadComplete={handleUploadComplete}
      onFileDownload={handleFileDownload}
      onStudentCommentChange={handleStudentCommentChange}
    />
  );
};

// Designer component stories
export const Designer: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.UploadFiles,
      description: 'Please upload your assignment.',
      order: 1,
    },
    locale: 'en',
  },
  render: (args) => (
    <DesignerWithState
      {...args}
      onUpClick={() => alert('Up clicked')}
      onDownClick={() => alert('Down clicked')}
      onDeleteClick={() => alert('Delete clicked')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Designer component for configuring upload files element',
      },
    },
  },
};

export const DesignerGermanLocale: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.UploadFiles,
      description: 'Bitte laden Sie Ihre Aufgabe hoch.',
      order: 1,
    },
    locale: 'de',
  },
  render: (args) => (
    <DesignerWithState
      {...args}
      onUpClick={() => console.log('Up clicked')}
      onDownClick={() => console.log('Down clicked')}
      onDeleteClick={() => console.log('Delete clicked')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Designer component with German locale',
      },
    },
  },
};

// Form component stories
export const EmptyForm: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.UploadFiles,
      description: 'Please upload your assignment.',
      order: 1,
    },
    locale: 'en',
    files: [],
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form component with no uploaded files',
      },
    },
  },
};

export const FormWithUploadedFiles: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.UploadFiles,
      description: 'Please upload your assignment.',
      order: 1,
    },
    locale: 'en',
    files: [samplePDFFile, sampleImageFile],
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form component with pre-uploaded files',
      },
    },
  },
};

export const FormMaxFiles: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.UploadFiles,
      description: 'Please upload all project files.',
      order: 1,
    },
    locale: 'en',
    files: [samplePDFFile, sampleDocFile, sampleImageFile, sampleZipFile, {
      ...samplePDFFile,
      id: 'sample-pdf-2',
      name: 'assignment-2.pdf'
    }],
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form component with maximum number of files uploaded (5)',
      },
    },
  },
};

export const FormGermanLocale: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.UploadFiles,
      description: 'Bitte laden Sie Ihre Aufgabe hoch.',
      order: 1,
    },
    locale: 'de',
    files: [samplePDFFile],
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form component with German locale',
      },
    },
  },
};

export const FormWithLongDescription: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.UploadFiles,
      description: 'Please upload your final project files. Make sure to include all source code, documentation, and any additional resources that were used in the development process. The submission should be complete and follow the formatting guidelines provided in the course syllabus.',
      order: 1,
    },
    locale: 'en',
    files: [],
  },
  render: (args) => <FormWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Form component with a long description text',
      },
    },
  },
};
