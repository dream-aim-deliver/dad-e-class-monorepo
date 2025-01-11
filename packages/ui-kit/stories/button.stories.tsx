import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from '@/components/button';


const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
    variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tirtary', 'text', 'danger'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
  },
} as Meta;

export default meta;


type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: 'Primary',
        variant: 'primary',
        size: 'medium',
    },
}