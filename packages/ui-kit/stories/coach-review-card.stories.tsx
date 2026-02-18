import { Meta, StoryObj } from '@storybook/react-vite';
import { ReviewCard } from "../lib/components/review/coach-review-card";

export default {
  title: 'Components/CoachReviewCard',
  component: ReviewCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: "select",
      options: ["en", "de"]
    },
    rating: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'The rating given by the user (1-5 stars).',
    },
    reviewerName: {
      control: 'text',
      description: 'The name of the reviewer.',
    },
    reviewerAvatar: {
      control: 'text',
      description: 'The URL of the reviewer’s avatar.',
    },
    reviewText: {
      control: 'text',
      description: 'The main review content.',
    },
    workshopTitle: {
      control: 'text',
      description: 'The title of the workshop.',
    },
    date: {
      control: 'date',
      description: 'Date of the workshop.',
    },
    time: {
      control: 'text',
      description: 'Time of the workshop.',
    },
    courseTitle: {
      control: 'text',
      description: 'The title of the course associated with the review.',
    },
    courseImage: {
      control: 'text',
      description: 'The URL of the course image.',
    },
  },
} satisfies Meta<typeof ReviewCard>;

type Story = StoryObj<typeof ReviewCard>;

// Default ReviewCard
export const Default: Story = {
  args: {
    rating: 5,
    reviewerName: 'John Doe',
    reviewerAvatar: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    reviewText: "The coaching session on advertising was incredibly insightful, providing clear strategies that are immediately actionable. The personalized approach made complex concepts easy to understand, leaving me confident in applying these techniques to my business.",
    workshopTitle: 'Advanced React Workshop',
    date: new Date(),
    time: '10:00 AM - 12:00 PM',
    courseTitle: 'React Mastery',
    courseImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    locale: "en"
  },
};

// ReviewCard with a Different Rating
export const LowRating: Story = {
  args: {
    ...Default.args,
    rating: 2,
    reviewText: 'The workshop was okay, but it could have been better with more examples.',

  },

};


// ReviewCard with a Short Review
export const ShortReview: Story = {
  args: {
    ...Default.args,
    reviewText: 'Good workshop!',
  },
};
