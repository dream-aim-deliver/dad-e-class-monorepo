import type { Meta, StoryObj } from '@storybook/react-vite';
import { OrderHistoryCardList } from '../../lib/components/order-history/order-history-card-list';
import { OrderHistoryCard } from '../../lib/components/order-history/order-history-card';

const meta: Meta<typeof OrderHistoryCardList> = {
    title: 'Components/OrderHistory/OrderHistoryCardList',
    component: OrderHistoryCardList,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof OrderHistoryCardList>;


// Empty state
export const Empty: Story = {
    args: {
        locale: 'en',
        children: [],
    },
};

// Single order
export const SingleOrder: Story = {
    args: {
        locale: 'en',
        children: (
            <OrderHistoryCard
                locale="en"
                type="course"
                orderId="861284"
                orderDate="2024-08-10 at 17:01"
                total="120 CHF"
                courseTitle="Introduction to React"
                courseImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                onClickCourse={() => alert('Course clicked')}
                onInvoiceClick={() => alert('Invoice clicked')}
            />
        ),
    },
};

// Multiple orders (mixed types)
export const MultipleOrders: Story = {
    args: {
        locale: 'en',
        children: [
            <OrderHistoryCard
                key="order-1"
                locale="en"
                type="course"
                orderId="861284"
                orderDate="2024-08-10 at 17:01"
                total="120 CHF"
                courseTitle="Introduction to React"
                courseImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                onClickCourse={() => alert('Course clicked')}
                onInvoiceClick={() => alert('Invoice clicked')}
            />,
            <OrderHistoryCard
                key="order-2"
                locale="en"
                type="coaching"
                orderId="861285"
                orderDate="2024-08-09 at 14:30"
                total="250 CHF"
                sessions={[
                    {
                        sessionName: 'Quick sprint',
                        durationMinutes: 20,
                        count: 4,
                    },
                    {
                        sessionName: 'Full immersion',
                        durationMinutes: 60,
                        count: 1,
                    },
                ]}
                onSchedule={() => alert('Schedule clicked')}
                onInvoiceClick={() => alert('Invoice clicked')}
            />,
            <OrderHistoryCard
                key="order-3"
                locale="en"
                type="package"
                orderId="861286"
                orderDate="2024-08-08 at 09:15"
                total="450 CHF"
                packageTitle="Full Stack Development Bundle"
                packageImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                coursesIncluded={[
                    {
                        title: 'React Fundamentals',
                        imageUrl:
                            'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
                        onClick: () => alert('React course clicked'),
                    },
                    {
                        title: 'Node.js Backend',
                        imageUrl:
                            'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
                        onClick: () => alert('Node course clicked'),
                    },
                    {
                        title: 'Database Design',
                        imageUrl:
                            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
                        onClick: () => alert('Database course clicked'),
                    },
                ]}
                onInvoiceClick={() => alert('Invoice clicked')}
            />,
        ],
    },
};

// 4️⃣ German locale
export const GermanLocale: Story = {
    args: {
        locale: 'de',
        children: [
            <OrderHistoryCard
                key="order-1"
                locale="de"
                type="course"
                orderId="861284"
                orderDate="2024-08-10 um 17:01"
                total="120 CHF"
                courseTitle="Einführung in React"
                courseImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                onClickCourse={() => alert('Kurs angeklickt')}
                onInvoiceClick={() => alert('Rechnung angeklickt')}
            />,
            <OrderHistoryCard
                key="order-2"
                locale="de"
                type="coaching"
                orderId="861285"
                orderDate="2024-08-09 um 14:30"
                total="250 CHF"
                sessions={[
                    {
                        sessionName: 'Schneller Sprint',
                        durationMinutes: 20,
                        count: 4,
                    },
                ]}
                onSchedule={() => alert('Planen angeklickt')}
                onInvoiceClick={() => alert('Rechnung angeklickt')}
            />,
        ],
    },
};
