import { Meta, StoryObj } from '@storybook/react-vite';
import { GroupCoachingSessionReviewsBanner } from '../lib/components/group-coaching-session-reviews-banner';

export default {
  title: 'Components/GroupCoachingSessionReviewsBanner',
  component: GroupCoachingSessionReviewsBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    reviewCount: {
      description: 'Total number of reviews received',
      control: 'number',
    },
    averageRating: {
      description: 'Average rating from the reviews (0-5)',
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
    },
    studentCount: {
      description: 'Number of students who attended the session',
      control: 'number',
    },
    locale: {
      description: 'The locale for translation and localization purposes',
      control: 'select',
      options: ['en', 'de'],
    },
  },
} satisfies Meta<typeof GroupCoachingSessionReviewsBanner>;

type Story = StoryObj<typeof GroupCoachingSessionReviewsBanner>;

export const Default: Story = {
  args: {
    reviewCount: 24,
    averageRating: 4.3,
    studentCount: 30,
    locale: 'en',
  },
};

export const HighRating: Story = {
  args: {
    reviewCount: 45,
    averageRating: 4.8,
    studentCount: 50,
    locale: 'en',
  },
};

export const LowRating: Story = {
  args: {
    reviewCount: 12,
    averageRating: 2.7,
    studentCount: 15,
    locale: 'en',
  },
};

export const NoReviews: Story = {
  args: {
    reviewCount: 0,
    averageRating: 0,
    studentCount: 20,
    locale: 'en',
  },
};

export const PerfectRating: Story = {
  args: {
    reviewCount: 35,
    averageRating: 5.0,
    studentCount: 35,
    locale: 'en',
  },
};

export const German: Story = {
  args: {
    reviewCount: 24,
    averageRating: 4.3,
    studentCount: 30,
    locale: 'de',
  },
};