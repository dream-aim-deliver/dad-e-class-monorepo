import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReviewDisplay } from '../lib/components/review/review-display';

const meta = {
  title: 'Components/Review/ReviewDisplay',
  component: ReviewDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rating: {
      control: {
        type: 'range',
        min: 0,
        max: 5,
        step: 0.1,
      },
      description: 'Rating value between 0 and 5',
    },
    reviewText: {
      control: 'text',
      description: 'The review text content',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Language locale',
    },
    onClose: {
      action: 'close clicked',
      description: 'Callback function called when close is clicked',
    },
  },
} satisfies Meta<typeof ReviewDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rating: 4.5,
    reviewText: 'This course was absolutely amazing! I learned so much and the instructor was very helpful throughout the entire process.',
    locale: 'en',
    onClose: () => console.log('Close clicked'),
  },
};

export const HighRating: Story = {
  args: {
    rating: 5.0,
    reviewText: 'Perfect course! Everything was exactly as described and the quality exceeded my expectations. Highly recommended!',
    locale: 'en',
    onClose: () => console.log('Close clicked'),
  },
};

export const LowRating: Story = {
  args: {
    rating: 2.0,
    reviewText: 'The course content was okay but there were some areas that could be improved. The pacing felt a bit slow for me.',
    locale: 'en',
    onClose: () => console.log('Close clicked'),
  },
};

export const ShortReview: Story = {
  args: {
    rating: 4.0,
    reviewText: 'Great course!',
    locale: 'en',
    onClose: () => console.log('Close clicked'),
  },
};

export const LongReview: Story = {
  args: {
    rating: 4.3,
    reviewText: 'This comprehensive course provided an in-depth look at all the essential topics. The instructor was knowledgeable and engaging, making complex concepts easy to understand. The practical exercises were particularly valuable and helped reinforce the learning materials. I would definitely recommend this course to anyone looking to improve their skills in this area. The course materials were well-structured and the progression from basic to advanced topics was smooth and logical.',
    locale: 'en',
    onClose: () => console.log('Close clicked'),
  },
};

export const NoReviewText: Story = {
  args: {
    rating: 3.5,
    reviewText: '',
    locale: 'en',
    onClose: () => console.log('Close clicked'),
  },
};

export const GermanLocale: Story = {
  args: {
    rating: 4.2,
    reviewText: 'Dieser Kurs war fantastisch! Ich habe viel gelernt und der Dozent war sehr hilfsbereit.',
    locale: 'de',
    onClose: () => console.log('Close clicked'),
  },
};