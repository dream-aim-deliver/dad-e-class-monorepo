import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  ImageUploader,
  ImageUploadedType,
  ImageUploadResponse,
} from '../lib/components/drag&drop/image-uploader';

const meta: Meta<typeof ImageUploader> = {
  title: 'Components/ImageUploader',
  component: ImageUploader,
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
    maxFiles: {
      control: { type: 'number', min: 1, max: 10 },
      defaultValue: 5,
    },
  },
};

export default meta;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Define the type for Template args
type TemplateArgs = {
  type: 'single' | 'multiple';
  maxFiles: number;
  locale: 'en' | 'de';
};

const Template = (args: TemplateArgs) => {
  const [files, setFiles] = useState<ImageUploadedType[]>([]);

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

  const onImageUpload = async (file: File): Promise<ImageUploadResponse> => {
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

      const response: ImageUploadResponse = {
        image_id: Math.random().toString(36).substr(2, 9),
        image_thumbnail_url: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
      };

      // Update the file state after upload completes
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, isUploading: false, imageData: response } // Fixed property name from videoData to imageData
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
    <ImageUploader
      type={args.type}
      maxFiles={args.maxFiles}
      locale={args.locale}
      files={files}
      handleDelete={handleDelete}
      onDownload={(file) => handleDownload(file)}
      maxSize={5}
      onImageUpload={onImageUpload}
    />
  );
};

export const Default: StoryObj<TemplateArgs> = {
  args: {
    type: 'multiple',
    maxFiles: 5,
    locale: 'en',
  },
  render: (args) => <Template {...args} />,
};

export const SingleUpload: StoryObj<TemplateArgs> = {
  args: {
    type: 'single',
    maxFiles: 1,
    locale: 'en',
  },
  render: (args) => <Template {...args} />,
};

export const GermanLocale: StoryObj<TemplateArgs> = {
  args: {
    type: 'multiple',
    maxFiles: 5,
    locale: 'de',
  },
  render: (args) => <Template {...args} />,
};

export const MaxFilesReached: StoryObj<TemplateArgs> = {
  args: {
    type: 'multiple',
    maxFiles: 2, // Setting a lower value to demonstrate "max files reached" state
    locale: 'en',
  },
  render: (args) => <Template {...args} />,
};