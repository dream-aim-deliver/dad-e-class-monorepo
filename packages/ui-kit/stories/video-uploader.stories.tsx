import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  VideoUploader,
  VideoType,
  VideoUploadResponse,
} from '../lib/components/drag&drop/video-uploader'; // updated path and component

const meta: Meta<typeof VideoUploader> = {
  title: 'Components/VideoUploader',
  component: VideoUploader,
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en',
    },
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      defaultValue: 'multiple',
    },
    filesCount: {
      control: { type: 'number', min: 1, max: 10 },
      defaultValue: 5,
    },
  },
};

export default meta;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Define the type for the Template args
type TemplateArgs = {
  type: 'single' | 'multiple';
  filesCount: number;
  locale: 'en' | 'de';
};

const Template = (args: TemplateArgs) => {
  const [files, setFiles] = useState<VideoType[]>([]);

  const handleDelete = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onVideoUpload = async (file: File): Promise<VideoUploadResponse> => {
    try {
      // First add the file to the state with isUploading=true
      const newFile = {
        file,
        isUploading: true,
        error: false,
      };

      setFiles((prev) => [...prev, newFile]);

      // Simulate upload delay
      await sleep(1500);

      const response: VideoUploadResponse = {
        video_id: Math.random().toString(36).substr(2, 9),
        thumbnail_url: URL.createObjectURL(file),
      };

      // Update the file state after upload completes
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, isUploading: false, videoData: response }
            : f,
        ),
      );

      return response;
    } catch (e) {
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file ? { ...f, isUploading: false, error: true } : f,
        ),
      );
      throw e;
    }
  };

  return (
    <VideoUploader
      type={args.type}
      filesCount={args.filesCount}
      locale={args.locale}
      files={files}
      onDownload={(file) => handleDownload(file)}
      onDelete={handleDelete}
      maxSize={50}
      onVideoUpload={onVideoUpload}
    />
  );
};

// Define your stories using the Template
export const Default: StoryObj<TemplateArgs> = {
  args: {
    type: 'multiple',
    filesCount: 5,
    locale: 'en',
  },
  render: (args) => <Template {...args} />,
};

export const SingleUpload: StoryObj<TemplateArgs> = {
  args: {
    type: 'single',
    filesCount: 1,
    locale: 'en',
  },
  render: (args) => <Template {...args} />,
};

export const GermanLocale: StoryObj<TemplateArgs> = {
  args: {
    type: 'multiple',
    filesCount: 5,
    locale: 'de',
  },
  render: (args) => <Template {...args} />,
};