import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconVideoCamera } from '../../lib/components/icons/icon-video-camera';

// Meta configuration for Storybook
const meta: Meta<typeof IconVideoCamera> = {
    title: 'Icons/IconVideoCamera',
    component: IconVideoCamera,
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
type Story = StoryObj<typeof IconVideoCamera>;

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
