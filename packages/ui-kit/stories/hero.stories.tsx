import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
    title: "Platform's Title, short and powerful",
    description:
      'Platform introduction. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. ',
    videoId: 'YEK2woOv35g5CTTcbxtiNjG3kRH9ddCChjxATEpVTxc',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'de',
  },
};

export const LongTitle: Story = {
  args: {
    title:
      'Discover the Power of Online Learning with Our Comprehensive Courses',
    description:
      'Unlock your potential and advance your career with our expert-led courses.',
    videoId: 'YEK2woOv35g5CTTcbxtiNjG3kRH9ddCChjxATEpVTxc',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
  },
};

export const ShortDescription: Story = {
  args: {
    title: 'Quick Start Guide',
    description: 'Get started in minutes!',
    videoId: 'YEK2woOv35g5CTTcbxtiNjG3kRH9ddCChjxATEpVTxc',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      locale: 'en',
  },
};

export const NoThumbnail: Story = {
  args: {
    title: 'Text-Only Hero',
    description: "This hero section doesn't include a video player.",
    videoId: 'YEK2woOv35g5CTTcbxtiNjG3kRH9ddCChjxATEpVTxc',
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
