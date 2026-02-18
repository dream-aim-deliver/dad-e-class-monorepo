import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconSuccess } from '../../lib/components/icons/icon-success';

// Meta configuration for Storybook
const meta: Meta<typeof IconSuccess> = {
  title: 'Icons/IconSuccess',
  component: IconSuccess,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number' },
      description: 'The size of the icon (height and width in Tailwind CSS).',
      defaultValue: 6,
    },
    fill: {
      control: { type: 'text' },
      description: 'The fill color of the icon.',
      defaultValue: 'currentColor',
    },
    classNames: {
      control: { type: 'text' },
      description:
        'Additional TailwindCSS classes to apply to the icon for styling.',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof IconSuccess>;

// Default story
export const Default: Story = {
  args: {
    classNames: 'text-feedback-success-primary',
  },
};

// Customizable story
export const CustomIcon: Story = {
  args: {
    size: '10',
    classNames: 'rotate-45 text-feedback-success-primary',
  },
};
