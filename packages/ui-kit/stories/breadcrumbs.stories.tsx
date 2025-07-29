import { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from '../lib/components/breadcrumbs';

export default {
    title: 'Components/Breadcrumbs',
    component: Breadcrumbs,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        items: {
            description:
                'List of breadcrumb items with labels and click handlers',
        },
    },
} satisfies Meta<typeof Breadcrumbs>;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
    args: {
        items: [
            { label: 'Home', onClick: () => alert('Clicked on Home') },
            {
                label: 'Dashboard',
                onClick: () => alert('Clicked on Dashboard'),
            },
            { label: 'Settings', onClick: () => alert('Clicked on Settings') },
        ],
    },
};
