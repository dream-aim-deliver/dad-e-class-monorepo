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
    coachImage: 'https://i.pravatar.cc/150?img=1',
    languages: ['English', 'Spanish'],
    sessionCount: 156,
    skills: ['React', 'JavaScript', 'UI/UX Design'],
    description:
      'Experienced frontend developer specializing in React and modern JavaScript frameworks. Strong focus on creating intuitive user interfaces.',
    courses: [
      {
        image: 'https://i.pravatar.cc/50?img=10',
        title: 'Advanced React Patterns',
      },
      {
        image: 'https://i.pravatar.cc/50?img=11',
        title: 'JavaScript Fundamentals',
      },
    ],
    rating: 4.8,
    totalRatings: 47,
  },
  {
    coachName: 'Michael Chen',
    coachImage: 'https://i.pravatar.cc/150?img=3',
    languages: ['English', 'Mandarin'],
    sessionCount: 98,
    skills: ['Python', 'Data Science', 'Machine Learning'],
    description:
      'Data scientist with expertise in Python and machine learning algorithms. Passionate about helping others understand complex concepts.',
    courses: [
      {
        image: 'https://i.pravatar.cc/50?img=12',
        title: 'Python for Data Analysis',
      },
      {
        image: 'https://i.pravatar.cc/50?img=13',
        title: 'Intro to Machine Learning',
      },
    ],
    rating: 4.6,
    totalRatings: 32,
  },
  {
    coachName: 'Sophia Rodriguez',
    coachImage: 'https://i.pravatar.cc/150?img=5',
    languages: ['English', 'Portuguese'],
    sessionCount: 213,
    skills: ['Product Management', 'Agile', 'Leadership'],
    description:
      'Product manager with over 10 years of experience in tech companies. Expert in agile methodologies and team leadership.',
    courses: [
      {
        image: 'https://i.pravatar.cc/50?img=14',
        title: 'Agile Product Management',
      },
      { image: 'https://i.pravatar.cc/50?img=15', title: 'Leadership Skills' },
    ],
    rating: 4.9,
    totalRatings: 78,
  },
  {
    coachName: 'David Williams',
    coachImage: 'https://i.pravatar.cc/150?img=7',
    languages: ['English', 'French'],
    sessionCount: 67,
    skills: ['UX Research', 'Design Thinking', 'Prototyping'],
    description:
      'UX designer focused on user-centered approaches and accessible design principles. Specializes in research methods and rapid prototyping.',
    courses: [
      {
        image: 'https://i.pravatar.cc/50?img=16',
        title: 'UX Research Methods',
      },
      {
        image: 'https://i.pravatar.cc/50?img=17',
        title: 'Design Thinking Workshop',
      },
    ],
    rating: 4.5,
    totalRatings: 21,
  },
  {
    coachName: 'Aisha Patel',
    coachImage: 'https://i.pravatar.cc/150?img=9',
    languages: ['English', 'Hindi', 'Gujarati'],
    sessionCount: 124,
    skills: ['Backend Development', 'Node.js', 'Database Design'],
    description:
      'Backend developer with a strong focus on scalable architecture and database optimization. Expert in Node.js and SQL.',
    courses: [
      {
        image: 'https://i.pravatar.cc/50?img=18',
        title: 'Node.js API Development',
      },
      {
        image: 'https://i.pravatar.cc/50?img=19',
        title: 'Database Design Principles',
      },
    ],
    rating: 4.7,
    totalRatings: 39,
  },
  {
    coachName: 'Thomas Johnson',
    coachImage: 'https://i.pravatar.cc/150?img=11',
    languages: ['English', 'German'],
    sessionCount: 82,
    skills: ['DevOps', 'Cloud Infrastructure', 'CI/CD'],
    description:
      'DevOps engineer specializing in cloud infrastructure and automated deployment pipelines. AWS certified and experienced with Kubernetes.',
    courses: [
      {
        image: 'https://i.pravatar.cc/50?img=20',
        title: 'Introduction to DevOps',
      },
      { image: 'https://i.pravatar.cc/50?img=21', title: 'AWS for Developers' },
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

export const SimpleTest: Story = {
  render: (args) => (
    <div style={{ border: '1px solid red', padding: '10px' }}>
      <div>Testing CoachList</div>
      <div>Number of coaches: {args.coaches?.length || 0}</div>
      {args.coaches?.map((coach, index) => (
        <div
          key={index}
          style={{ margin: '10px', padding: '10px', border: '1px solid blue' }}
        >
          {coach.coachName}
        </div>
      ))}
    </div>
  ),
};
