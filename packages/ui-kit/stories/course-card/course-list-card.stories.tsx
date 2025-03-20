import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { CourseCardList } from '../../lib/components/coursecard/course-list-card'; 
import { CourseCardProps } from '../../lib/components/coursecard/course-card'; 

// Sample course data for different user types with various states
const sampleCourses: Record<string, CourseCardProps[]> = {
  creator: [
    {
      course: {
        title: 'Advanced Brand Identity Design',
        description: 'Learn to create powerful brand identities.',
        duration: { video: 240, coaching: 120, selfStudy: 360 },
        pricing: { fullPrice: 299, partialPrice: 149, currency: 'USD' },
        imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
        rating: 4.7,
      },
      userType: 'creator',
      locale: 'en',
      reviewCount: 328,
      language: { code: 'ENG', name: 'English' },
      creatorStatus: 'published',
      sessions: 24,
      sales: 1850,
    },
    {
      course: {
        title: 'UI Design Fundamentals',
        description: 'Master UI design basics.',
        duration: { video: 180, coaching: 60, selfStudy: 240 },
        pricing: { fullPrice: 199, partialPrice: 99, currency: 'USD' },
        imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
        rating: 0,
      },
      userType: 'creator',
      locale: 'en',
      reviewCount: 0,
      language: { code: 'ENG', name: 'English' },
      creatorStatus: 'draft',
      sessions: 15,
      sales: 0,
    },
    {
      course: {
        title: 'Typography Mastery',
        description: 'Learn advanced typography techniques.',
        duration: { video: 200, coaching: 80, selfStudy: 300 },
        pricing: { fullPrice: 249, partialPrice: 129, currency: 'USD' },
        imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
        rating: 0,
      },
      userType: 'creator',
      locale: 'en',
      reviewCount: 0,
      language: { code: 'ENG', name: 'English' },
      creatorStatus: 'under-review',
      sessions: 20,
      sales: 0,
    },
  ],
  coach: [
    {
      course: {
        title: 'Advanced Brand Identity Design',
        description: 'Learn to create powerful brand identities.',
        duration: { video: 240, coaching: 120, selfStudy: 360 },
        imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
        rating: 4.7,
      },
      userType: 'coach',
      locale: 'en',
      reviewCount: 328,
      language: { code: 'ENG', name: 'English' },
      sessions: 24,
      sales: 1850,
      creatorName: 'Emily Chen',
      groupName: 'Design Mastermind',
    },
  ],
  student: [
    {
      course: {
        title: 'Advanced Brand Identity Design',
        description: 'Learn to create powerful brand identities.',
        duration: { video: 240, coaching: 120, selfStudy: 360 },
        imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
        rating: 4.7,
      },
      userType: 'student',
      locale: 'en',
      reviewCount: 328,
      language: { code: 'ENG', name: 'English' },
      sessions: 24,
      sales: 1850,
      progress: 0, // Not started
    },
    {
      course: {
        title: 'Web Design Fundamentals',
        description: 'Master the basics of web design.',
        duration: { video: 180, coaching: 60, selfStudy: 240 },
        imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
        rating: 4.5,
      },
      userType: 'student',
      locale: 'en',
      reviewCount: 156,
      language: { code: 'ENG', name: 'English' },
      sessions: 15,
      sales: 980,
      progress: 46, // In progress
    },
    {
      course: {
        title: 'UI/UX Design Principles',
        description: 'Learn UI/UX design fundamentals.',
        duration: { video: 200, coaching: 80, selfStudy: 300 },
        imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
        rating: 4.8,
      },
      userType: 'student',
      locale: 'en',
      reviewCount: 245,
      language: { code: 'ENG', name: 'English' },
      sessions: 20,
      sales: 1200,
      progress: 100, // Completed
    },
  ],
  visitor: [
    {
      course: {
        title: 'Advanced Brand Identity Design',
        description: 'Learn to create powerful brand identities.',
        duration: { video: 240, coaching: 120, selfStudy: 360 },
        pricing: { fullPrice: 299, partialPrice: 149, currency: 'USD' },
        imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        author: { name: 'Emily Chen', image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg' },
        rating: 4.7,
      },
      userType: 'visitor',
      locale: 'en',
      reviewCount: 328,
      language: { code: 'ENG', name: 'English' },
      sessions: 24,
      sales: 1850,
      creatorName: 'Emily Chen',
    },
  ],
};

const meta: Meta<typeof CourseCardList> = {
  title: 'Components/CourseCardComponents/CourseList',
  component: CourseCardList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    userType: {
      control: 'select',
      options: ['creator', 'coach', 'student', 'visitor'],
      description: 'The type of user viewing the course list',
    },
    courses: {
      control: { type: 'object' },
      description: 'Array of course cards with user-specific properties',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Locale for translations and formatting',
    },
    callbacks: {
      control: { type: 'object' },
      description: 'Callback functions for various course card actions',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CourseCardList>;

// Create a wrapper component that handles the dynamic courses based on userType
const CourseListWrapper = (props: any) => {
  const { userType, locale, args } = props;
  const [displayCourses, setDisplayCourses] = useState<CourseCardProps[]>([]);
  
  useEffect(() => {
    // When userType changes, update the courses to match that user type
    if (userType && sampleCourses[userType]) {
      setDisplayCourses(sampleCourses[userType]);
    } else {
      setDisplayCourses([]);
    }
  }, [userType]);
  
  const createCallback = (message: string) => () => window.alert(message);
  const callbacks = {
    onEdit: createCallback('Edit clicked'),
    onManage: createCallback('Manage clicked'),
    onBegin: createCallback('Begin clicked'),
    onResume: createCallback('Resume clicked'),
    onReview: createCallback('Review clicked'),
    onDetails: createCallback('Details clicked'),
    onBuy: createCallback('Buy clicked'),
    onBrowseCourses: createCallback('Browse Courses clicked'),
  };
  
  return (
    <div className="w-full mx-auto">
      <CourseCardList 
        userType={userType}
        locale={locale}
        callbacks={args.callbacks || callbacks}
        courses={args.courses !== undefined ? args.courses : displayCourses}
      />
    </div>
  );
};

// Template with dynamic courses based on userType selection
export const Interactive: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType={args.userType} 
      locale={args.locale || 'en'} 
      args={args}
    />
  ),
  args: {
    userType: 'creator',
    locale: 'en',
  },
  name: 'Interactive Example',
  parameters: {
    docs: {
      description: {
        story: 'Interactive example that updates course list based on selected user type.',
      },
    },
  },
};

// Stories for each user type with all states
export const CreatorList: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType="creator" 
      locale={args.locale || 'en'} 
      args={{...args, courses: sampleCourses.creator}}
    />
  ),
  args: {
    locale: 'en',
  },
  name: 'Creator List - Published/Draft/Under Review',
  parameters: {
    docs: {
      description: {
        story: 'Displays courses for creators with different states: Published (with sales), Draft (editable), and Under Review (pending approval).',
      },
    },
  },
};

