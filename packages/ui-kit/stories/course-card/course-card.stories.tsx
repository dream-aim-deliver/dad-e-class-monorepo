import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourseCard } from '../../lib/components/course-card/course-card';

const sampleCourseData = {
  id: 'course-123',
  title: 'Advanced Brand Identity Design',
  description: [
    {
      type: 'paragraph',
      children: [
        { text: 'This course teaches you how to create powerful, cohesive brand identities that resonate with audiences and stand out in the marketplace.' }
      ],
    },
  ],
  duration: {
    video: 240,
    coaching: 120,
    selfStudy: 360,
  },
  pricing: {
    fullPrice: 299,
    partialPrice: 149,
    currency: 'USD',
  },
  imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  author: {
    name: 'Emily Chen',
    image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  },
  language: {
    code: 'ENG' as const,
    name: 'English' as const,
  },
  groupName: 'Design Professionals',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rating: 4.7,
};

const meta: Meta<typeof CourseCard> = {
  title: 'Components/CourseCardComponents/CourseCard',
  component: CourseCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    userType: {
      control: 'select',
      options: ['course_creator', 'coach', 'student', 'visitor'],
      description: 'Type of user viewing the course card',
    },
    course: {
      control: 'object',
      description: 'Course metadata object',
    },
    reviewCount: {
      control: 'number',
      description: 'Number of reviews for the course',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Locale for translations',
    },
    language: {
      control: 'object',
      description: 'Language of the course content',
    },
    creatorStatus: {
      control: 'select',
      options: ['live', 'draft', 'archived'],
      if: { arg: 'userType', eq: 'course_creator' },
      description: 'Status of the course for creator view',
    },
    progress: {
      control: 'number',
      min: 0,
      max: 100,
      if: { arg: 'userType', eq: 'student' },
      description: 'Progress percentage (0-100) - Controls studyProgress state: 0=yet-to-start, 1-99=in-progress, 100=completed',
    },
    sessions: {
      control: 'number',
      description: 'Number of sessions (required for creator, coach, visitor)',
    },
    sales: {
      control: 'number',
      description: 'Number of course sales (required for all user types)',
    },
    groupName: {
      control: 'text',
      description: 'Name of the group/cohort (optional for coach)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onEdit: {
      action: 'edit-clicked',
      description: 'Callback for edit action (creator)',
    },
    onBegin: {
      action: 'begin-clicked',
      description: 'Callback for begin action (student)',
    },
    onResume: {
      action: 'resume-clicked',
      description: 'Callback for resume action (student)',
    },
    onReview: {
      action: 'review-clicked',
      description: 'Callback for review action (student)',
    },
    onDetails: {
      action: 'details-clicked',
      description: 'Callback for details action (student, visitor)',
    },
    onBuy: {
      action: 'buy-clicked',
      description: 'Callback for buy action (visitor)',
    },
  },
};

export default meta;

const Template: StoryObj<typeof CourseCard> = {
  render: (args) => {
    const createCallback = (message: string) => () => window.alert(message);
    return (
      <CourseCard
        {...args}
        onEdit={createCallback('Edit clicked')}
        onBegin={createCallback('Begin clicked')}
        onResume={createCallback('Resume clicked')}
        onReview={createCallback('Review clicked')}
        onDetails={createCallback('Details clicked')}
        onBuy={createCallback('Buy clicked')}
        onClickUser={createCallback('Author clicked')}

      />
    );
  },
};

type Story = StoryObj<typeof CourseCard>;

// Creator view stories
export const CreatorLiveView: Story = {
  ...Template,
  args: {
    userType: 'course_creator',
    reviewCount: 328,
    locale: 'en',
    language: sampleCourseData.language,
    creatorStatus: 'live',
    course: sampleCourseData,
    sessions: 24,
    sales: 1850,
    className: 'max-w-[352px]',
  },
  parameters: {
    docs: {
      description: {
        story: 'A live/published course card for a creator with sample course data.',
      },
    },
  },
};

export const CreatorDraftView: Story = {
  ...Template,
  args: {
    userType: 'course_creator',
    reviewCount: 250,
    locale: 'en',
    language: sampleCourseData.language,
    creatorStatus: 'draft',
    course: {
      ...sampleCourseData,
      title: 'New Course (Draft)',
    },
    sessions: 10,
    sales: 10,
    className: 'max-w-[352px]',
  },
};

export const CreatorArchivedView: Story = {
  ...Template,
  args: {
    userType: 'course_creator',
    reviewCount: 10,
    locale: 'en',
    language: sampleCourseData.language,
    creatorStatus: 'archived',
    course: {
      ...sampleCourseData,
      title: 'Archived Course',
    },
    sessions: 15,
    sales: 10,
    className: 'max-w-[352px]',
  },
};

// Coach view stories
export const CoachView: Story = {
  ...Template,
  args: {
    userType: 'coach',
    reviewCount: 328,
    locale: 'en',
    language: sampleCourseData.language,
    course: sampleCourseData,
    sessions: 24,
    sales: 1850,
    groupName: 'Advanced Design Cohort',
    className: 'max-w-[352px]',
    onClickUser: () => alert('Author clicked'),
  },
};

// Student view stories
// studyProgress is computed from progress: 0 = 'yet-to-start', 1-99 = 'in-progress', 100 = 'completed'
export const StudentYetToStartedView: Story = {
  ...Template,
  args: {
    userType: 'student',
    reviewCount: 328,
    sales: 1850,
    locale: 'en',
    language: sampleCourseData.language,
    course: sampleCourseData,
    progress: 0, // studyProgress: 'yet-to-start' - shows description and "Begin" button
    className: 'max-w-[352px]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Student view with progress=0. StudyProgress: "yet-to-start". Shows course description and "Begin Course" button.',
      },
    },
  },
};

export const StudentInProgressView: Story = {
  ...Template,
  args: {
    userType: 'student',
    reviewCount: 328,
    sales: 1850,
    locale: 'en',
    language: sampleCourseData.language,
    course: sampleCourseData,
    progress: 42, // studyProgress: 'in-progress' - shows progress bar and "Resume" button
    className: 'max-w-[352px]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Student view with progress=42 (1-99). StudyProgress: "in-progress". Shows progress bar and "Resume Course" button.',
      },
    },
  },
};

export const StudentCompletedView: Story = {
  ...Template,
  args: {
    userType: 'student',
    reviewCount: 328,
    sales: 1850,
    locale: 'en',
    language: sampleCourseData.language,
    course: sampleCourseData,
    progress: 100, // studyProgress: 'completed' - shows "Review" button
    className: 'max-w-[352px]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Student view with progress=100. StudyProgress: "completed". Shows "Review Course" button.',
      },
    },
  },
};

// Visitor view stories
export const VisitorView: Story = {
  ...Template,
  args: {
    userType: 'visitor',
    reviewCount: 328,
    locale: 'en',
    language: sampleCourseData.language,
    course: sampleCourseData,
    sales: 1850,
    sessions: 24,
    groupName: 'Design Professionals',
    className: 'max-w-[352px]',
  },
};

// German locale examples
export const GermanCreatorView: Story = {
  ...Template,
  args: {
    ...CreatorLiveView.args,
    locale: 'de',
  },
};

export const GermanStudentView: Story = {
  ...Template,
  args: {
    ...StudentInProgressView.args,
    locale: 'de',
  },
};

export const GermanCoachView: Story = {
  ...Template,
  args: {
    ...CoachView.args,
    locale: 'de',
  },
};

export const GermanVisitorView: Story = {
  ...Template,
  args: {
    ...VisitorView.args,
    locale: 'de',
  },
};