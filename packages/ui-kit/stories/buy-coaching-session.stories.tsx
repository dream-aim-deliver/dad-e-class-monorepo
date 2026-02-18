import type { Meta, StoryObj } from '@storybook/react-vite';
import BuyCoachingSession from '../lib/components/buy-coaching-session';
import { useState } from 'react';

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

const mockOfferings = [
    {
        id: '1',
        title: 'Web Development Fundamentals',
        price: 50,
        duration: 60,
        totalSessions: 0,
        content: "This is a simple tooltip with some information"
    },
    {
        id: '2',
        title: 'Advanced React Techniques',
        price: 75,
        duration: 90,
        totalSessions: 0,

        content: "This is a simple tooltip with some information"
    },
    {
        id: '3',
        title: 'UI/UX Design Masterclass',
        price: 60,
        duration: 45,
        totalSessions: 0,
        content: "This is a simple tooltip with some information"
    }
];

export const Default: Story = {
    args: {
        onBuy: (sessionsPerOffering) => console.log(sessionsPerOffering),
        offerings: mockOfferings,
        currencyType: 'CHF',
        locale: 'en'
    }
};

export const WithPreselectedSessions: Story = {
    args: {
        onBuy: (sessionsPerOffering) => console.log(sessionsPerOffering),
        offerings: mockOfferings,
        currencyType: 'CHF',
        locale: 'en'
    }
};

export const GermanLocale: Story = {
    args: {
        onBuy: (sessionsPerOffering) => console.log(sessionsPerOffering),
        offerings: mockOfferings,
        currencyType: 'CHF',
        locale: 'de'
    }
};

export const GermanLocaleWithSessions: Story = {
    args: {
        onBuy: (sessionsPerOffering) => console.log(sessionsPerOffering),
        offerings: mockOfferings,
        currencyType: 'CHF',
        locale: 'de'
    }
};