import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourseCompletionModal } from '../lib/components/course-completion-modal';

const meta: Meta<typeof CourseCompletionModal> = {
  title: 'Components/CourseCompletionModal',
  component: CourseCompletionModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en',
      description: 'The language locale for translations',
    },
    courseImage: {
      control: 'text',
      description: 'URL of the course image',
    },
    courseTitle: {
      control: 'text',
      description: 'Title of the completed course',
    },
    completionDate: {
      control: 'date',
      description: 'Date and time when the course was completed',
    },
    onClickDownloadCertificate: {
      action: 'download-certificate-clicked',
      description: 'Callback when "Download Certificate" is clicked',
    },
    onClickRateCourse: {
      action: 'rate-course-clicked',
      description: 'Callback when "Rate the Course" is clicked',
    },
    onClose: {
      action: 'close-modal-clicked',
      description: 'Callback when modal is closed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CourseCompletionModal>;

const mockDate = '2024-05-15T15:30:00Z';

const mockData = {
  courseImage:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  courseTitle: 'Introduction to Artificial Intelligence',
  completionDate: mockDate,
  onClickDownloadCertificate: () => alert('Download Certificate clicked'),
  onClickRateCourse: () => alert('Rate Course clicked'),
  onClose: () => alert('Close modal clicked'),
  locale: 'en',
};

export const Default: Story = {
  args: {
    ...mockData,
    locale: 'en',
  },
};

export const WithGermanLocale: Story = {
  args: {
    ...mockData,
    locale: 'de',
    courseTitle: 'Einführung in Künstliche Intelligenz',
  },
};

export const NoImage: Story = {
  args: {
    ...mockData,
    courseImage: '',
    locale: 'en',
  },
};

export const LongTitle: Story = {
  args: {
    ...mockData,
    courseTitle:
      'Introduction to Artificial Intelligence: A Comprehensive Guide to Modern Machine Learning, Deep Learning, and Data Science Applications',
    locale: 'en',
  },
};
