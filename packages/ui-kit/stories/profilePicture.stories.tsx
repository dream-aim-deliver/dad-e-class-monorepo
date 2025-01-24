import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ProfilePicture,
  ProfilePictureProps,
} from '@/components/profile/profilePicture';

const StatefulProfilePicture = (args: ProfilePictureProps) => {
  const [image, setImage] = useState<string>(
    args.defaultImage || '/api/placeholder/64/64',
  );
  const [fileName, setFileName] = useState<string>(
    args.fileNameIs || 'No file selected',
  );
  const [fileSize, setFileSize] = useState<string>('');

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string); // Update image state
        setFileName(file.name); // Update file name
        setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`); // Update file size
        args.onUpload?.(file); // Trigger the action for logging in Storybook
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (image && image !== '/api/placeholder/64/64') {
      const link = document.createElement('a');
      link.href = image;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      args.onDownload?.(); // Trigger the action for logging in Storybook
    }
  };

  const handleRemove = () => {
    setImage('/api/placeholder/64/64'); // Reset to default placeholder image
    setFileName('No file selected'); // Reset file name
    setFileSize(''); // Reset file size
    args.onRemove?.(); // Trigger the action for logging in Storybook
  };

  return (
    <ProfilePicture
      {...args}
      fileNameIs={fileName} // Pass updated file name state
      onUpload={handleUpload}
      onDownload={handleDownload}
      onRemove={handleRemove}
    />
  );
};

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
      control: { type: 'object' }, // Use 'object' for arrays or complex data types
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

export const Default: Story = {
  render: (args) => <StatefulProfilePicture {...args} />,
  args: {
    fileNameIs: 'No file selected', // Default file name
    maxSizeInMB: 5, // Maximum allowed size in MB
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'], // Allowed MIME types
  },
};
