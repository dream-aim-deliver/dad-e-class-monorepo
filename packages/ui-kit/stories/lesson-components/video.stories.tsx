import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { courseElements } from '../../lib/components/course-builder/course-builder-core';
import { CourseElementType } from '../../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';
import { VideoElement as VideoFileType } from '../../lib/components/course-builder-lesson-component/types';

// Get components from courseElements
const { designerComponent: DesignerComponent, formComponent: FormComponent } =
  courseElements[CourseElementType.VideoFile];

type VideoFileWithMetadata = VideoFileType & fileMetadata.TFileMetadata;

// Define the props for our stories
interface StoryProps {
  locale: 'en' | 'de';
  elementInstance: VideoFileType;
  initialFile?: VideoFileWithMetadata | null;
}

const meta: Meta<StoryProps> = {
  title: 'Components/CourseBuilder/Video Uploader',
  component: DesignerComponent as unknown as React.ComponentType<StoryProps>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Language locale (en/de)',
    },
    elementInstance: {
      control: 'object',
      description: 'Course element instance',
    },
    initialFile: {
      control: 'object',
      description: 'Initial file to display',
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const defaultElementInstance: VideoFileType = {
  id: '1',
  type: CourseElementType.VideoFile,
  order: 1,
  category: 'video',
};

// Mock file data
const mockFile: VideoFileWithMetadata = {
  id: 'file-123',
  name: 'sample-video.mp4',
  mimeType: 'video/mp4',
  size: 50 * 1024 * 1024, // 50MB
  checksum: 'mock-checksum',
  status: 'available',
  category: 'video',
  videoId: 'uNbxnGLKJ00yfbijDO8COxTOyVKT01xpxW',
  thumbnailUrl: 'https://via.placeholder.com/600x400',
  type: CourseElementType.VideoFile,
  order: 1,
};

// Mock upload function that simulates an API call
const mockUpload = async (): Promise<VideoFileWithMetadata> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFile);
    }, 1000);
  });
};

// Create a wrapper component that uses hooks
const VideoUploaderWrapper = (args: StoryProps) => {
  const [file, setFile] = useState<VideoFileWithMetadata | null>(
    args.initialFile || null,
  );

  const handleUpload = async (fileRequest: fileMetadata.TFileUploadRequest) => {
    console.log('Uploading video...', fileRequest);
    const uploadedFile = await mockUpload();
    return uploadedFile;
  };

  const handleUploadComplete = (uploadedFile: VideoFileWithMetadata) => {
    console.log('Upload complete:', uploadedFile);
    setFile(uploadedFile);
  };

  const handleDelete = () => {
    console.log('File deleted');
    setFile(null);
  };

  // Create props object that matches the DesignerComponent's expected props
  const componentProps = {
    elementInstance: args.elementInstance,
    file: file,
    onVideoUpload: handleUpload,
    onUploadComplete: handleUploadComplete,
    onFileDelete: handleDelete,
    onFileDownload: () => alert('Download file'),
    onUpClick: () => alert('Move up clicked'),
    onDownClick: () => alert('Move down clicked'),
    onDeleteClick: () => alert('Delete clicked'),
    locale: args.locale,
    maxSize: 100, // Set a maximum size for the video upload
  };

  return (
    <div style={{ width: '800px' }}>
      <DesignerComponent {...componentProps} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <VideoUploaderWrapper {...args} />,
  args: {
    locale: 'en',
    elementInstance: defaultElementInstance,
    initialFile: null,
  },
};

// Story with a pre-uploaded video
export const WithVideo: Story = {
  render: (args) => <VideoUploaderWrapper {...args} />, // Use the wrapper for hooks
  args: {
    ...Default.args,
    initialFile: mockFile,
  },
};

// Story with German locale
export const GermanLocale: Story = {
  render: (args) => <VideoUploaderWrapper {...args} />,
  args: {
    ...Default.args,
    locale: 'de',
  },
};

// Story for the form component
export const FormView: Story = {
  render: (args) => (
    <div style={{ width: '800px' }}>
      <FormComponent
        elementInstance={{
          ...defaultElementInstance,
          ...args.initialFile,
        }}
        locale={args.locale}
      />
    </div>
  ),
  args: {
    locale: 'en',
    initialFile: mockFile,
  },
};
