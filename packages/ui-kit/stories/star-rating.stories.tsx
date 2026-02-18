import { Meta, StoryObj } from '@storybook/react-vite';
import { StarRating } from '../lib/components/star-rating';
import React from 'react';

/**
 * Storybook configuration for the StarRating component.
 */
const meta: Meta<typeof StarRating> = {
  title: 'Components/StarRating',
  component: StarRating,
  tags: ['autodocs'],
  argTypes: {
    rating: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description:
        'The numeric rating value. Determines how many stars are filled or half-filled.',
    },
    totalStars: {
      control: { type: 'number', min: 1 },
      description:
        'The total number of stars in the rating system. Default is 5.',
    },
    size: {
      control: { type: 'text' },
      description:
        'The size of each star icon in pixels (e.g., "4" for 4px). Default is "4".',
    },
  },
};

export default meta;

/**
 * Template for rendering the StarRating component with customizable props.
 */
const Template: StoryObj<typeof StarRating> = {
  render: (args) => <StarRating {...args} />,
};

/**
 * Default story showcasing a standard 5-star rating.
 */
export const DefaultStarRating: StoryObj<typeof StarRating> = {
  ...Template,
  args: {
    rating: 4.6,
    totalStars: 5,
    size: '4',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A default star rating component with a rating of 4.6 out of 5 stars and a default size of "4".',
      },
    },
  },
};

/**
 * Custom total stars story.
 */
export const CustomTotalStars: StoryObj<typeof StarRating> = {
  ...Template,
  args: {
    rating: 3.2,
    totalStars: 10,
    size: '4',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A star rating component with a custom total of 10 stars and a rating of 3.2.',
      },
    },
  },
};

/**
 * Large star icons story.
 */
export const LargeStars: StoryObj<typeof StarRating> = {
  ...Template,
  args: {
    rating: 4.8,
    totalStars: 5,
    size: '8',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A star rating component with larger stars (size "8") and a rating of 4.8 out of 5.',
      },
    },
  },
};

/**
 * Zero rating story.
 */
export const ZeroRating: StoryObj<typeof StarRating> = {
  ...Template,
  args: {
    rating: 0,
    totalStars: 5,
    size: '4',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A star rating component with a zero rating, displaying only empty stars.',
      },
    },
  },
};
