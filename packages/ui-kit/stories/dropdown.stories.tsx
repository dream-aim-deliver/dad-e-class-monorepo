import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown, DropdownProps } from '../lib/components/dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['simple', 'choose-color', 'multiple-choice-and-search'],
      },
    },
    options: { control: 'object' },
    defaultValue: { control: 'text' },
    className: { control: 'text' },
    onSelectionChange: { action: 'selectionChanged' },
    text: {
      control: 'object',
      description: 'Placeholder texts for different dropdown types',
    },
    position: {
      control: {
        type: 'select',
        options: ['top', 'bottom'],
      },
    },
  },
};

export default meta;

type Story = StoryObj<DropdownProps>;

const simpleOptions = [
  { label: 'Choice Alpha', value: 'Alpha' },
  { label: 'Choice Beta sdgdfgsdfgkn kebrkewgeukb', value: 'Beta' },
  { label: 'Choice Gamma', value: 'Gamma' },
];

const colorOptions = [
  {
    label: (
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="12" fill="#FF0000" />
        </svg>
        Red
      </div>
    ),
    value: 'red',
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="12" fill="#FFA500" />
        </svg>
        Orange
      </div>
    ),
    value: 'orange',
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="12" fill="#FFFF00" />
        </svg>
        Yellow
      </div>
    ),
    value: 'yellow',
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#008000"
        >
          <circle cx="12" cy="12" r="12" />
        </svg>
        Green
      </div>
    ),
    value: 'green',
  },
];

const multiSelectOptions = [
  { label: 'Checkbox Alpha', value: 'Checkbox Alpha' },
  { label: 'Checkbox Beta', value: 'Checkbox Beta' },
  { label: 'Checkbox Gamma', value: 'Checkbox Gamma' },
  { label: 'Checkbox Delta', value: 'Checkbox Delta' },
];

const StatefulDropdown = (args: DropdownProps) => {
  const [selectedValue, setSelectedValue] = useState<string | string[] | null>(
    args.defaultValue || null,
  );

  const handleSelectionChange = (value: string | string[] | null) => {
    setSelectedValue(value);
    args.onSelectionChange(value);
  };

  return (
    <Dropdown
      {...args}
      defaultValue={args.defaultValue}
      onSelectionChange={handleSelectionChange}
      text={args.text}
      position={args.position}
    />
  );
};

export const SimpleDropdown: Story = {
  render: (args) => <StatefulDropdown {...args} />,
  args: {
    type: 'simple',
    options: simpleOptions,
    defaultValue: simpleOptions[0].value,
    className: 'w-64',
    text: {
      simpleText: 'Select an option',
    },
    position: 'bottom',
  },
};

export const ChooseColorDropdown: Story = {
  render: (args) => <StatefulDropdown {...args} />,
  args: {
    type: 'choose-color',
    options: colorOptions,
    defaultValue: colorOptions[0].value,
    className: 'w-64',
    text: {
      colorText: 'Choose a color',
    },
    position: 'bottom',
  },
};

export const MultiSelectAndSearchDropdown: Story = {
  render: (args) => <StatefulDropdown {...args} />,
  args: {
    type: 'multiple-choice-and-search',
    options: [
      {
        label: 'Checkbox Alpha',
        value: 'Checkbox Alpha',
      },
      {
        label: 'Checkbox Beta BetaBetaBetaBetaBetaBeta',
        value: 'Checkbox Beta',
      },
      {
        label: 'Checkbox Gamma',
        value: 'Checkbox Gamma',
      },
      {
        label: 'Checkbox Delta',
        value: 'Checkbox Delta',
      },
    ],
    defaultValue: [multiSelectOptions[0].value, multiSelectOptions[2].value],
    className: 'w-64',
    text: {
      multiText: 'Choose Options',
    },
    position: 'bottom',
  },
};
