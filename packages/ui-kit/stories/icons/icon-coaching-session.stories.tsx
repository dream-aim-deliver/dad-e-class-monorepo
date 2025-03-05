import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { IconCoachingSession } from '../../lib/components/icons/icon-coaching-session';


export default {
  title: 'Icons/IconCoachingSession',
  component: IconCoachingSession,
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
} as Meta;


type Story = StoryObj<typeof IconCoachingSession>;

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
    classNames: 'text-button-secondary-text',
  },
};
