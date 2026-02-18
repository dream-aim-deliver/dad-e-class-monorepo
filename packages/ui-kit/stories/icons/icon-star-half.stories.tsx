import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconStarHalf } from '../../lib/components/icons/icon-star-half';

// Meta configuration for Storybook
const meta: Meta<typeof IconStarHalf> = {
  title: 'Icons/IconStarHalf',
  component: IconStarHalf,
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
type Story = StoryObj<typeof IconStarHalf>;

// Default story
export const Default: Story = {
  args: {
    classNames: 'text-button-secondary-text',
  },
};

// Customizable story
export const CustomIcon: Story = {
  args: {
    size: '10',
    classNames: 'text-button-secondary-text',
  },
};
