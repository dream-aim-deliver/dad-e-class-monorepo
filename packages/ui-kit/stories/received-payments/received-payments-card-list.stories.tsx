import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReceivedPaymentsCardList } from '../../lib/components/received-payments/received-payments-card-list';
import { ReceivedPaymentsCard } from '../../lib/components/received-payments/received-payments-card';

const meta: Meta<typeof ReceivedPaymentsCardList> = {
    title: 'Components/ReceivedPayments/ReceivedPaymentsCardList',
    component: ReceivedPaymentsCardList,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof ReceivedPaymentsCardList>;

// Sample card data
const sampleCards = [
    {
        transactionId: '912840',
        transactionDate: '2024-12-13',
        total: '248.00 CHF',
        fromStudentName: 'John Doe',
        items: [
            '2x 40min coaching sessions',
            '4x "Intro to photography" course sales',
            '1x "Advanced photo editing" course sale',
            '20x assignments reviewed',
        ],
        tags: ['Assignments', 'Coaching Session', 'Custom Tag B'],
    },
    {
        transactionId: '912839',
        transactionDate: '2024-12-12',
        total: '150.00 CHF',
        fromStudentName: 'Jane Smith',
        items: [
            '3x 30min coaching sessions',
            '2x "Design Fundamentals" course sales',
        ],
        tags: ['Coaching Session', 'Design'],
    },
    {
        transactionId: '912838',
        transactionDate: '2024-12-11',
        total: '450.00 CHF',
        fromStudentName: 'Bob Johnson',
        items: [
            '1x "Complete Marketing Bundle" package sale',
            '5x 60min group sessions',
            '10x assignments reviewed',
        ],
        tags: ['Package', 'Assignments'],
    },
    {
        transactionId: '912837',
        transactionDate: '2024-12-10',
        total: '89.99 CHF',
        fromStudentName: 'Alice Williams',
        items: [
            '1x "Photography Basics" course sale',
        ],
        tags: ['Course Sales'],
    },
];

// Default with multiple cards
export const Default: Story = {
    args: {
        locale: 'en',
        children: sampleCards.map((card, index) => (
            <ReceivedPaymentsCard
                key={index}
                locale="en"
                {...card}
                onInvoiceClick={() => alert(`Invoice clicked for ${card.transactionId}`)}
            />
        )),
    },
};

// Empty state
export const Empty: Story = {
    args: {
        locale: 'en',
        children: [],
    },
};

// Single card
export const SingleCard: Story = {
    args: {
        locale: 'en',
        children: (
            <ReceivedPaymentsCard
                locale="en"
                transactionId="912840"
                transactionDate="2024-12-13"
                total="248.00 CHF"
                fromStudentName="John Doe"
                items={[
                    '2x 40min coaching sessions',
                    '4x "Intro to photography" course sales',
                    '1x "Advanced photo editing" course sale',
                    '20x assignments reviewed',
                ]}
                tags={['Assignments', 'Coaching Session', 'Custom Tag B']}
                onInvoiceClick={() => alert('Invoice clicked')}
            />
        ),
    },
};

// Many cards
export const ManyCards: Story = {
    args: {
        locale: 'en',
        children: [
            ...sampleCards,
            ...sampleCards,
            ...sampleCards,
        ].map((card, index) => (
            <ReceivedPaymentsCard
                key={index}
                locale="en"
                {...card}
                transactionId={`${card.transactionId}-${index}`}
                onInvoiceClick={() => alert(`Invoice clicked for ${card.transactionId}-${index}`)}
            />
        )),
    },
};

// German locale
export const GermanLocale: Story = {
    args: {
        locale: 'de',
        children: [
            {
                transactionId: '912840',
                transactionDate: '13.12.2024',
                total: '248,00 CHF',
                fromStudentName: 'Hans Müller',
                items: [
                    '2x 40min Coaching-Sitzungen',
                    '4x "Einführung in die Fotografie" Kursverkäufe',
                    '20x Aufgaben überprüft',
                ],
                tags: ['Aufgaben', 'Coaching-Sitzung'],
            },
            {
                transactionId: '912839',
                transactionDate: '12.12.2024',
                total: '150,00 CHF',
                fromStudentName: 'Maria Schmidt',
                items: [
                    '3x 30min Coaching-Sitzungen',
                    '2x "Design-Grundlagen" Kursverkäufe',
                ],
                tags: ['Coaching-Sitzung', 'Design'],
            },
        ].map((card, index) => (
            <ReceivedPaymentsCard
                key={index}
                locale="de"
                {...card}
                onInvoiceClick={() => alert(`Rechnung angeklickt für ${card.transactionId}`)}
            />
        )),
    },
};
