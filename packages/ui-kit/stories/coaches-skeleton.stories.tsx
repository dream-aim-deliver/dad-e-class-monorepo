import { Meta, StoryObj } from '@storybook/react-vite';
import { CoachesSkeleton } from '../lib/components/coaches-skeleton';

export default {
    title: 'Components/CoachesSkeleton',
    component: CoachesSkeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale for translations',
        },
        onRegister: {
            action: 'clicked',
            description: 'Function to call when the register button is clicked',
        },
    },
} satisfies Meta<typeof CoachesSkeleton>;

type Story = StoryObj<typeof CoachesSkeleton>;

export const Default: Story = {
    args: {
        locale: 'en',
        onRegister: () => alert('Register button clicked'),
    },
    render: (args) => <CoachesSkeleton {...args} />,
};
