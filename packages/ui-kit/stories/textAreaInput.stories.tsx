import type { Meta, StoryObj } from '@storybook/react';
import { TextAreaInput, TextAreaInputProps } from '@/components/textAreaInput';
import { vi } from 'vitest'; // Import `vi` for mocking functions

const meta = {
  title: 'Components/TextAreaInput',
  component: TextAreaInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      description: 'The label for the textarea input.',
    },
    value: {
      control: {
        type: 'text',
      },
      description: 'The current value of the textarea.',
    },
    setValue: {
      action: 'setValue',
      description: 'Callback function to set the textarea value.',
    },
    placeholder: {
      control: {
        type: 'text',
      },
      description: 'Placeholder text for the textarea.',
    },
    className: {
      control: {
        type: 'text',
      },
      description: 'Additional CSS classes for custom styling.',
    },
  },
} as Meta;

export default meta;

type Story = StoryObj<TextAreaInputProps>;

export const Default: Story = {
  args: {
    label: 'Text Area Label',
    value: '',
    placeholder: 'Enter text here',
    setValue: vi.fn(),
    className: '',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Text Area Label',
    value: 'Pre-filled text',
    placeholder: 'Enter text here',
    setValue: vi.fn(),
    className: '',
  },
};

export const WithoutLabel: Story = {
  args: {
    value: '',
    placeholder: 'Enter text here',
    setValue: vi.fn(),
    className: '',
  },
};
