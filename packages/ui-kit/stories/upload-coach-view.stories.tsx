import { Meta, StoryObj } from '@storybook/react';
import UploadCoachView from '../lib/components/upload-coach-view';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof UploadCoachView> = {
  title: 'Components/UploadCoachView',
  component: UploadCoachView,
};

export default meta;
type Story = StoryObj<typeof UploadCoachView>;

const mockFiles: fileMetadata.TFileMetadata[] = [
  {
    id: '1',
    name: 'student-assignment.pdf',
    size: 123456,
    mimeType: 'application/pdf',
  },
  {
    id: '2',
    name: 'project-presentation.pptx',
    size: 789012,
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  },
];

export const Default: Story = {
  args: {
    files: mockFiles,
    comment: 'Here are my files for the assignment. Please let me know if you have any feedback.',
    locale: 'en',
    onDownload: (fileId) => alert(`Downloading file with id: ${fileId}`),
  },
};

export const NoFiles: Story = {
  args: {
    files: [],
    comment: 'I have not uploaded any files yet.',
    locale: 'en',
    onDownload: (fileId) => alert(`Downloading file with id: ${fileId}`),
  },
};

export const NoComment: Story = {
  args: {
    files: mockFiles,
    comment: '',
    locale: 'en',
    onDownload: (fileId) => alert(`Downloading file with id: ${fileId}`),
  },
};
