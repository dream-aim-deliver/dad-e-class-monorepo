import type { Meta, StoryObj } from '@storybook/react';
import { CheckBox, CheckBoxProps } from '@/components/checkBox';

const meta: Meta<typeof CheckBox> = {
  title: 'Components/CheckBox',
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
  },
};

export default meta;

type Story = StoryObj<CheckBoxProps>;

export const Default: Story = {
  args: {
    name: 'defaultCheckbox',
    value: 'defaultValue',
    label: 'Default Checkbox',
    checked: false,
    disabled: false,
    withText: true,
    size: 'medium',
  },
};

export const Checked: Story = {
  args: {
    name: 'checkedCheckbox',
    value: 'checkedValue',
    label: 'Checked Checkbox',
    checked: true,
    disabled: false,
    withText: true,
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabledCheckbox',
    value: 'disabledValue',
    label: 'Disabled Checkbox',
    checked: false,
    disabled: true,
    withText: true,
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    name: 'smallCheckbox',
    value: 'smallValue',
    label: 'Small Checkbox',
    checked: false,
    disabled: false,
    withText: true,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    name: 'largeCheckbox',
    value: 'largeValue',
    label: 'Large Checkbox',
    checked: false,
    disabled: false,
    withText: true,
    size: 'large',
  },
};
