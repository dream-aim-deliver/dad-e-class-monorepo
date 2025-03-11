// Tooltip.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from "../lib/components/tooltip"

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The trigger text that users interact with',
    },
    content: {
      control: 'text',
      description: 'The content displayed in the tooltip',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  args: {
    text: 'Hover me',
    content: 'This is a simple tooltip with some information',
  },
};

export const LongContent: Story = {
  args: {
    text: 'Help',
    content: 'This tooltip contains a longer description that demonstrates how the component handles multiple lines of text. The max-width property ensures the tooltip has a reasonable width on screen.',
  },
};

export const WithFormatting: Story = {
  args: {
    text: 'Terms & Conditions',
    content: 'By accepting, you agree to our terms of service and privacy policy. Learn more about how we handle your data.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tooltip with formatted content to demonstrate styling capabilities',
      },
    },
  },
};

// You might want to manually test focus behavior
export const Keyboard: Story = {
  args: {
    text: 'Tab to me',
    content: 'This tooltip should appear when you tab to it, demonstrating keyboard accessibility',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story helps test keyboard focus behavior. Try tabbing to the element.',
      },
    },
  },
};