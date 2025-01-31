import type { Meta, StoryObj } from '@storybook/react';
import { DateInput, DateInputProps } from '@/components/date-input';
import { useState } from 'react';

// Stateful wrapper for DateInput
const StatefulDateInput = (args: DateInputProps) => {
  const [value, setValue] = useState(args.value || '');

  const handleChange = (newValue: string) => {
    setValue(newValue); // Update local state
    args.onChange?.(newValue); // Trigger the action for Storybook
  };

  return <DateInput {...args} value={value} onChange={handleChange} />;
};

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' },
    },
    label: {
      control: { type: 'text' },
      description: 'The label for the DateInput field.',
      defaultValue: 'Select a date',
    },
    onChange: {
      action: 'changed',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  render: (args) => <StatefulDateInput {...args} />,
  args: {
    value: '',
    label: 'Date of Birth (optional)',
  },
};

export const PreFilledDate: Story = {
  render: (args) => <StatefulDateInput {...args} />,
  args: {
    value: '2023-01-01',
    label: 'Select a date',
  },
};

export const CustomLabel: Story = {
  render: (args) => <StatefulDateInput {...args} />,
  args: {
    value: '',
    label: 'Custom Label for Date Input',
  },
};
