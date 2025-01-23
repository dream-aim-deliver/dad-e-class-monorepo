import type { Meta, StoryObj } from '@storybook/react';
import { InputField, InputFieldProps } from '@/components/inputField';

const meta = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    hasLeftContent: { control: 'boolean' },
    hasRightContent: { control: 'boolean' },
    leftContent: { control: 'text' },
    rightContnet: { control: 'text' },
    inputText: { control: 'text' },
    state: {
      control: {
        type: 'select',
        options: [
          'placeholder',
          'disabled',
          'filled',
          'filling',
          'warning',
          'error',
        ],
      },
    },
    value: { control: 'text' },
    setValue: { action: 'setValue' },
  },
} as Meta;

export default meta;

type Story = StoryObj<InputFieldProps>;

export const Placeholder: Story = {
  args: {
    hasLeftContent: false,
    hasRightContent: false,
    leftContent: null,
    rightContnet: null,
    inputText: 'Placeholder',
    state: 'placeholder',
    value: '',
    setValue: (value: string) => console.log('Value set to:', value),
  },
};

export const WithLeftContent: Story = {
  args: {
    hasLeftContent: true,
    hasRightContent: false,
    leftContent: <span>🔍</span>,
    rightContnet: null,
    inputText: 'Search...',
    state: 'placeholder',
    value: '',
    setValue: (value: string) => console.log('Value set to:', value),
  },
};

export const WithRightContent: Story = {
  args: {
    hasLeftContent: false,
    hasRightContent: true,
    leftContent: null,
    rightContnet: <button>Go</button>,
    inputText: 'Type here...',
    state: 'placeholder',
    value: '',
    setValue: (value: string) => console.log('Value set to:', value),
  },
};

export const Disabled: Story = {
  args: {
    hasLeftContent: false,
    hasRightContent: false,
    leftContent: null,
    rightContnet: null,
    inputText: 'Disabled input',
    state: 'disabled',
    value: '',
    setValue: (value: string) => console.log('Value set to:', value),
  },
};

export const Warning: Story = {
  args: {
    hasLeftContent: false,
    hasRightContent: false,
    leftContent: null,
    rightContnet: null,
    inputText: 'Warning state',
    state: 'warning',
    value: '',
    setValue: (value: string) => console.log('Value set to:', value),
  },
};

export const Error: Story = {
  args: {
    hasLeftContent: false,
    hasRightContent: false,
    leftContent: null,
    rightContnet: null,
    inputText: 'Error state',
    state: 'error',
    value: '',
    setValue: (value: string) => console.log('Value set to:', value),
  },
};
