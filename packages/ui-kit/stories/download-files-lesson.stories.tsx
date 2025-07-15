import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DesignerComponent } from '../lib/components/course-builder-lesson-component/download-files-lesson';
import { CourseElementType } from '../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof DesignerComponent> = {
  title: 'Components/CourseBuilder/DownloadFiles',
  component: DesignerComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    elementInstance: {
      id: 1,
      type: CourseElementType.DownloadFiles,
      files: [],
      order: 1,
    },
    locale: 'en',
    onUpClick: () => console.log('Up clicked'),
    onDownClick: () => console.log('Down clicked'),
    onDeleteClick: () => console.log('Delete clicked'),
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
  },
};
