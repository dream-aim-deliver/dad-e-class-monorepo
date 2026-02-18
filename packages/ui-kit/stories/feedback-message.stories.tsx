import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FeedBackMessage,
  FeedBackMessageProps,
} from '../lib/components/feedback-message';

const meta = {
  title: 'Components/FeedBackMessage',
  tags: ['autodocs'],
  component: FeedBackMessage,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['error', 'success', 'warning'],
      },
    },
    message: { control: 'text' },
  },
} as Meta;

export default meta;

type Story = StoryObj<FeedBackMessageProps>;

export const Error: Story = {
  args: {
    type: 'error',
    message: 'This is an error message',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    message: 'This is a success message',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'This is a warning message',
  },
};
