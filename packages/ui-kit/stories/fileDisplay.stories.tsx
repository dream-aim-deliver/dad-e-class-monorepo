import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileSelector, FileSelectorProps } from '@/components/file-display';

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
  render: (args) => <FileSelector {...args} />,
  args: {
    maxSizeInMB: 10,
    acceptedFileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
};
