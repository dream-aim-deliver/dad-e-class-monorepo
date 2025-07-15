import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FormComponent } from '../lib/components/course-builder-lesson-component/upload-files-lesson';
import { CourseElementType } from '../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof FormComponent> = {
  title: 'Components/CourseBuilder/UploadFiles',
  component: FormComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.UploadFiles,
      description: 'Please upload your assignment.',
      order: 1,
    },
    locale: 'en',
    onFilesUpload: async (
      fileRequest: fileMetadata.TFileUploadRequest
    ): Promise<fileMetadata.TFileMetadata | null> => {
      console.log('Upload complete:', fileRequest);
      return null;
    },
    onFileDelete: (id: string) => {
      console.log('Delete file:', id);
    },
    onFileDownload: (id: string) => {
      console.log('Download file:', id);
    },
    onStudentCommentChange: (comment: string) => {
      console.log('Student comment:', comment);
    },
  },
};
