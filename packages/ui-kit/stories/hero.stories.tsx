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
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    title: "Platform's Title, short and powerful",
    description:
      'Platform introduction. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. ',
    videoId: '49OChXo55c00QOj7wusRRWejBpXMEfT7ITsVPwkdhPHQ',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
  },
};

export const LongTitle: Story = {
  args: {
    title:
      'Discover the Power of Online Learning with Our Comprehensive Courses',
    description:
      'Unlock your potential and advance your career with our expert-led courses.',
    videoId: '49OChXo55c00QOj7wusRRWejBpXMEfT7ITsVPwkdhPHQ',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
  },
};

export const ShortDescription: Story = {
  args: {
    title: 'Quick Start Guide',
    description: 'Get started in minutes!',
    videoId: '49OChXo55c00QOj7wusRRWejBpXMEfT7ITsVPwkdhPHQ',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
  },
};

export const NoThumbnail: Story = {
  args: {
    title: 'Text-Only Hero',
    description: "This hero section doesn't include a video player.",
    videoId: '49OChXo55c00QOj7wusRRWejBpXMEfT7ITsVPwkdhPHQ',
  },
};

export const NoVideo: Story = {
  args: {
    title: 'Text-Only Hero',
    description: "This hero section doesn't include a video player.",
    thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
  },
};
