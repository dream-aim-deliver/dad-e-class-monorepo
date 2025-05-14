import type { Meta, StoryObj } from '@storybook/react';
import downloadFilesElement, { FormComponent } from '../lib/components/course-builder-lesson-component/download-files';
import { CourseElementType } from '../lib/components/course-builder/types';

const meta: Meta<typeof downloadFilesElement.designerComponent> = {
  title: 'Components/Course-builder/DownloadFiles',
  component: downloadFilesElement.designerComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'DownloadFiles component allows users to upload and manage downloadable files in a course.'
      }
    }
  },
  argTypes: {
    elementInstance: { control: 'object' },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en'
    },
    onUpClick: { action: 'upClick' },
    onDownClick: { action: 'downClick' },
    onDeleteClick: { action: 'deleteClick' }
  }
};

export default meta;
type Story = StoryObj<typeof downloadFilesElement.designerComponent>;

// Designer Component Stories
export const EmptyDesigner: Story = {
  args: {
    elementInstance: {
      id: '1',
      type: CourseElementType.DownloadFiles,
      order: 1,
      files: []
    },
    locale: 'en',
    onUpClick: (id: string) => console.log('Up clicked', id),
    onDownClick: (id: string) => console.log('Down clicked', id),
    onDeleteClick: (id: string) => console.log('Delete clicked', id),
  },
};

export const WithFiles: Story = {
  args: {
    elementInstance: {
      id: '2',
      type: CourseElementType.DownloadFiles,
      order: 2,
      files: [
        {
          fileId: 'file-1',
          fileName: 'document.pdf',
          fileSize: 1024 * 1024 * 2.5 // 2.5MB
        },
        {
          fileId: 'file-2',
          fileName: 'presentation.pptx',
          fileSize: 1024 * 1024 * 5.7 // 5.7MB
        }
      ]
    },
    locale: 'en',
    onUpClick: (id: string) => console.log('Up clicked', id),
    onDownClick: (id: string) => console.log('Down clicked', id),
    onDeleteClick: (id: string) => console.log('Delete clicked', id),
  },
};

export const GermanLocale: Story = {
  args: {
    elementInstance: {
      id: '3',
      type: CourseElementType.DownloadFiles,
      order: 3,
      files: []
    },
    locale: 'de',
    onUpClick: (id: string) => console.log('Up clicked', id),
    onDownClick: (id: string) => console.log('Down clicked', id),
    onDeleteClick: (id: string) => console.log('Delete clicked', id),
  },
};

// Form Component Stories
export const FormView: StoryObj<typeof FormComponent> = {
  render: (args) => <FormComponent {...args} />,
  args: {
    elementInstance: {
      id: '4',
      type: CourseElementType.DownloadFiles,
      order: 4,
      fileUrls: [
        {
          // Regular file
          fileId: 'file-1',
          fileName: 'example-document.pdf',
          fileSize: 1024 * 1024 * 2.5, // 2.5MB
        },
        {
          // Image file
          imageId: 'image-1',
          imageThumbnailUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          fileSize: 1024 * 1024 * 1.8, // 1.8MB
        },
        {
          // Video file
          videoId: 'video-1',
          thumbnailUrl: 'https://via.placeholder.com/150',
          fileSize: 1024 * 1024 * 15.5, // 15.5MB
        }
      ],
    },
    locale: 'en',
  },
};

export const FormViewWithMixedFiles: StoryObj<typeof FormComponent> = {
  render: (args) => <FormComponent {...args} />,
  args: {
    elementInstance: {
      id: '5',
      type: CourseElementType.DownloadFiles,
      order: 5,
      fileUrls: [
        {
          // Multiple images
          imageId: 'image-2',
          imageThumbnailUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          fileSize: 1024 * 1024 * 3.2, // 3.2MB
        },
        {
          imageId: 'image-3',
          imageThumbnailUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          fileSize: 1024 * 1024 * 2.1, // 2.1MB
        },
        {
          // Video file
          videoId: 'video-2',
          thumbnailUrl: 'https://via.placeholder.com/150',
          fileSize: 1024 * 1024 * 25.7, // 25.7MB
        },
        {
          // Regular files
          fileId: 'file-2',
          fileName: 'presentation.pptx',
          fileSize: 1024 * 1024 * 5.7, // 5.7MB
        },
        {
          fileId: 'file-3',
          fileName: 'document.docx',
          fileSize: 1024 * 1024 * 1.2, // 1.2MB
        }
      ],
    },
    locale: 'en',
  },
};

export const FormViewGermanLocale: StoryObj<typeof FormComponent> = {
  render: (args) => <FormComponent {...args} />,
  args: {
    elementInstance: {
      id: '6',
      type: CourseElementType.DownloadFiles,
      order: 6,
      fileUrls: [
        {
          imageId: 'image-4',
          imageThumbnailUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          fileSize: 1024 * 1024 * 1.5, // 1.5MB
        },
        {
          videoId: 'video-3',
          thumbnailUrl: 'https://via.placeholder.com/150',
          fileSize: 1024 * 1024 * 18.3, // 18.3MB
        },
        {
          fileId: 'file-4',
          fileName: 'dokument.pdf',
          fileSize: 1024 * 1024 * 3.4, // 3.4MB
        }
      ],
    },
    locale: 'de',
  },
};