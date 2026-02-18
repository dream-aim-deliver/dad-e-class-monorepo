import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    OrderHistoryCard,
    OrderHistoryCardProps,
} from '../../lib/components/order-history/order-history-card';

const meta: Meta<typeof OrderHistoryCard> = {
    title: 'Components/OrderHistory/OrderHistoryCard',
    component: OrderHistoryCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        type: {
            control: 'select',
            options: ['course', 'coaching', 'package'],
        },
        onInvoiceClick: { action: 'onInvoiceClick' },
        onSchedule: { action: 'onSchedule' },
        orderId: {
            control: 'text',
            description: 'Unique order identifier',
        },
        orderDate: {
            control: 'text',
            description: 'Order date and time',
        },
        total: {
            control: 'text',
            description: 'Total order amount',
        },
    },
};

export default meta;
type Story = StoryObj<typeof OrderHistoryCard>;

const baseArgs: Omit<OrderHistoryCardProps, 'type'> = {
    locale: 'en',
    orderId: '861284',
    orderDate: '2024-08-10 at 17:01',
    total: '120 CHF',
    onInvoiceClick: () => alert('Invoice clicked'),
};


// Course variant
export const Course: Story = {
    args: {
        ...baseArgs,
        type: 'course',
        courseTitle: 'Course Title',
        courseImageUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        onClickCourse: () => alert('Course clicked'),
    },
};

// Coaching variant
export const Coaching: Story = {
    args: {
        ...baseArgs,
        type: 'coaching',
        sessions: [
            {
                sessionName: 'Quick sprint',
                durationMinutes: 20,
                count: 4
            },
            {
                sessionName: 'Full immersion',
                durationMinutes: 60,
                count: 1
            },
        ],
        onSchedule: () => alert('Schedule clicked'),
    },
};

// Package variant
export const Package: Story = {
    args: {
        ...baseArgs,
        type: 'package',
        packageTitle: 'Package Title',
        packageImageUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        coursesIncluded: [
            {
                title: 'Course Title',
                imageUrl:
                    'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
                onClick: () => alert('First course clicked'),
            },
            {
                title: 'Course Title',
                imageUrl:
                    'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
                onClick: () => alert('Second course clicked'),
            },
        ],
    },
};
