import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ReceivedPaymentsCard,
    ReceivedPaymentsCardProps,
} from '../../lib/components/received-payments/received-payments-card';

const meta: Meta<typeof ReceivedPaymentsCard> = {
    title: 'Components/ReceivedPayments/ReceivedPaymentsCard',
    component: ReceivedPaymentsCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        transactionId: {
            control: 'text',
            description: 'Unique transaction identifier',
        },
        transactionDate: {
            control: 'text',
            description: 'Transaction date',
        },
        total: {
            control: 'text',
            description: 'Total payment amount',
        },
        fromStudentName: {
            control: 'text',
            description: 'Name of the student who made the payment',
        },
        items: {
            control: 'object',
            description: 'List of items included in the payment',
        },
        tags: {
            control: 'object',
            description: 'Optional tags to categorize the payment',
        },
        onInvoiceClick: { action: 'onInvoiceClick' },
    },
};

export default meta;
type Story = StoryObj<typeof ReceivedPaymentsCard>;

const baseArgs: ReceivedPaymentsCardProps = {
    locale: 'en',
    transactionId: '912840',
    transactionDate: '2024-12-13',
    total: '248.00 CHF',
    fromStudentName: 'John Doe',
    items: [
        '2x 40min coaching sessions',
        '4x "Intro to photography" course sales',
        '1x "Advanced photo editing" course sale, as part of "Complete photography" package',
        '20x assignments reviewed',
    ],
    tags: ['Assignments', 'Coaching Session', 'Custom Tag B'],
    onInvoiceClick: () => alert('Invoice clicked'),
};

// Default story
export const Default: Story = {
    args: baseArgs,
};

// With few items
export const FewItems: Story = {
    args: {
        ...baseArgs,
        items: [
            '2x 40min coaching sessions',
            '1x "Photography Basics" course sale',
        ],
        tags: ['Coaching Session'],
        total: '89.99 CHF',
    },
};

// With many items
export const ManyItems: Story = {
    args: {
        ...baseArgs,
        items: [
            '5x 30min coaching sessions',
            '3x "Introduction to Design" course sales',
            '2x "Advanced Photoshop" course sales',
            '1x "Complete Design Bundle" package sale',
            '15x assignments reviewed',
            '4x 60min group sessions',
            '2x "Marketing Fundamentals" course sales',
            '30x student evaluations',
        ],
        tags: ['Assignments', 'Coaching Session', 'Package', 'Course Sales'],
        total: '1,248.50 CHF',
    },
};

// German locale
export const GermanLocale: Story = {
    args: {
        ...baseArgs,
        locale: 'de',
        items: [
            '2x 40min Coaching-Sitzungen',
            '4x "Einführung in die Fotografie" Kursverkäufe',
            '1x "Fortgeschrittene Fotobearbeitung" Kursverkauf, als Teil des "Komplette Fotografie" Pakets',
            '20x Aufgaben überprüft',
        ],
        tags: ['Aufgaben', 'Coaching-Sitzung', 'Benutzerdefiniertes Tag B'],
    },
};

// Without tags
export const WithoutTags: Story = {
    args: {
        ...baseArgs,
        tags: undefined,
    },
};
