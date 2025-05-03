import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  FileUploader,
  FileUploaderType,
  UploadResponse,
} from '../lib/components/drag&drop/file-uploader';

const meta: Meta<typeof FileUploader> = {
  title: 'Components/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
  argTypes: {
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

const Template = (args: { type: 'single' | 'multiple'; maxFiles: number }) => {
  const { type = 'multiple', maxFiles = 5 } = args || {};

  const [files, setFiles] = useState<FileUploaderType[]>([]);

  const handleUpload = (newFiles: File[]) => {
    const allowed = Math.max(0, maxFiles - files.length);
    const limitedFiles = newFiles.slice(0, allowed);

    const updatedFiles = limitedFiles.map((file) => ({
      file,
      isUploading: true,
      error: false,
    }));

    setFiles((prev) => [...prev, ...updatedFiles]);

    limitedFiles.forEach(onFileUpload);
  };

  const handleDelete = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File): Promise<UploadResponse> => {
    try {
      await sleep(1500);

      const response: UploadResponse = {
        file_id: Math.random().toString(36).substr(2, 9),
        file_name: file.name,
      };

      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, isUploading: false, imageData: response }
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
    <FileUploader
      {...args}
      files={files}
      onUpload={handleUpload}
      handleDelete={handleDelete}
      maxSize={5}
      onFileUpload={onFileUpload}
      text={{
        title: 'Drop your files here',
        buttontext: 'Choose Files',
        dragtext: 'or drag and drop file here',
        filesize: 'Max size',
        uploading: 'Uploading...',
        cancelUpload: 'Cancel',
        maxFilesReached: 'Maximum file limit reached',
        uploadError: 'Upload failed. Try again.',
      }}
    />
  );
};

export const Default: StoryObj = {
  render: (args) => <Template maxFiles={5} type="multiple" />,
};

export const SingleUpload: StoryObj = {
  args: {
    type: 'single',
  },

  render: (args) => <Template type="single" maxFiles={1} />,
};

export const MaxFilesReached: StoryObj = {
  render: (args) => <Template maxFiles={5} type="multiple" />,
};
