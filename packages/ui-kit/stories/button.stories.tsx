import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/button';



const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'text'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'big', 'huge'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const TextVariant: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="small">Small Button</Button>
      <Button size="medium">Medium Button</Button>
      <Button size="big">Big Button</Button>
      <Button size="huge">Huge Button</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled variant="primary">Disabled Primary</Button>
      <Button disabled variant="secondary">Disabled Secondary</Button>
      <Button disabled variant="text">Disabled Text</Button>
    </div>
  ),
};

export const Interactions: Story = {
  render: () => {
    const handleClick = () => {
      alert('Button clicked!');
    };

    return (
      <div className="flex items-center gap-4">
        <Button onClick={handleClick}>Click Me</Button>
        <Button variant="secondary" onClick={handleClick}>Secondary Click</Button>
      </div>
    );
  },
};

export const FullCustomization: Story = {
  args: {
    variant: 'primary',
    size: 'big',
    children: 'Customized Button',
    className: 'bg-purple-500 text-white hover:bg-purple-600',
  },
};