import type { Meta, StoryObj } from '@storybook/react-vite';
import { AutoPlayVideoPlayer } from '../lib/components/auto-play-video-player';

const meta: Meta<typeof AutoPlayVideoPlayer> = {
  title: 'Components/AutoPlayVideoPlayer',
  component: AutoPlayVideoPlayer,
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
    className: {
      control: 'text',
      description: 'Custom class name for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AutoPlayVideoPlayer>;

export const Default: Story = {
  args: {
    videoId: 'uNbxnGLKJ00yfbijDO8COxTOyVKT01xpxW',
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
    onErrorCallback: (message: string, event: Event | Error) => console.log(message),
    className: 'aspect-video w-[300px] h-[300px]',
  },
};

export const WithoutThumbnail: Story = {
  args: {
    videoId: 'cQ800mkpB7VwoUjUUgtxXs4j5P6iEuafZkkjnAahuRek',
    locale: 'en',
    onErrorCallback: (message: string, event: Event | Error) => console.log(message),
    className: 'aspect-video w-[300px] h-[300px]',
  },
};

export const WithBrokenThumbnail: Story = {
  args: {
    videoId: 'cQ800mkpB7VwoUjUUgtxXs4j5P6iEuafZkkjnAahuRek',
    thumbnailUrl:
      'https://invalid-url-that-will-fail.com/broken-image.png', // Invalid URL for testing error handling
    locale: 'en',
    onErrorCallback: (message: string, event: Event | Error) => console.log(message),
    className: 'aspect-video w-[300px] h-[300px]',
  },
};

export const WithoutVideoId: Story = {
  args: {
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
    onErrorCallback: (message: string, event: Event | Error) => console.log(message),
    className: 'aspect-video w-[300px] h-[300px]',
  },
};

export const WrongVideoId: Story = {
  args: {
    videoId: 'YEK2woOv35g5CTTcbxtiNjG3kRH9ddCChjxATEpVTxc', // Invalid video ID
    thumbnailUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'de',
    onErrorCallback: (message: string, event: Event | Error) => console.log(message),
    className: 'aspect-video w-[300px] h-[300px]',
  },
};

