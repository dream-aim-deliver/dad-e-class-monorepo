import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileSelector, FileSelectorProps } from '@/components/file-Display';

const StatefulFileSelector = (args: FileSelectorProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    args.onUpload?.(file); // Trigger the action for logging in Storybook
  };

  const handleDownload = () => {
    if (uploadedFile) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(uploadedFile);
      link.download = uploadedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      args.onDownload?.(); // Trigger the action for logging in Storybook
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    args.onRemove?.(); // Trigger the action for logging in Storybook
  };

  return (
    <FileSelector
      {...args}
      defaultFile={uploadedFile ? uploadedFile.name : ''}
      onUpload={handleUpload}
      onDownload={handleDownload}
      onRemove={handleRemove}
    />
  );
};

const meta: Meta<typeof FileSelector> = {
  title: 'Components/FileSelector',
  component: FileSelector,
  tags: ['autodocs'],
  argTypes: {
    defaultFile: {
      control: { type: 'text' },
      description: 'The default file name to display.',
    },
    maxSizeInMB: {
      control: { type: 'number' },
      description: 'Maximum file size allowed in MB.',
    },
    acceptedFileTypes: {
      control: { type: 'object' },
      description: 'Array of accepted MIME types for file upload.',
    },
    onUpload: {
      action: 'onUpload',
      description: 'Callback triggered when a file is uploaded.',
    },
    onDownload: {
      action: 'onDownload',
      description: 'Callback triggered when a file is downloaded.',
    },
    onRemove: {
      action: 'onRemove',
      description: 'Callback triggered when a file is removed.',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FileSelector>;

export const Default: Story = {
  render: (args) => <StatefulFileSelector {...args} />,
  args: {
    maxSizeInMB: 10,
    acceptedFileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
};
