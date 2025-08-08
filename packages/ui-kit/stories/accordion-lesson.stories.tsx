import type { Meta, StoryObj } from '@storybook/react';
import { type Descendant } from 'slate';
import { fileMetadata } from '@maany_shr/e-class-models';
import { z } from 'zod';
import accordionElement from '../lib/components/course-builder-lesson-component/accordion-lesson';
import { slateifySerialize } from '../lib/components/rich-text-element/serializer';
import { CourseElementType } from '../lib/components/course-builder/types';
import type { AccordionElement } from '../lib/components/course-builder-lesson-component/types';
import type { DesignerComponentProps } from '../lib/components/course-builder/types';

const meta = {
  title: 'Components/AccordionLesson',
  component: accordionElement.designerComponent,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en'
    }
  }
} satisfies Meta<typeof accordionElement.designerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Image-specific metadata type (iconUrl expects FileMetadataImageSchema)
type TFileMetadataImage = z.infer<typeof fileMetadata.FileMetadataImageSchema>;

// Simple helper to create a demo image icon metadata object
const demoIcon = (id: string): TFileMetadataImage => ({
  id,
  name: 'demo-icon.png',
  mimeType: 'image/png',
  size: 1234,
  category: 'image',
  status: 'available',
  url: 'https://via.placeholder.com/40',
  thumbnailUrl: 'https://via.placeholder.com/40',
  checksum: ''
});

const mockAccordionData = {
  id: 1,
  type: CourseElementType.Accordion,
  order: 1,
  accordionTitle: 'FAQ',
  isChecked: false,
  accordionData: [
    {
      title: "Getting Started",
      content: slateifySerialize("Welcome to the getting started guide."),
      iconUrl: demoIcon('icon-a-1')
    },
    {
      title: "Basic Usage",
      content: slateifySerialize("Learn how to use the basic features."),
      iconUrl: demoIcon('icon-a-2')
    }
  ]
} satisfies AccordionElement;

// Mock async upload handler used by AccordionBuilderEdit. Simply waits and resolves.
const mockUpload: (
  metadata: fileMetadata.TFileUploadRequest,
  signal: AbortSignal
) => Promise<void> = async (metadata, signal) => {
  // Simulate latency & abort support
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => resolve(), 400);
    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
};

export const Primary: Story = {
  args: {
    elementInstance: mockAccordionData,
    locale: 'en',
    onUpClick: (id: number) => console.log('Up clicked', id),
    onDownClick: (id: number) => console.log('Down clicked', id),
    onDeleteClick: (id: number) => console.log('Delete clicked', id),
    onChange: (payload: unknown) => console.log('Designer onChange payload:', payload),
    onImageChange: mockUpload,
    onIconDelete: (id: string) => console.log('Icon delete', id),
    onIconDownload: (id: string) => console.log('Icon download', id)
  } as unknown as DesignerComponentProps
};

export const Empty: Story = {
  args: {
    elementInstance: {
      ...mockAccordionData,
      accordionData: []
    },
    locale: 'en',
    onUpClick: (id: number) => console.log('Up clicked', id),
    onDownClick: (id: number) => console.log('Down clicked', id),
    onDeleteClick: (id: number) => console.log('Delete clicked', id),
    onChange: (payload: unknown) => console.log('Designer onChange payload:', payload),
    onImageChange: mockUpload,
    onIconDelete: (id: string) => console.log('Icon delete', id),
    onIconDownload: (id: string) => console.log('Icon download', id)
  } as unknown as DesignerComponentProps
};

// That's all we need for now!