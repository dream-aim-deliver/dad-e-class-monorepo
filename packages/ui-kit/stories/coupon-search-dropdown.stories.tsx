import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CouponSearchDropdown,
  CouponSearchDropdownProps,
} from '../lib/components/coupon/coupon-search-dropdown';

const meta: Meta<typeof CouponSearchDropdown> = {
  title: 'Components/CouponSearchDropdown',
  tags: ['autodocs'],
  component: CouponSearchDropdown,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: {
        type: 'select',
        options: ['single', 'multiple'],
      },
    },
    options: { control: 'object' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    defaultValue: { control: 'object' },
    className: { control: 'text' },
    onSelectionChange: { action: 'selectionChanged' },
  },
};

export default meta;

type Story = StoryObj<CouponSearchDropdownProps>;

const packageOptions = [
  { label: 'Starter Package', value: 'starter' },
  { label: 'Professional Package', value: 'professional' },
  { label: 'Enterprise Package', value: 'enterprise' },
  { label: 'Academic License', value: 'academic' },
  { label: 'Team Bundle', value: 'team' },
];

const manyOptions = Array.from({ length: 20 }, (_, i) => ({
  label: `Course Package ${i + 1}`,
  value: `package-${i + 1}`,
}));

const StatefulCouponSearchDropdown = (args: CouponSearchDropdownProps) => {
  const [, setSelectedValue] = useState<string | string[] | null>(
    args.defaultValue || null,
  );

  const handleSelectionChange = (value: string | string[] | null) => {
    setSelectedValue(value);
    args.onSelectionChange(value);
  };

  return (
    <CouponSearchDropdown
      {...args}
      defaultValue={args.defaultValue}
      onSelectionChange={handleSelectionChange}
    />
  );
};

export const SingleSelect: Story = {
  render: (args) => <StatefulCouponSearchDropdown {...args} />,
  args: {
    mode: 'single',
    options: packageOptions,
    placeholder: 'Select a package',
    searchPlaceholder: 'Search packages...',
    className: 'w-64',
  },
};

export const MultiSelect: Story = {
  render: (args) => <StatefulCouponSearchDropdown {...args} />,
  args: {
    mode: 'multiple',
    options: packageOptions,
    defaultValue: ['starter', 'enterprise'],
    placeholder: 'Select packages',
    searchPlaceholder: 'Search packages...',
    className: 'w-64',
  },
};

export const ManyOptions: Story = {
  render: (args) => <StatefulCouponSearchDropdown {...args} />,
  args: {
    mode: 'single',
    options: manyOptions,
    placeholder: 'Select a course package',
    searchPlaceholder: 'Search courses...',
    className: 'w-64',
  },
};
