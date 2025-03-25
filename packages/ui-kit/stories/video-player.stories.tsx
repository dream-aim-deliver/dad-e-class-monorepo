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
  },
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const Default: Story = {
  args: {
    videoId: '49OChXo55c00QOj7wusRRWejBpXMEfT7ITsVPwkdhPHQ',
    thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
  },
};

export const WithoutThumbnail: Story = {
  args: {
    videoId: '49OChXo55c00QOj7wusRRWejBpXMEfT7ITsVPwkdhPHQ',
  },
};

export const WithBrokenThumbnail: Story = {
    args: {
      videoId: '49OChXo55c00QOj7wusRRWejBpXMEfT7ITsVPwkdhPHQ',
        thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v/lrpuzzgdayhoirs4gqgj.png',
    },
};

export const WithoutVideoId: Story = {
    args: {
        thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    },
};

export const WrongVideoId: Story = {
    args: {
        videoId: 'k2q01S3txU00oPknMICTB9Rvx1s00ZxWEX1SqA',
        thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    },
};


