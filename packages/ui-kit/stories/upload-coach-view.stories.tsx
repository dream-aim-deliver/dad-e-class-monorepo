import { Meta, StoryObj } from '@storybook/react-vite';
import UploadCoachView from '../lib/components/upload-coach-view';
import { fileMetadata } from '@maany_shr/e-class-models';

/**
 * Stories for the UploadCoachView component
 * 
 * This component displays files uploaded by students for coaches to review and download,
 * along with any comments provided by the student.
 */
const meta: Meta<typeof UploadCoachView> = {
  title: 'Components/UploadCoachView',
  component: UploadCoachView,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de', 'fr', 'es'],
      description: 'The locale to use for translations',
    },
  },
};

export default meta;
type Story = StoryObj<typeof UploadCoachView>;

const mockFiles: fileMetadata.TFileMetadata[] = [
  {
    id: '1',
    name: 'student-assignment.pdf',
    size: 2512896, // ~2.5 MB
    mimeType: 'application/pdf',
  },
  {
    id: '2',
    name: 'project-presentation.pptx',
    size: 4862310, // ~4.8 MB
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  },
];

const mockDiverseFiles: fileMetadata.TFileMetadata[] = [
  {
    id: '1',
    name: 'research-paper.pdf',
    size: 3407872, // ~3.4 MB
    mimeType: 'application/pdf',
  },
  {
    id: '2',
    name: 'data-analysis.xlsx',
    size: 1572864, // ~1.5 MB
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    id: '3',
    name: 'project-video.mp4',
    size: 15728640, // ~15 MB
    mimeType: 'video/mp4',
  },
  {
    id: '4',
    name: 'code-sample.zip',
    size: 8388608, // ~8 MB
    mimeType: 'application/zip',
  },
];

export const Default: Story = {
  args: {
    files: mockFiles,
    comment: 'Here are my files for the assignment. Please let me know if you have any feedback.',
    locale: 'en',
    createdAt: '2024-07-23T23:31:00Z',
    onDownload: (fileId) => alert(`Downloading file with ID: ${fileId}`),
  },
};

export const MultipleFileTypes: Story = {
  args: {
    files: mockDiverseFiles,
    comment: "I have included various file types for my submission, including the research paper, data analysis spreadsheet, project video demonstration, and source code archive.",
    locale: 'en',
    createdAt: '2024-08-01T14:25:00Z',
    onDownload: (fileId) => alert(`Downloading file with ID: ${fileId}`),
  },
};

export const NoFiles: Story = {
  args: {
    files: [],
    comment: 'I have not uploaded any files yet.',
    locale: 'en',
    createdAt: '2024-07-15T09:45:00Z',
    onDownload: (fileId) => alert(`Downloading file with ID: ${fileId}`),
  },
};

export const NoComment: Story = {
  args: {
    files: mockFiles,
    comment: '',
    locale: 'en',
    createdAt: '2024-06-30T16:20:00Z',
    onDownload: (fileId) => alert(`Downloading file with ID: ${fileId}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows "No student comment" when no comment is provided.'
      }
    }
  }
};

export const GermanLocale: Story = {
  args: {
    files: mockFiles,
    comment: 'Hier sind meine Dateien für die Aufgabe. Bitte lassen Sie mich wissen, wenn Sie Feedback haben.',
    locale: 'de',
    createdAt: '2024-08-05T11:15:00Z',
    onDownload: (fileId) => alert(`Downloading file with ID: ${fileId}`),
  },
};
