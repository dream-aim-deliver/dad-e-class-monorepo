import { Meta, StoryObj } from '@storybook/react';
import { IconLanguage } from '../../lib/components/icons/icon-language';


// Meta configuration for Storybook
const meta: Meta<typeof IconLanguage> = {

  title: 'Icons/IconLanguage',
  component: IconLanguage,
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
} as Meta;



export default meta;

type Story = StoryObj<typeof IconLanguage>;

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