export const CoachList: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType="coach" 
      locale={args.locale || 'en'} 
      args={{...args, courses: sampleCourses.coach}}
    />
  ),
  args: {
    locale: 'en',
  },
  name: 'Coach List',
  parameters: {
    docs: {
      description: {
        story: 'Shows courses from a coach perspective with group information and management options.',
      },
    },
  },
};

export const StudentList: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType="student" 
      locale={args.locale || 'en'} 
      args={{...args, courses: sampleCourses.student}}
    />
  ),
  args: {
    locale: 'en',
  },
  name: 'Student List - Not Started/In Progress/Completed',
  parameters: {
    docs: {
      description: {
        story: 'Displays courses for students with different progress states: Not Started (0%), In Progress (46%), and Completed (100%).',
      },
    },
  },
};

export const VisitorList: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType="visitor" 
      locale={args.locale || 'en'} 
      args={{...args, courses: sampleCourses.visitor}}
    />
  ),
  args: {
    locale: 'en',
  },
  name: 'Visitor List',
  parameters: {
    docs: {
      description: {
        story: 'Shows courses for visitors with purchase options and course details.',
      },
    },
  },
};

// Empty state stories
export const EmptyStateCreator: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType="creator" 
      locale={args.locale || 'en'} 
      args={{...args, courses: []}}
    />
  ),
  args: {
    locale: 'en',
    courses: [],
  },
  name: 'Empty State - Creator',
  parameters: {
    docs: {
      description: {
        story: 'Displays empty state for creators when no courses are available.',
      },
    },
  },
};

export const EmptyStateCoach: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType="coach" 
      locale={args.locale || 'en'} 
      args={{...args, courses: []}}
    />
  ),
  args: {
    locale: 'en',
    courses: [],
  },
  name: 'Empty State - Coach',
  parameters: {
    docs: {
      description: {
        story: 'Displays empty state for coaches when no courses are available.',
      },
    },
  },
};

export const EmptyStateStudent: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType="student" 
      locale={args.locale || 'en'} 
      args={{...args, courses: []}}
    />
  ),
  args: {
    locale: 'en',
    courses: [],
  },
  name: 'Empty State - Student',
  parameters: {
    docs: {
      description: {
        story: 'Displays empty state for students with browse courses option.',
      },
    },
  },
};

export const EmptyStateVisitor: Story = {
  render: (args) => (
    <CourseListWrapper 
      userType="visitor" 
      locale={args.locale || 'en'} 
      args={{...args, courses: []}}
    />
  ),
  args: {
    locale: 'en',
    courses: [],
  },
  name: 'Empty State - Visitor',
  parameters: {
    docs: {
      description: {
        story: 'Displays empty state for visitors with browse courses option.',
      },
    },
  },
};