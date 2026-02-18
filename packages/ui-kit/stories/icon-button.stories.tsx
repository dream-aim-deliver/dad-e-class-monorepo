import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '../lib/components/icon-button';
import { IconClose } from '../lib/components/icons/icon-close';
import React from 'react';
import { IconPlus } from '../lib/components/icons/icon-plus';
import { IconTrashAlt } from '../lib/components/icons/icon-trash-alt';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  tags: ['autodocs'],
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'big', 'huge'],
      },
    },
    styles: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'text'],
      },
    },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
    icon: {
      control: {
        type: 'select',
        options: {
          Trash: <IconTrashAlt />,
          Plus: <IconPlus />,
        },
      },
      mapping: {
        Trash: <IconTrashAlt />,
        Plus: <IconPlus />,
      },
    },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    size: 'big',
    styles: 'primary',
    disabled: false,
    icon: <IconClose />,
  },
};

export const Secondary: Story = {
  args: {
    size: 'big',
    styles: 'secondary',
    disabled: false,
    icon: <IconClose size="8" />,
  },
};

export const Text: Story = {
  args: {
    size: 'small',
    styles: 'text',
    disabled: false,
    icon: <IconClose size="8" />,
  },
};

export const Disabled: Story = {
  args: {
    size: 'huge',
    styles: 'primary',
    disabled: true,
    icon: <IconClose />,
  },
};
