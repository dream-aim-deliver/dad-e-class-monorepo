import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconCloudUpload } from '../../lib/components/icons/icon-cloud-upload';
import { IconProps } from '../../lib/components/icons/icon';

// Meta configuration for Storybook
const meta: Meta<typeof IconCloudUpload> = {
  title: 'Icons/IconCloudUpload',
  component: IconCloudUpload,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number' },
      description: 'The size of the icon (height and width in Tailwind CSS).',
      defaultValue: 6,
    },
    fill: {
      control: { type: 'text' },
      description: 'The fill color of the icon.',
      defaultValue: 'currentColor',
    },
    classNames: {
      control: { type: 'text' },
      description:
        'Additional TailwindCSS classes to apply to the icon for styling.',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof IconCloudUpload>;

// Default story
export const Default: Story = {
  args: {
    classNames: 'text-button-secondary-text',
  },
};

// Customizable story
export const CustomIcon: Story = {
  args: {
    size: '10',
    classNames: 'rotate-90 text-button-secondary-text',
  },
};
