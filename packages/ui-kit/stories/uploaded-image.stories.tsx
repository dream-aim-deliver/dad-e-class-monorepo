import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UploadedImage } from '../lib/components/drag&drop/uploaded-image';

export type FileType = {
  file: File;
  isUploading: boolean;
};

const meta: Meta<typeof UploadedImage> = {
  title: 'Components/UploadedImage',
  component: UploadedImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// Wrapper Component for State Management
const UploadedImageWrapper: React.FC = () => {
  const [files, setFiles] = useState<FileType[]>([]);

  const handleUpload = (newFiles: File[]) => {
    const updatedFiles = [
      ...files,
      ...newFiles.map((file) => ({ file, isUploading: false })),
    ];
    setFiles(updatedFiles);
  };

  const handleDelete = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <UploadedImage
      files={files}
      onUpload={handleUpload}
      handleDelete={handleDelete}
      className=""
      text={{
        title: 'Drop your images here',
        buttontext: 'Choose Images',
        dragtext: 'or drag and drop images here',
        filesize: 'Max size',
        uploading: 'Uploading...',
        cancelUpload: 'Cancel',
      }}
    />
  );
};

// Default Story
export const Default: StoryObj = {
  render: () => <UploadedImageWrapper />,
};
