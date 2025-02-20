import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UploadedFile } from '../lib/components/drag&drop/uploaded-file';

export type FileType = {
  file: File;
  isUploading: boolean;
};

const meta: Meta<typeof UploadedFile> = {
  title: 'Components/UploadedFile',
  component: UploadedFile,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// Wrapper Component for State Management
const UploadedFileWrapper: React.FC = () => {
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
    <UploadedFile
      files={files}
      onUpload={handleUpload}
      handleDelete={handleDelete}
      className=""
      text={{
        title: 'Drop your files here',
        buttontext: 'Choose Files',
        dragtext: 'or drag and drop files here',
        filesize: 'Max size',
        uploading: 'Uploading...',
        cancelUpload: 'Cancel',
      }}
    />
  );
};

// Default Story
export const Default: StoryObj = {
  render: () => <UploadedFileWrapper />,
};
