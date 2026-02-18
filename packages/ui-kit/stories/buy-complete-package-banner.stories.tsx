import type { Meta, StoryObj } from '@storybook/react-vite';
import { BuyCompletePackageBanner } from '../lib/components/buy-complete-package-banner';

export default {
    title: 'Components/BuyCompletePackageBanner',
    component: BuyCompletePackageBanner,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            defaultValue: 'en',
            description: 'The language locale for translations',
        },
        imageUrl: {
            control: 'text',
            description: 'URL of the card image',
        },
        title: {
            control: 'text',
            description: 'Title of the package card',
        },
        description: {
            control: 'text',
            description: 'Description text of the package card',
        },
        duration: {
            control: 'text',
            description: 'Duration of the package (e.g., "6 weeks")',
        },
        pricing: {
            control: 'object',
            description: 'Object containing price and saved price information',
        },
        titleBanner: {
            control: 'text',
            description: 'Title displayed on the banner',
        },
        descriptionBanner: {
            control: 'text',
            description: 'Description displayed on the banner',
        },
        onClickPurchase: {
            action: 'clicked',
            description: 'Function to call when the purchase button is clicked',
        }
    },
} satisfies Meta<typeof BuyCompletePackageBanner>;

type Story = StoryObj<typeof BuyCompletePackageBanner>;

const mockData = {
    titleBanner: 'Buy complete package',
    descriptionBanner:
        'Here you get everything included. You can therefore gradually implement your overall appearance with a key visual, new branding, a website and corresponding video content.',
    title: 'Complete Package',
    description:
        'Master web development with this comprehensive course package. Includes everything you need to become a full-stack developer.',
    imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
    pricing: {
        fullPrice: 299,
        partialPrice: 249,
        currency: 'CHF',
    },
    courseCount: 5,
    duration: 165, // in minutes
    locale: 'en',
    onClickPurchase: () => {
        alert('Purchase button clicked!');
    },
};

export const Default: Story = {
    args: {
        ...mockData,
        locale: 'en',
    },
    render: (args) => <BuyCompletePackageBanner {...args} />,
};