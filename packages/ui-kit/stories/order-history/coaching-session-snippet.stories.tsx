import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    CoachingSessionSnippet,
    CoachingSessionSnippetProps,
} from '../../lib/components/order-history/coaching-session-snippet';

const meta: Meta<typeof CoachingSessionSnippet> = {
    title: 'Components/OrderHistory/CoachingSessionSnippet',
    component: CoachingSessionSnippet,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale used for dictionary translations.',
        },
        sessionName: {
            control: 'text',
            description: 'Name of the coaching session (e.g. "Quick sprint").',
        },
        durationMinutes: {
            control: { type: 'number', min: 0 },
            description: 'Duration of the session in minutes.',
        },
        count: {
            control: { type: 'number', min: 1 },
            description: 'Number of sessions of this type.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof CoachingSessionSnippet>;

const baseArgs: CoachingSessionSnippetProps = {
    locale: 'en',
    sessionName: 'Quick sprint',
    durationMinutes: 20,
    count: 2,
};

export const Default: Story = {
    args: {
        ...baseArgs,
    },
};

export const LongerSession: Story = {
    args: {
        ...baseArgs,
        sessionName: 'Full immersion',
        durationMinutes: 60,
        count: 1,
    },
};

export const MultipleSessions: Story = {
    args: {
        ...baseArgs,
        sessionName: 'Strategy review',
        durationMinutes: 30,
        count: 5,
    },
};
