import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CoachList from '../lib/components/coach/coach-card-list';
import { CoachCardDetails } from '../lib/components/coach/coach-card';

const meta: Meta<typeof CoachList> = {
  title: 'Components/CoachList',
  component: CoachList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    onClickBookSession: { action: 'booked session' },
    onClickViewProfile: { action: 'viewed profile' },
  },
};

export default meta;
type Story = StoryObj<typeof CoachList>;

// Sample coach data
const sampleCoaches: CoachCardDetails[] = [
  {
    coachName: 'Jessica Thompson',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'Spanish'],
    sessionCount: 156,
    skills: ['React', 'JavaScript', 'UI/UX Design'],
    description:
      'Experienced frontend developer specializing in React and modern JavaScript frameworks. Strong focus on creating intuitive user interfaces.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Advanced React Patterns',
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'JavaScript Fundamentals',
      },
    ],
    rating: 4.8,
    totalRatings: 47,
  },
  {
    coachName: 'Michael Chen',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'Mandarin'],
    sessionCount: 98,
    skills: ['Python', 'Data Science', 'Machine Learning'],
    description:
      'Data scientist with expertise in Python and machine learning algorithms. Passionate about helping others understand complex concepts.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Python for Data Analysis',
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Intro to Machine Learning',
      },
    ],
    rating: 4.6,
    totalRatings: 32,
  },
  {
    coachName: 'Sophia Rodriguez',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'French'],
    sessionCount: 213,
    skills: ['Product Management', 'Agile', 'Leadership','Product Management', 'Agile', 'Leadership','Product Management', 'Agile', 'Leadership'],
    description:
      'Product manager with over 10 years of experience in tech companies. Expert in agile methodologies and team leadership.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Agile Product Management',
      },
      { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Leadership Skills' },
    ],
    rating: 4.9,
    totalRatings: 78,
  },
  {
    coachName: 'David Williams',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'French'],
    sessionCount: 67,
    skills: ['UX Research', 'Design Thinking', 'Prototyping'],
    description:
      'UX designer focused on user-centered approaches and accessible design principles. Specializes in research methods and rapid prototyping.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'UX Research Methods',
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Design Thinking Workshop',
      },
    ],
    rating: 4.5,
    totalRatings: 21,
  },
  {
    coachName: 'Aisha Patel',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'Hindi'],
    sessionCount: 124,
    skills: ['Backend Development', 'Node.js', 'Database Design'],
    description:
      'Backend developer with a strong focus on scalable architecture and database optimization. Expert in Node.js and SQL.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Node.js API Development',
      },
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Database Design Principles',
      },
    ],
    rating: 4.7,
    totalRatings: 39,
  },
  {
    coachName: 'Thomas Johnson',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'German'],
    sessionCount: 82,
    skills: ['DevOps', 'Cloud Infrastructure', 'CI/CD'],
    description:
      'DevOps engineer specializing in cloud infrastructure and automated deployment pipelines. AWS certified and experienced with Kubernetes.',
    courses: [
      {
        image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Introduction to DevOps',
      },
      { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'AWS for Developers' },
    ],
    rating: 4.8,
    totalRatings: 28,
  },
];

export const Default: Story = {
  args: {
    coaches: sampleCoaches,
    locale: 'en',
    title: 'Coaching On Demand',
  },
};

export const FewCoaches: Story = {
  args: {
    coaches: sampleCoaches.slice(0, 3),
    locale: 'en',
  },
};

export const GermanLocale: Story = {
  args: {
    coaches: sampleCoaches,
    locale: 'de',
  },
};

export const MobileView: Story = {
  args: {
    coaches: sampleCoaches,
    locale: 'de',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  args: {
    coaches: sampleCoaches,
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};


