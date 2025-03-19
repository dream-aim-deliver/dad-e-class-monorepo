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
    title: {
      control: 'text',
      description: 'Optional title displayed at the top of the tooltip',
    },
    description: {
      control: 'text',
      description: 'The content displayed in the tooltip',
    },
    textClassName: {
      control: 'text',
      description: 'Custom class names for styling the tooltip trigger',
    },
    contentClassName: {
      control: 'text',
      description: 'Custom class names for styling the tooltip content',
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'auto'],
      description: 'Position of the tooltip relative to the trigger',
      defaultValue: 'auto',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  args: {
    text: 'Hover me',
    description: 'This is a simple tooltip with some information',
  },
};

export const WithTitle: Story = {
  args: {
    text: 'Hover for details',
    title: 'Important Information',
    description: 'This tooltip includes a title and description',
  },
};

export const LongContent: Story = {
  args: {
    text: 'Help',
    title: 'Need Assistance?',
    description: 'This tooltip contains a longer description that demonstrates how the component handles multiple lines of text. The max-width property ensures the tooltip has a reasonable width on screen.',
  },
};

export const CustomStyles: Story = {
  args: {
    text: 'Custom Styled',
    title: 'Custom Tooltip',
    description: 'This tooltip uses custom classes for styling both the trigger and content.',
    textClassName: 'text-blue-500 font-bold',
    contentClassName: 'bg-slate-800 text-white border-blue-500',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tooltip with custom styling applied through className props',
      },
    },
  },
};

export const PositionTop: Story = {
  args: {
    text: 'Always on Top',
    description: 'This tooltip is forced to appear above the trigger element',
    position: 'top',
  },
};

export const PositionBottom: Story = {
  args: {
    text: 'Always on Bottom',
    description: 'This tooltip is forced to appear below the trigger element',
    position: 'bottom',
  },
};

// You might want to manually test focus behavior
export const Keyboard: Story = {
  args: {
    text: 'Tab to me',
    title: 'Keyboard Accessible',
    description: 'This tooltip should appear when you tab to it, demonstrating keyboard accessibility',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story helps test keyboard focus behavior. Try tabbing to the element.',
      },
    },
  },
};