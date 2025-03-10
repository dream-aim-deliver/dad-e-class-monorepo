import type { Meta, StoryObj } from '@storybook/react';
import BuyCoachingSession from '../lib/components/buy-coaching-session';

const meta: Meta<typeof BuyCoachingSession> = {
    title: 'Components/BuyCoachingSession',
    component: BuyCoachingSession,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            defaultValue: 'en'
        }

    }
};

export default meta;

type Story = StoryObj<typeof BuyCoachingSession>;

const mockCourses = [
    {
        id: '1',
        title: 'Web Development Fundamentals',
        price: 50,
        duration: 60,
        totalSessions: 0,
    },
    {
        id: '2',
        title: 'Advanced React Techniques',
        price: 75,
        duration: 90,
        totalSessions: 0,
        currencyType: 'CHF'
    },
    {
        id: '3',
        title: 'UI/UX Design Masterclass',
        price: 60,
        duration: 45,
        totalSessions: 0,
    }
];

export const Default: Story = {
    args: {
        onClick:()=>alert('Clicked'),
        courses: mockCourses,
        currencyType: 'CHF',
        locale: 'en'
    }
};

export const WithPreselectedSessions: Story = {
    args: {
        onClick:()=>alert('Clicked'),
        courses: mockCourses.map(course => ({
            ...course,
            totalSessions: course.id === '2' ? 3 : 1
        })),
        currencyType: 'CHF',
        locale: 'en'
    }
};

export const GermanLocale: Story = {
    args: {
        onClick:()=>alert('Angeklickt'),
        courses: mockCourses,
        currencyType: 'CHF',
        locale: 'de'
    }
};

export const GermanLocaleWithSessions: Story = {
    args: {
        onClick:()=>alert('Angeklickt'),
        courses: mockCourses.map(course => ({
            ...course,
            totalSessions: course.id === '1' ? 2 : course.id === '3' ? 1 : 0
        })),
        currencyType: 'CHF',
        locale: 'de'
    }
};