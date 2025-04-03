import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from '../lib/components/video-player';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    videoId: { control: 'text' },
    thumbnailUrl: { control: 'text' },
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    loadTimer:{control: 'number'},
    onErrorCallback: { action: 'onErrorCallback' },

  },
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

// Error callback function to log errors
const handleError = (message: string, error: any) => {
  console.error('VideoPlayer Error:', message, error);
};

export const Default: Story = {
  args: {
    videoId: 'WDeDCy7iJiG5LL6MTfOlQ3CKhXqnWHUXWqfl00mx8qX00',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
    onErrorCallback: handleError,
  },
};

export const WithoutThumbnail: Story = {
  args: {
    videoId: 'WDeDCy7iJiG5LL6MTfOlQ3CKhXqnWHUXWqfl00mx8qX00',
    locale: 'en',
    onErrorCallback: handleError,
  },
};

export const WithBrokenThumbnail: Story = {
  args: {
    videoId: 'WDeDCy7iJiG5LL6MTfOlQ3CKhXqnWHUXWqfl00mx8qX00',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v/lrpuzzgdayhoirs4gqgj.png', // Invalid URL
    locale: 'en',
    onErrorCallback: handleError,
  },
};

export const WithoutVideoId: Story = {
  args: {
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
    onErrorCallback: handleError,
  },
};

export const WrongVideoId: Story = {
  args: {
    videoId: 'YEK2woOv35g5CTTcbxtiNjG3kRH9ddCChjxATEpVTxc', // Invalid video ID
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'de',
    onErrorCallback: handleError,
  },
};
