import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CoachCard from '../lib/components/coach/coach-card';
import { NextIntlClientProvider } from 'next-intl';
const mockMessages = {
  coachingSession: 'Coaching Session',
  teaches: 'Teaches',
  viewProfile: 'View Profile',
  bookSession: 'Book a Session',
};
const meta: Meta<typeof CoachCard> = {
  title: 'Components/CoachCard',
  component: CoachCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Center the component in the Storybook canvas
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CoachCard>;

// 🔹 Test Case 2: Highly Rated Coach
export const HighlyRatedCoach: Story = {
  args: {
    cardDetails: {
      coachName: 'Dr. Sarah Johnson',
      coachImage:
        'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English', 'French'],
      sessionCount: 100,
      skills: ['Leadership', 'Communication', 'Public Speaking'],
      description:
        'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that’s as unique as your business.',
      courses: [
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Leadership Mastery',
        },
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Effective Communication',
        },
      ],
      rating: 5.0,
      totalRatings: 500,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

// 🔹 Test Case 3: New Coach (Low Sessions)
export const NewCoach: Story = {
  args: {
    cardDetails: {
      coachName: 'Alex Roberts',
      coachImage:
        'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English'],
      sessionCount: 3,
      skills: ['Career Coaching', 'Resume Building'],
      description:
        'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that’s as unique as your business.',
      courses: [
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Career Advancement',
        },
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Career Advancement',
        },
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Career Advancement',
        },
      ],
      rating: 4.2,
      totalRatings: 15,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

// 🔹 Test Case 4: Coach Without Profile Picture
export const NoProfilePicture: Story = {
  args: {
    cardDetails: {
      coachName: 'Anonymous Coach',
      coachImage: '',
      languages: ['German', 'Spanish'],
      sessionCount: 50,
      skills: ['Personal Development', 'Time Management'],
      description:
        'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that’s as unique as your business.',
      courses: [
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Personal Growth',
        },
      ],
      rating: 4.7,
      totalRatings: 75,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

// 🔹 Test Case 5: Coach with Many Skills
export const CoachWithManySkills: Story = {
  args: {
    cardDetails: {
      coachName: 'Michael Carter',
      coachImage:
        'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English', 'Japanese', 'Chinese'],
      sessionCount: 200,

      skills: [
        'Business Strategy StrategyStrategyStrategyStrategy',
        'Business Strategy',
        'Marketing',
        'Sales',
        'SEO',
        'Business Strategy',
        'zzzzz',
        'Business Strategy',
        'Marketing',
        'Sales',
        'SEO',
      ],

      description:
        'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that’s as unique as your business.',

      courses: [
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Business Growth',
        },
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Marketing 101',
        },
      ],

      rating: 4.8,
      totalRatings: 320,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

// 🔹 Test Case 6: Low-Rated Coach
export const LowRatedCoach: Story = {
  args: {
    cardDetails: {
      coachName: 'Tom Spencer',
      coachImage:
        'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English'],
      sessionCount: 15,
      skills: ['Public Speaking', 'Debating'],
      description: 'Helping individuals master the art of public speaking.',
      courses: [
        {
          image:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Speaking with Confidence',
        },
      ],
      rating: 2.5,
      totalRatings: 5,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};
