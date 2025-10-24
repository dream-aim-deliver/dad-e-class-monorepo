import type { Meta, StoryObj } from '@storybook/react';
import { GroupsList } from '../../lib/components/groups-card/groups-list';

const meta: Meta<typeof GroupsList> = {
  title: 'Components/Groups/GroupsList',
  component: GroupsList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    isAdmin: {
      control: 'boolean',
    },
    joinGroupVariant: {
      control: 'select',
      options: ['empty', 'already-has-coach'],
    },
    isValidating: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GroupsList>;

const sampleGroups = [
  {
    groupName: 'JavaScript Fundamentals',
    currentStudents: 12,
    totalStudents: 20,
    course: {
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      title: 'Learn the basics of JavaScript programming',
      slug: 'javascript-fundamentals',
    },
    coach: {
      name: 'You',
      isCurrentUser: true, // This will show in both tabs with manage button
    },
  },
  {
    groupName: 'Advanced React Patterns',
    currentStudents: 8,
    totalStudents: 15,
    course: {
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      title: 'Master advanced React concepts and patterns',
      slug: 'advanced-react',
    },
    creator: {
      name: 'Sarah Johnson',
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
    // No coach defined - shows only in "All Groups" tab
  },
  {
    groupName: 'Full-Stack Development',
    currentStudents: 15,
    totalStudents: 18,
    course: {
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      title: 'Complete web development with React and Node.js',
      slug: 'full-stack-development',
    },
    coach: {
      name: 'You',
      isCurrentUser: true, // Another group where current user is coach
    },
  },
  {
    groupName: 'UI/UX Design Principles',
    currentStudents: 20,
    totalStudents: 20,
    course: {
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      title: 'Learn design thinking and user experience principles',
      slug: 'ui-ux-design',
    },
    creator: {
      name: 'Jessica Wilson',
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    groupName: 'Web Performance Optimization',
    currentStudents: 6,
    totalStudents: 12,
    course: {
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      title: 'Optimize your web applications for speed and performance',
      slug: 'web-performance',
    },
    creator: {
      name: 'Performance Expert',
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    groupName: 'API Development & Testing',
    currentStudents: 14,
    totalStudents: 22,
    course: {
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      title: 'Learn to build and test RESTful APIs',
      slug: 'api-development',
    },
    creator: {
      name: 'David Chen',
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
  {
    groupName: 'Cloud Computing Essentials',
    currentStudents: 22,
    totalStudents: 30,
    course: {
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      title: 'Learn AWS, Azure, and Google Cloud Platform fundamentals',
      slug: 'cloud-computing',
    },
    coach: {
      name: 'You',
      isCurrentUser: true, // Third group where current user is coach
    },
  },
  {
    groupName: 'Machine Learning Basics',
    currentStudents: 14,
    totalStudents: 20,
    course: {
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
      title: 'Introduction to ML algorithms and Python libraries',
      slug: 'machine-learning',
    },
    creator: {
      name: 'Dr. Sarah Thompson',
      image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    },
  },
];

export const AdminView: Story = {
  args: {
    isAdmin: true,
    locale: 'en',
    allGroups: sampleGroups,
    joinGroupVariant: 'empty',
    couponCode: '',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => console.log('Validate code clicked'),
    onClickCourse: (slug: string) => console.log('Course clicked:', slug),
    onClickManage: (groupId: string) => console.log('Manage clicked for:', groupId),
    onClickViewProfile: (groupId: string) => console.log('View profile clicked for:', groupId),
    isValidating: false,
    isLoading: false,
  },
};

export const YourGroupsEmpty: Story = {
  args: {
    isAdmin: false,
    locale: 'en',
    allGroups: sampleGroups.filter(group => group.coach?.isCurrentUser !== true), // Groups without current user as coach
    joinGroupVariant: 'empty',
    couponCode: '',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => console.log('Validate code clicked'),
    onClickCourse: (slug: string) => console.log('Course clicked:', slug),
    onClickViewProfile: (groupId: string) => console.log('View profile clicked for:', groupId),
    isValidating: false,
    isLoading: false,
  },
};

export const German: Story = {
  args: {
    isAdmin: false,
    locale: 'de',
    allGroups: sampleGroups,
    joinGroupVariant: 'empty',
    couponCode: '',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => console.log('Validate code clicked'),
    onClickCourse: (slug: string) => console.log('Course clicked:', slug),
    onClickViewProfile: (groupId: string) => console.log('View profile clicked for:', groupId),
    isValidating: false,
    isLoading: false,
  },
};