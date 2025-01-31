import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ProfilePicture,
  ProfilePictureProps,
} from '@/components/profile/profile-picture';

// Storybook meta configuration for the ProfilePicture component
const meta: Meta<typeof ProfilePicture> = {
  title: 'Components/ProfilePicture',
  component: ProfilePicture,
  tags: ['autodocs'],
  argTypes: {
    defaultImage: {
      control: 'text',
      description: 'The default profile picture to display.',
    },
    fileNameIs: {
      control: 'text',
      description: 'The default file name to display.',
    },
    maxSizeInMB: {
      control: 'number',
      description: 'Maximum file size allowed in MB.',
    },
    acceptedFileTypes: {
      control: { type: 'object' },
      description: 'Array of accepted MIME types for profile picture upload.',
    },
    onUpload: {
      action: 'onUpload',
      description: 'Callback triggered when a profile picture is uploaded.',
    },
    onDownload: {
      action: 'onDownload',
      description: 'Callback triggered when the profile picture is downloaded.',
    },
    onRemove: {
      action: 'onRemove',
      description: 'Callback triggered when the profile picture is removed.',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ProfilePicture>;

// Default state of the ProfilePicture component
export const Default: Story = {
  render: (args) => <ProfilePicture {...args} />,
  args: {
    fileNameIs: 'No file selected',
    maxSizeInMB: 5,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

// State where a default image is provided
export const ImagePresent: Story = {
  render: (args) => <ProfilePicture {...args} />,
  args: {
    defaultImage:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1727665998/anxious-people-under-stress_01_8_ts6dma.png',
    fileNameIs: 'No file selected',
    maxSizeInMB: 5,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};
