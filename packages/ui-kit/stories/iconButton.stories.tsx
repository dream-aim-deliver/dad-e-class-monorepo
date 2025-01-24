import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '@/components/iconButton';
import { RefreshCcw, Trash2, Plus } from 'lucide-react';

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
          Refresh: RefreshCcw,
          Trash: Trash2,
          Plus: Plus,
        },
      },
      mapping: {
        Refresh: RefreshCcw,
        Trash: Trash2,
        Plus: Plus,
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
    icon: RefreshCcw,
  },
};

export const Secondary: Story = {
  args: {
    size: 'medium',
    styles: 'secondary',
    disabled: false,
    icon: Trash2,
  },
};

export const Text: Story = {
  args: {
    size: 'small',
    styles: 'text',
    disabled: false,
    icon: Plus,
  },
};

export const Disabled: Story = {
  args: {
    size: 'huge',
    styles: 'primary',
    disabled: true,
    icon: RefreshCcw,
  },
};
