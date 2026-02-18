import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconCategory } from '../../lib/components/icons/icon-category';

// Meta configuration for Storybook
const meta: Meta<typeof IconCategory> = {
    title: 'Icons/IconCategory',
    component: IconCategory,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'number' },
            description:
                'The size of the icon (height and width in Tailwind CSS).',
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
type Story = StoryObj<typeof IconCategory>;

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
        classNames: 'rotate-45 text-button-secondary-text',
    },
};
