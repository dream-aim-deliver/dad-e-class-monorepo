import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioButton, RadioButtonProps } from '../lib/components/radio-button';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton',
  tags: ['autodocs'],
  component: RadioButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    withText: { control: 'boolean' },
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
    onChange: { action: 'changed' },
    label: { control: 'text' },
    labelClass: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<RadioButtonProps>;

const StatefulRadioButton = (args: RadioButtonProps) => {
  const [isChecked, setIsChecked] = useState(args.checked || false);

  const handleChange = (value: string) => {
    setIsChecked(!isChecked);
    args.onChange?.(value); // Trigger the action for logging in Storybook
  };

  return <RadioButton {...args} checked={isChecked} onChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <StatefulRadioButton {...args} />,
  args: {
    name: 'defaultRadioButton',
    value: 'defaultValue',
  },
};

export const Checked: Story = {
  render: (args) => <StatefulRadioButton {...args} />,
  args: {
    name: 'checkedRadioButton',
    value: 'checkedValue',
    label: 'Checked Radio Button',
    labelClass: 'text-text-primary text-sm leading-[100%]',
    checked: true,
    disabled: false,
    withText: true,
    size: 'medium',
  },
};

export const Disabled: Story = {
  render: (args) => <StatefulRadioButton {...args} />,
  args: {
    name: 'disabledRadioButton',
    value: 'disabledValue',
    label: 'Disabled Radio Button',
    labelClass: 'text-text-primary text-sm leading-[100%]',
    checked: false,
    disabled: true,
    withText: true,
    size: 'medium',
  },
};

export const SmallSize: Story = {
  render: (args) => <StatefulRadioButton {...args} />,
  args: {
    name: 'smallRadioButton',
    value: 'smallValue',
    label: 'Small Radio Button',
    labelClass: 'text-text-primary text-sm leading-[100%]',
    checked: false,
    disabled: false,
    withText: true,
    size: 'small',
  },
};

export const LargeSize: Story = {
  render: (args) => <StatefulRadioButton {...args} />,
  args: {
    name: 'largeRadioButton',
    value: 'largeValue',
    labelClass: 'text-text-primary text-sm leading-[100%]',
    label: 'Large Radio Button',
    checked: false,
    disabled: false,
    withText: true,
    size: 'large',
  },
};
