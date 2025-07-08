import type { Meta, StoryObj } from '@storybook/react';
import {
  YourStudentCard,
  YourStudentCardProps,
} from '../../lib/components/student-card/your-students-card';

type MockAccordionContent = {
  type: string;
  children: { text: string }[];
};

type MockAccordionItem = {
  title: string;
  content: MockAccordionContent[];
  position?: number;};

const accordionData = {
  title: 'Course Modules',
  items: [
    {
      title: 'Introduction to Branding',
      content: 'Welcome to the branding course!',
      position: 1,
    },
    {
      title: 'Logo Design',
      content: 'Learn to create a logo that communicates identity.',
      position: 2,
    },
  ],
};

const meta: Meta<typeof YourStudentCard> = {
  title: 'Components/StudentCard/YourStudentCard',
  component: YourStudentCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Locale for translations',
    },
    status: {
      control: 'select',
      options: ['default', 'long-wait', 'waiting-feedback', 'course-completed'],
    },
    coachingSessionsLeft: {
      control: { type: 'number', min: 0 },
      description: 'Number of coaching sessions left',
    },
    completedCourseDate: {
      control: 'date',
      description: 'Date when course was completed',
    },
    studentName: {
      control: 'text',
      description: 'Name of the student',
    },
    studentImageUrl: {
      control: 'text',
      description: 'Image URL of the student',
    },
    courseName: {
      control: 'text',
      description: 'Name of the course',
    },
    courseImageUrl: {
      control: 'text',
      description: 'Image URL of the course',
    },
    assignmentTitle: {
      control: 'text',
      description: 'Title of the assignment (optional)',
    },
    onStudentDetails: { action: 'onStudentDetails' },
    onClickCourse: { action: 'onClickCourse' },
    onViewAssignment: { action: 'onViewAssignment' },
  },
};

export default meta;
type Story = StoryObj<typeof YourStudentCard>;

const baseArgs: YourStudentCardProps = {
  locale: 'en',
  status: 'default',
  studentName: 'Alice Smith',
  studentImageUrl:
    'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
  courseName: 'Branding Basics',
  courseImageUrl:
    'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
  assignmentTitle: 'Create a brand identity',
  onStudentDetails: () => alert('Student details clicked'),
  onClickCourse: () => alert('Course clicked'),
  onViewAssignment: () => alert('View assignment clicked'),
  accordionData,
};

export const Default: Story = {
  args: {
    ...baseArgs,
    status: 'default',
  },
};

export const WaitingFeedback: Story = {
  args: {
    ...baseArgs,
    status: 'waiting-feedback',
  },
};

export const LongWait: Story = {
  args: {
    ...baseArgs,
    status: 'long-wait',
  },
};

export const CourseCompleted: Story = {
  args: {
    ...baseArgs,
    status: 'course-completed',
    completedCourseDate: new Date(),
  },
};

export const WithCoachingSessionsLeft: Story = {
  args: {
    ...baseArgs,
    coachingSessionsLeft: 6,
  },
};
