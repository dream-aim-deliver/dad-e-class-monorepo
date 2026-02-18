import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from '../lib/components/home-banner/hero';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    videoId: { control: 'text' },
    thumbnailUrl: { control: 'text' },
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    title: "Become your own ad agency.",
    description:
      ' Finally: the solution for companies and teams who want to invest in visibility – not agency fees. With JUST DO AD you gain the skills to design and launch your own advertising: branding, campaigns, websites, videos, and content. Hands-on, step by step, tailored to your needs – with as much or as little support as you choose. ',
    videoId: 'Eg3DPdKFxUjak00azanz8VpGV4uATNjwELeTpVIxM2tM',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'de',
  },
};

export const LongTitle: Story = {
  args: {
    title:
      'Discover the Power of Online Learning with Our Comprehensive Offers',
    description:
      'Unlock your potential and advance your career with our expert-led offers.',
    videoId: 'cQ800mkpB7VwoUjUUgtxXs4j5P6iEuafZkkjnAahuRek',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
  },
};

export const ShortDescription: Story = {
  args: {
    title: 'Quick Start Guide',
    description: 'Get started in minutes!',
    videoId: 'cQ800mkpB7VwoUjUUgtxXs4j5P6iEuafZkkjnAahuRek',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
  },
};

export const NoThumbnail: Story = {
  args: {
    title: 'Text-Only Hero',
    description: "This hero section doesn't include a video player.",
    videoId: 'cQ800mkpB7VwoUjUUgtxXs4j5P6iEuafZkkjnAahuRek',
    locale: 'en',
  },
};

export const NoVideo: Story = {
  args: {
    title: 'Text-Only Hero',
    description: "This hero section doesn't include a video player.",
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
  },
};
