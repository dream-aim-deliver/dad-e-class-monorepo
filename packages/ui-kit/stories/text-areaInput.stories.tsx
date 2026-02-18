import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  TextAreaInput,
  TextAreaInputProps,
} from '../lib/components/text-areaInput';

const meta = {
  title: 'Components/TextAreaInput',
  tags: ['autodocs'],
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
    placeholder: 'Enter text here',
    className: '',
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: 'Enter text here',
    className: '',
  },
};
