import type { Meta, StoryObj } from '@storybook/react-vite';
import { BuyCourseCoachingSessions } from '../lib/components/buy-course-coaching-sessions';
import { useState } from 'react';

const meta: Meta<typeof BuyCourseCoachingSessions> = {
    title: 'Components/BuyCourseCoachingSessions',
    component: BuyCourseCoachingSessions,
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

type Story = StoryObj<typeof BuyCourseCoachingSessions>;

const mockCoachingOfferings = [
    {
        id: '1',
        name: 'Web Development Fundamentals',
        price: 50,
        duration: 60,
        currency: 'CHF',
        description: 'Learn the fundamentals of web development',
    },
    {
        id: '2',
        name: 'Advanced React Techniques',
        price: 75,
        duration: 90,
        currency: 'CHF',
        description: 'Master advanced React patterns',
    },
    {
        id: '3',
        name: 'UI/UX Design Masterclass',
        price: 60,
        duration: 45,
        currency: 'CHF',
        description: 'Learn UI/UX design principles',
    },
];

const mockCoachingSessions = [
    {
        status: 'not_purchased' as const,
        coachingOfferingTitle: 'Web Development Fundamentals',
        coachingOfferingDuration: 60,
        coachingSessionId: 1,
        lessonComponentId: 'lesson-1',
        lessonId: 1,
        lessonTitle: 'Introduction to Web Development',
        moduleId: 1,
        moduleTitle: 'Module 1: Basics',
        purchaseDate: null,
    },
    {
        status: 'not_purchased' as const,
        coachingOfferingTitle: 'Web Development Fundamentals',
        coachingOfferingDuration: 60,
        coachingSessionId: 2,
        lessonComponentId: 'lesson-2',
        lessonId: 1,
        lessonTitle: 'Introduction to Web Development',
        moduleId: 1,
        moduleTitle: 'Module 1: Basics',
        purchaseDate: null,
    },
    {
        status: 'not_purchased' as const,
        coachingOfferingTitle: 'Advanced React Techniques',
        coachingOfferingDuration: 90,
        coachingSessionId: 3,
        lessonComponentId: 'lesson-3',
        lessonId: 2,
        lessonTitle: 'Advanced React Patterns',
        moduleId: 2,
        moduleTitle: 'Module 2: Advanced',
        purchaseDate: null,
    },
    {
        status: 'not_purchased' as const,
        coachingOfferingTitle: 'Advanced React Techniques',
        coachingOfferingDuration: 90,
        coachingSessionId: 4,
        lessonComponentId: 'lesson-4',
        lessonId: 2,
        lessonTitle: 'Advanced React Patterns',
        moduleId: 2,
        moduleTitle: 'Module 2: Advanced',
        purchaseDate: null,
    },
    {
        status: 'purchased' as const,
        coachingOfferingTitle: 'UI/UX Design Masterclass',
        coachingOfferingDuration: 45,
        coachingSessionId: 5,
        lessonComponentId: 'lesson-5',
        lessonId: 3,
        lessonTitle: 'Design Principles',
        moduleId: 3,
        moduleTitle: 'Module 3: Design',
        purchaseDate: '2024-01-15T10:00:00Z',
    },
];

export const Default: Story = {
    args: {
        coachingSessions: mockCoachingSessions,
        coachingOfferings: mockCoachingOfferings,
        onPurchase: (lessonComponentIds) => console.log('Purchased:', lessonComponentIds),
        onClose: () => console.log('Modal closed'),
        locale: 'en'
    }
};

export const WithManySessions: Story = {
    args: {
        coachingSessions: [
            ...mockCoachingSessions,
            ...Array.from({ length: 10 }, (_, i) => ({
                status: 'not_purchased' as const,
                coachingOfferingTitle: `Session Type ${i % 3 + 1}`,
                coachingOfferingDuration: 60 + (i % 3) * 15,
                coachingSessionId: 100 + i,
                lessonComponentId: `lesson-${100 + i}`,
                lessonId: i + 1,
                lessonTitle: `Lesson ${i + 1}`,
                moduleId: Math.floor(i / 3) + 1,
                moduleTitle: `Module ${Math.floor(i / 3) + 1}`,
                purchaseDate: null,
            }))
        ],
        coachingOfferings: mockCoachingOfferings,
        onPurchase: (lessonComponentIds) => console.log('Purchased:', lessonComponentIds),
        onClose: () => console.log('Modal closed'),
        locale: 'en'
    }
};

export const GermanLocale: Story = {
    args: {
        coachingSessions: mockCoachingSessions,
        coachingOfferings: mockCoachingOfferings,
        onPurchase: (lessonComponentIds) => console.log('Purchased:', lessonComponentIds),
        onClose: () => console.log('Modal closed'),
        locale: 'de'
    }
};

export const EmptyState: Story = {
    args: {
        coachingSessions: [],
        coachingOfferings: mockCoachingOfferings,
        onPurchase: (lessonComponentIds) => console.log('Purchased:', lessonComponentIds),
        onClose: () => console.log('Modal closed'),
        locale: 'en'
    }
};

export const AllPurchased: Story = {
    args: {
        coachingSessions: mockCoachingSessions.map(session => ({
            ...session,
            status: 'purchased' as const,
            purchaseDate: '2024-01-15T10:00:00Z',
        })),
        coachingOfferings: mockCoachingOfferings,
        onPurchase: (lessonComponentIds) => console.log('Purchased:', lessonComponentIds),
        onClose: () => console.log('Modal closed'),
        locale: 'en'
    }
};

