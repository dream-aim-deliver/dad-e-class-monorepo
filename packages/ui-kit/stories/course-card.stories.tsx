import type { Meta, StoryObj } from '@storybook/react';
import {CourseCard} from '../lib/components/coursecard/course-card';

const sampleCourseData = {
  id: 'course-123',
  title: 'Advanced Brand Identity Design',
  description: 'This course teaches you how to create powerful, cohesive brand identities that resonate with audiences and stand out in the marketplace.',
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
    code: "ENG" as const,
    name: "English" as const,
  },
  groupName: 'Design Professionals',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
      options: ['creator', 'coach', 'student', 'visitor'],
      description: 'Type of user viewing the course card',
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
      options: ['draft', 'under-review', 'published'],
      if: { arg: 'userType', eq: 'creator' },
      description: 'Status of the course for creator view',
    },
    progress: { 
      control: 'number',
      min: 0,
      max: 100,
      if: { arg: 'userType', eq: 'student' },
      description: 'Progress percentage for student view',
    },
    sessions: { 
      control: 'number',
      description: 'Number of sessions in the course',
    },
    sales: { 
      control: 'number',
      description: 'Number of course sales',
    },
    groupName: { 
      control: 'text',
      description: 'Name of the group/cohort',
    },
    className: { 
      control: 'text',
      description: 'Additional CSS classes',
    },
    courses: {
      control: 'object',
      description: 'Array of courses to check if there are any courses',
    },
    showEmptyState: {
      control: 'boolean',
      description: 'Flag to explicitly show the empty state',
    },
    onBrowseCourses: {
      action: 'browseCourses',
      description: 'Callback when the browse courses button is clicked in empty state',
    }
  }
};

export default meta;
type Story = StoryObj<typeof CourseCard>;

// Creator view stories
export const CreatorPublishedView: Story = {
  args: {
    userType: 'creator',
    reviewCount: 328, 
    locale: 'en',
    language: sampleCourseData.language,
    creatorStatus: 'published',
    course: { ...sampleCourseData,
      rating: 4.7,
    },
    sessions: 24,
    sales: 1850,
    onEdit: () => console.log('Edit course clicked'),
    onManage: () => console.log('Manage course clicked'),
    className: 'max-w-[352px]',
    courses: [sampleCourseData],
  },
};

export const CreatorDraftView: Story = {
  args: {
    ...CreatorPublishedView.args,
    creatorStatus: 'draft',
    course: {
      ...sampleCourseData,
      title: 'New Course (Draft)',
    },
    reviewCount: 250,
    sales: 10,
    sessions: 10,
  },
};

export const CreatorUnderReviewView: Story = {
  args: {
    ...CreatorPublishedView.args,
    creatorStatus: 'under-review',
    course: {
      ...sampleCourseData,
      title: 'Course Under Review',
    },
    reviewCount: 10,
    sales: 10,
  },
};

// Coach view stories
export const CoachView: Story = {
  args: {
    userType: 'coach',
    reviewCount: 328,
    locale: 'en',
    language: sampleCourseData.language,
    course: { ...sampleCourseData,
      rating: 4.7,
    },
    sessions: 24,
    sales: 1850,
    groupName: 'Advanced Design Cohort',
    onManage: () => console.log('Manage course clicked'),
    className: 'max-w-[352px]',
    courses: [sampleCourseData],
  },
};

// Student view stories
export const StudentYetToStartedView: Story = {
  args: {
    userType: 'student',
    reviewCount: 328,
    locale: 'en',
    language: sampleCourseData.language,
    course: { ...sampleCourseData,
      rating: 4.7,
    },
    sales: 1850,
    progress: 0,
    onBegin: () => console.log('Begin course clicked'),
    onDetails: () => console.log('Course details clicked'),
    className: 'max-w-[352px]',
    courses: [sampleCourseData],
  },
};

export const StudentInProgressView: Story = {
  args: {
    ...StudentYetToStartedView.args,
    sales: 1850,
    progress: 42,
    onResume: () => console.log('Resume course clicked'),
    onDetails: () => console.log('Course details clicked'),
  },
};

export const StudentCompletedView: Story = {
  args: {
    ...StudentYetToStartedView.args,
    sales: 1850,
    progress: 100,
    onReview: () => console.log('Review course clicked'),
    onDetails: () => console.log('Course details clicked'),
  },
};

// Visitor view stories
export const VisitorView: Story = {
  args: {
    userType: 'visitor',
    reviewCount: 328,
    locale: 'en',
    language: sampleCourseData.language,
    course: { ...sampleCourseData,
      rating: 4.7,
    },
    sales: 1850,
    sessions: 24,
    groupName: 'Design Professionals',
    className: 'max-w-[352px]',
    courses: [sampleCourseData],
  },
};

// German locale examples
export const GermanCreatorView: Story = {
  args: {
    ...CreatorPublishedView.args,
    locale: 'de',
  },
};

export const GermanStudentView: Story = {
  args: {
    ...StudentInProgressView.args,
    locale: 'de',
  },
};

export const GermanCoachView: Story = {
  args: {
    ...CoachView.args,
    locale: 'de',
  },
};

export const GermanVisitorView: Story = {
  args: {
    ...VisitorView.args,
    locale: 'de',
  },
};

// Empty state stories
export const EmptyStateCreator: Story = {
  args: {
    userType: 'creator',
    reviewCount: 0,
    locale: 'en',
    language: sampleCourseData.language,
    courses: [],
    onBrowseCourses: () => console.log('Browse courses clicked'),
    className: 'max-w-[352px]',
  },
};

export const EmptyStateStudent: Story = {
  args: {
    userType: 'student',
    reviewCount: 0,
    locale: 'en',
    language: sampleCourseData.language,
    courses: [],
    onBrowseCourses: () => console.log('Browse courses clicked'),
    className: 'max-w-[352px]',
  },
};

export const EmptyStateCoach: Story = {
  args: {
    userType: 'coach',
    reviewCount: 0,
    locale: 'en',
    language: sampleCourseData.language,
    courses: [],
    onBrowseCourses: () => console.log('Browse courses clicked'),
    className: 'max-w-[352px]',
  },
};

export const EmptyStateVisitor: Story = {
  args: {
    userType: 'visitor',
    reviewCount: 0,
    locale: 'en',
    language: sampleCourseData.language,
    courses: [],
    onBrowseCourses: () => console.log('Browse courses clicked'),
    className: 'max-w-[352px]',
  },
};

export const GermanEmptyState: Story = {
  args: {
    ...EmptyStateStudent.args,
    locale: 'de',
  },
};
