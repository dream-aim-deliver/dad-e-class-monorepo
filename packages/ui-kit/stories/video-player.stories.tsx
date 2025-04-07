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

    onErrorCallback: {
      description: 'Callback function to handle errors',
    },
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
    videoId: 'cQ800mkpB7VwoUjUUgtxXs4j5P6iEuafZkkjnAahuRek',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
   onErrorCallback:(message:string,event:any)=>console.log(message)
  },
};

export const WithoutThumbnail: Story = {
  args: {
    videoId: 'cQ800mkpB7VwoUjUUgtxXs4j5P6iEuafZkkjnAahuRek',
    locale: 'en',
    onErrorCallback:(message:string,event:any)=>console.log(message)
  },
};

export const WithBrokenThumbnail: Story = {
  args: {
    videoId: 'cQ800mkpB7VwoUjUUgtxXs4j5P6iEuafZkkjnAahuRek',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v/lrpuzzgdayhoirs4gqgj.png', // Invalid URL
    locale: 'en',
    onErrorCallback:(message:string,event:any)=>console.log(message)
  },
};

export const WithoutVideoId: Story = {
  args: {
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
    onErrorCallback:(message:string,event:any)=>console.log(message)
  },
};

export const WrongVideoId: Story = {
  args: {
    videoId: 'YEK2woOv35g5CTTcbxtiNjG3kRH9ddCChjxATEpVTxc', // Invalid video ID
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'de',
    onErrorCallback:(message:string,event:any)=>console.log(message)
  },
};
