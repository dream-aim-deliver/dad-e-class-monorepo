import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconLoaderSpinner } from '../../lib/components/icons/icon-loader-spinner';
import { IconProps } from '../../lib/components/icons/icon';

// Meta configuration for Storybook
const meta: Meta<typeof IconLoaderSpinner> = {
  title: 'Icons/IconLoaderSpinner',
  component: IconLoaderSpinner,
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
type Story = StoryObj<typeof IconLoaderSpinner>;

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
    classNames: 'animate-spin text-button-secondary-text',
  },
};
