import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckBox, CheckBoxProps } from '../lib/components/checkbox';

const meta: Meta<typeof CheckBox> = {
  title: 'Components/CheckBox',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
  component: CheckBox,
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

type Story = StoryObj<CheckBoxProps>;

const StatefulCheckBox = (args: CheckBoxProps) => {
  const [isChecked, setIsChecked] = useState(args.checked || false);

  const handleChange = (value: string) => {
    setIsChecked(!isChecked);
    args.onChange?.(value); // Trigger the action for logging in Storybook
  };

  return <CheckBox {...args} checked={isChecked} onChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <StatefulCheckBox {...args} />,
  args: {
    name: 'defaultCheckbox',
    value: 'defaultValue',
  },
};

export const Checked: Story = {
  render: (args) => <StatefulCheckBox {...args} />,
  args: {
    name: 'checkedCheckbox',
    value: 'checkedValue',
    label: 'Checked Checkbox',
    labelClass: 'text-text-primary text-sm leading-[100%]',
    checked: true,
    disabled: false,
    withText: true,
    size: 'medium',
  },
};

export const Disabled: Story = {
  render: (args) => <StatefulCheckBox {...args} />,
  args: {
    name: 'disabledCheckbox',
    value: 'disabledValue',
    label: 'Disabled Checkbox',
    labelClass: 'text-text-primary text-sm leading-[100%]',
    checked: false,
    disabled: true,
    withText: true,
    size: 'medium',
  },
};

export const Small: Story = {
  render: (args) => <StatefulCheckBox {...args} />,
  args: {
    name: 'smallCheckbox',
    value: 'smallValue',
    label: 'Small Checkbox',
    labelClass: 'text-text-primary text-sm leading-[100%]',
    checked: false,
    disabled: false,
    withText: true,
    size: 'small',
  },
};

export const Large: Story = {
  render: (args) => <StatefulCheckBox {...args} />,
  args: {
    name: 'largeCheckbox',
    value: 'largeValue',
    label: 'Large Checkbox',
    labelClass: 'text-text-primary text-sm leading-[100%]',
    checked: false,
    disabled: false,
    withText: true,
    size: 'large',
  },
};
