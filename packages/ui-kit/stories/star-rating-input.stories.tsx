import { Meta, StoryObj } from '@storybook/react-vite';
import StarRatingInput from '../lib/components/star-rating-input';
import React from 'react';

/**
 * Storybook configuration for the StarRatingInput component.
 */
const meta: Meta<typeof StarRatingInput> = {
  title: 'Components/StarRatingInput',
  component: StarRatingInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    totalStars: {
      control: { type: 'number', min: 1 },
      description: 'The total number of stars in the rating system. Default is 5.',
    },
    size: {
      control: { type: 'number', min: 8 },
      description: 'The size of each star icon in pixels. Default is 16.',
    },
    type: {
      control: { type: 'radio', options: ['single', 'range'] },
      description: 'The type of rating input: "single" for one rating or "range" for min/max ratings.',
    },
    onChange: {
      action: 'rating-changed',
      description: 'Callback function triggered when the rating changes. Returns an object with min, max, or single rating.',
    },
  },
};

export default meta;

/**
 * Template for rendering the StarRatingInput component with customizable props.
 */
type Story = StoryObj<typeof StarRatingInput>;

const Template: Story = {
  render: ({ onChange, ...args }) => (
    <StarRatingInput
      {...args}
      onChange={(value) => {
        onChange(value);
        console.log('Rating changed:', value);
      }}
    />
  ),
};

/**
 * Default story showcasing a single star rating input.
 */
export const DefaultSingleRating: Story = {
  ...Template,
  args: {
    totalStars: 5,
    size: 16,
    type: 'single',
  },
  parameters: {
    docs: {
      description: {
        story: 'A default StarRatingInput component for single rating selection with 5 stars and default size of 16px, centered in the viewport.',
      },
    },
  },
};

/**
 * Range rating story showcasing min/max rating input.
 */
export const RangeRating: Story = {
  ...Template,
  args: {
    totalStars: 5,
    size: 16,
    type: 'range',
  },
  parameters: {
    docs: {
      description: {
        story: 'A StarRatingInput component configured for range rating, allowing selection of minimum and maximum ratings, centered in the viewport.',
      },
    },
  },
};

/**
 * Custom total stars story.
 */
export const CustomTotalStars: Story = {
  ...Template,
  args: {
    totalStars: 10,
    size: 16,
    type: 'single',
  },
  parameters: {
    docs: {
      description: {
        story: 'A StarRatingInput component with a custom total of 10 stars for single rating selection, centered in the viewport.',
      },
    },
  },
};

/**
 * Large stars story.
 */
export const LargeStars: Story = {
  ...Template,
  args: {
    totalStars: 5,
    size: 24,
    type: 'single',
  },
  parameters: {
    docs: {
      description: {
        story: 'A StarRatingInput component with larger stars (size 24px) for single rating selection, centered in the viewport.',
      },
    },
  },
};