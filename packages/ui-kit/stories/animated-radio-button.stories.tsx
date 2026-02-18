import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatedRadioButton, AnimatedRadioButtonProps } from '../lib/components/animated-radio-button';

const meta: Meta<typeof AnimatedRadioButton> = {
    title: 'Components/AnimatedRadioButton',
    component: AnimatedRadioButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
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

type Story = StoryObj<AnimatedRadioButtonProps>;

const StatefulAnimatedRadioButton = (args: AnimatedRadioButtonProps) => {
    const [isChecked, setIsChecked] = useState(args.checked || false);

    const handleChange = (value: string) => {
        setIsChecked(!isChecked);
        args.onChange?.(value);
    };

    return <AnimatedRadioButton {...args} checked={isChecked} onChange={handleChange} />;
};

export const Default: Story = {
    render: (args) => <StatefulAnimatedRadioButton {...args} />,
    args: {
        name: 'defaultRadioButton',
        value: 'defaultValue',
        label: 'Default Radio Button',
        withText: true,
    },
};

export const SmallSize: Story = {
    render: (args) => <StatefulAnimatedRadioButton {...args} />,
    args: {
        name: 'smallRadioButton',
        value: 'smallValue',
        label: 'Small Radio Button',
        size: 'small',
        withText: true,
    },
};

export const MediumSize: Story = {
    render: (args) => <StatefulAnimatedRadioButton {...args} />,
    args: {
        name: 'mediumRadioButton',
        value: 'mediumValue',
        label: 'Medium Radio Button',
        size: 'medium',
        withText: true,
    },
};

export const LargeSize: Story = {
    render: (args) => <StatefulAnimatedRadioButton {...args} />,
    args: {
        name: 'largeRadioButton',
        value: 'largeValue',
        label: 'Large Radio Button',
        size: 'large',
        withText: true,
    },
};

export const Disabled: Story = {
    render: (args) => <StatefulAnimatedRadioButton {...args} />,
    args: {
        name: 'disabledRadioButton',
        value: 'disabledValue',
        label: 'Disabled Radio Button',
        disabled: true,
        withText: true,
    },
};

export const WithoutLabel: Story = {
    render: (args) => <StatefulAnimatedRadioButton {...args} />,
    args: {
        name: 'noLabelRadioButton',
        value: 'noLabelValue',
        withText: false,
    },
};

export const CustomLabelStyle: Story = {
    render: (args) => <StatefulAnimatedRadioButton {...args} />,
    args: {
        name: 'customLabelRadioButton',
        value: 'customLabelValue',
        label: 'Custom Label Style',
        withText: true,
        labelClass: 'text-lg font-bold text-blue-500',
    },
}; 