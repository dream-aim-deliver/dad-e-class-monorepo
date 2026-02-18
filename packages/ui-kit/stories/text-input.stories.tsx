import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput, TextInputProps } from '../lib/components/text-input';
import { IconSearch } from '../lib/components/icons/icon-search';
import { Button } from '../lib/components/button';
import React from 'react';

const meta = {
  title: 'Components/TextInput',
  tags: ['autodocs'],
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    hasFeedback: { control: 'boolean' },
    inputField: {
      control: 'object',
      description: 'Props for the InputField component.',
    },
    feedbackMessage: {
      control: 'object',
      description: 'Props for the FeedBackMessage component.',
    },
  },
} as Meta;

export default meta;

type Story = StoryObj<TextInputProps>;

export const Default: Story = {
  args: {
    label: 'Default Label',
    hasFeedback: true,
    inputField: {
      hasLeftContent: false,
      hasRightContent: false,
      inputText: 'Enter text...',
      state: 'placeholder',
      setValue: (value: string) => console.log('Input value:', value),
    },
    feedbackMessage: {
      type: 'success',
      message: 'This is a success message.',
    },
  },
};

export const WithErrorFeedback: Story = {
  args: {
    label: 'Error Label',
    hasFeedback: true,
    inputField: {
      hasLeftContent: true,
      leftContent: <IconSearch />,
      inputText: 'Search...',
      state: 'error',
      setValue: (value: string) => console.log('Input value:', value),
    },
    feedbackMessage: {
      type: 'error',
      message: 'This is an error message.',
    },
  },
};

export const WithoutFeedback: Story = {
  args: {
    label: 'Label Without Feedback',
    hasFeedback: false,
    inputField: {
      hasLeftContent: false,
      hasRightContent: false,
      inputText: 'Enter text...',
      state: 'placeholder',
      setValue: (value: string) => console.log('Input value:', value),
    },
    feedbackMessage: {
      type: 'warning',
      message: 'This message will not appear.',
    },
  },
};

export const WarningFeedback: Story = {
  args: {
    label: 'Warning Label',
    hasFeedback: true,
    inputField: {
      hasRightContent: true,
      rightContent: <Button text="Change Password" variant="text" />,
      inputText: 'Type here...',
      state: 'warning',
      setValue: (value: string) => console.log('Input value:', value),
    },
    feedbackMessage: {
      type: 'warning',
      message: 'This is a warning message.',
    },
  },
};
