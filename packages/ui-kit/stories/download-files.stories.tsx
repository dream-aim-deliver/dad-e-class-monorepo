import type { Meta, StoryObj } from '@storybook/react';
import downloadFilesElement, { FormComponent } from '../lib/components/course-builder-lesson-component//download-files';
import { CourseElementType } from '../lib/components/course-builder/types';

// Stories for the Designer Component
const meta: Meta<typeof downloadFilesElement.designerComponent> = {
  title: 'Components/Course-builder/DownloadFiles',
  component: downloadFilesElement.designerComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof downloadFilesElement.designerComponent>;

export const EmptyDesigner: Story = {
  args: {
    elementInstance: {
      id: '1',
      type: CourseElementType.DownloadFiles,
      order: 1,
      fileUrls: [],
    },
    locale: 'en',
    onUpClick: (id: string) => console.log('Up clicked', id),
    onDownClick: (id: string) => console.log('Down clicked', id),
    onDeleteClick: (id: string) => console.log('Delete clicked', id),
  },
};

export const WithFilesDesigner: Story = {
  args: {
    elementInstance: {
      id: '2',
      type: CourseElementType.DownloadFiles,
      order: 2,
      fileUrls: [
        {
          fileName: 'example-document.pdf',
          fileSize: 1024 * 1024 * 2.5, // 2.5MB
          url: 'https://example.com/document.pdf'
        },
        {
          fileName: 'presentation.pptx',
          fileSize: 1024 * 1024 * 5.7, // 5.7MB
          url: 'https://example.com/presentation.pptx'
        }
      ],
    },
    locale: 'en',
    onUpClick: (id: string) => console.log('Up clicked', id),
    onDownClick: (id: string) => console.log('Down clicked', id),
    onDeleteClick: (id: string) => console.log('Delete clicked', id),
  },
};

// Stories for the Form Component
const formMeta: Meta<typeof FormComponent> = {
  title: 'Course/Download Files/Form',
  component: FormComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export const EmptyForm: StoryObj<typeof FormComponent> = {
  args: {
    elementInstance: {
      id: '1',
      type: CourseElementType.DownloadFiles,
      order: 1,
      fileUrls: [],
    },
    locale: 'en',
  },
};

export const WithFilesForm: StoryObj<typeof FormComponent> = {
  args: {
    elementInstance: {
      id: '2',
      type: CourseElementType.DownloadFiles,
      order: 2,
      fileUrls: [
        {
          fileName: 'example-document.pdf',
          fileSize: 1024 * 1024 * 2.5, // 2.5MB
          url: 'https://example.com/document.pdf'
        },
        {
          fileName: 'presentation.pptx',
          fileSize: 1024 * 1024 * 5.7, // 5.7MB
          url: 'https://example.com/presentation.pptx'
        }
      ],
    },
    locale: 'en',
  },
};

export const SingleFileForm: StoryObj<typeof FormComponent> = {
  args: {
    elementInstance: {
      id: '3',
      type: CourseElementType.DownloadFiles,
      order: 3,
      fileUrls: [
        {
          fileName: 'large-document.pdf',
          fileSize: 1024 * 1024 * 15.8, // 15.8MB
          url: 'https://example.com/large-document.pdf'
        }
      ],
    },
    locale: 'en',
  },
};

export const GermanLocaleForm: StoryObj<typeof FormComponent> = {
  args: {
    elementInstance: {
      id: '4',
      type: CourseElementType.DownloadFiles,
      order: 4,
      fileUrls: [
        {
          fileName: 'dokument.pdf',
          fileSize: 1024 * 1024 * 3.2, // 3.2MB
          url: 'https://example.com/dokument.pdf'
        }
      ],
    },
    locale: 'de',
  },
};