import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourseIntroBanner } from '../lib/components/course-intro-banner'; 

const meta: Meta<typeof CourseIntroBanner> = {
  title: 'Components/CourseIntroBanner',
  component: CourseIntroBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    description: { control: 'text' },
    videoId: { control: 'text' },
    thumbnailUrl: { control: 'text' },
    onErrorCallback: {
      description: 'Callback function to handle errors',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CourseIntroBanner>;

export const Default: Story = {
  args: {
    description: '[{"type": "paragraph", "children": [{"text": "Discover the art of moving images in our practice-oriented course, led by industry professionals! You will learn how to develop an effective storyboard and a convincing concept. We offer you professional tips and support you in the implementation of your project. We will also show you the best tools to realize your ideas quickly and efficiently. Stand out from the crowd with a unique look and innovative ideas and win n."}]}]',
    videoId: 'TvV02y7Wpo1use1agD7fbqPob0101WKBOjYe02j01jVrgubw',
    thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
    onErrorCallback: (message, error) => console.log('error', message, error),
  },
};

export const LongTitle: Story = {
  args: {
    description: '[{"type": "paragraph", "children": [{"text": "Join thousands of learners in building scalable, efficient applications from scratch. Learn from industry experts and develop the skills you need to land a job as a software engineer. Start learning now!"}]}]',
    videoId: 'TvV02y7Wpo1use1agD7fbqPob0101WKBOjYe02j01jVrgubw',
    thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'de',
    onErrorCallback: (message, error) => console.log('error', message, error),
  },
};

export const NoThumbnail: Story = {
  args: {
    description: '[{"type": "paragraph", "children": [{"text": "Discover the art of moving images in our practice-oriented course, led by industry professionals! You will learn how to develop an effective storyboard and a convincing concept. We offer you professional tips and support you in the implementation of your project. We will also show you the best tools to realize your ideas quickly and efficiently. Stand out from the crowd with a unique look and innovative ideas and win n."}]}]',
    videoId: 'TvV02y7Wpo1use1agD7fbqPob0101WKBOjYe02j01jVrgubw',
    locale: 'en',
    onErrorCallback: (message, error) => console.log('error', message, error),
  },
};

export const NoVideo: Story = {
  args: {
    description: '[{"type": "paragraph", "children": [{"text": "Discover the art of moving images in our practice-oriented course, led by industry professionals! You will learn how to develop an effective storyboard and a convincing concept. We offer you professional tips and support you in the implementation of your project. We will also show you the best tools to realize your ideas quickly and efficiently. Stand out from the crowd with a unique look and innovative ideas and win n."}]}]',
    thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
    onErrorCallback: (message, error) => console.log('error', message, error),
  },
};
