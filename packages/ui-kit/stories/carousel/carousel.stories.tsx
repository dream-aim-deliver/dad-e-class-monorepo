import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel } from '../../lib/components/carousel/carousel';
import { GeneralCard } from '../../lib/components/carousel/general-card';
import { homePage } from '@maany_shr/e-class-models';

// Define the meta configuration for the Carousel component
const meta: Meta<typeof Carousel> = {
    title: 'Components/Carousel',
    component: Carousel,
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Custom CSS class for additional styling',
            defaultValue: '',
        },
        children: {
            control: false,
            description:
                'Content to display inside the carousel (e.g., GeneralCard components or custom elements)',
        },
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description:
                'Locale for translation (e.g., "en" for English, "de" for German)',
            defaultValue: 'en',
        },
    },
};

export default meta;

type Story = StoryObj<typeof Carousel>;

// Mock data for GeneralCard components
const mockCards: homePage.TGeneralCard[] = [
    {
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Digital Marketing Strategy',
        description:
            'Learn the fundamentals of digital marketing and develop effective strategies for your business.',
        buttonText: 'Explore Course',
        buttonUrl: '/digital-marketing',
        badge: 'Package',
    },
    {
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Content Creation Masterclass',
        description:
            'Master the art of creating engaging content that drives traffic and conversions.',
        buttonText: 'View Details',
        buttonUrl: '/content-creation',
        badge: 'Package',
    },
    {
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Social Media Management',
        description:
            'Learn how to effectively manage multiple social media platforms for maximum engagement.',
        buttonText: 'Get Started',
        buttonUrl: '/social-media',
    },
    {
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'SEO Fundamentals',
        description:
            'Understand search engine optimization techniques to improve your website visibility.',
        buttonText: 'Learn More',
        buttonUrl: '/seo',
        badge: 'New',
    },
    {
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'React Fundamentals',
        description:
            'Understand search engine optimization techniques to improve your website visibility.',
        buttonText: 'Learn More',
        buttonUrl: '/seo',
        badge: 'New',
    },
];

// Default Story: Basic usage with GeneralCard components
export const Default: Story = {
    args: {
        locale: 'en',
        children: mockCards.map((card) => (
            <GeneralCard
                key={card.title}
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                buttonUrl={card.buttonUrl}
                badge={card.badge}
                locale="en"
                onButtonClick={() => alert('Button clicked')}
            />
        )),
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop', // Ensure desktop view for 3 items
        },
    },
};

// Multiple Items: Showcase multiple cards
export const WithMultipleItems: Story = {
    args: {
        locale: 'en',
        children: mockCards.map((card) => (
            <GeneralCard
                key={card.title}
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                buttonUrl={card.buttonUrl}
                badge={card.badge}
                locale="en"
                onButtonClick={() => alert('Button clicked')}
            />
        )),
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop', // Ensure desktop view for 4 items
        },
    },
};

// With Badges: All cards have badges
export const WithBadges: Story = {
    args: {
        locale: 'en',
        children: mockCards.map((card) => (
            <GeneralCard
                key={card.title}
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                buttonUrl={card.buttonUrl}
                badge={card.badge || 'Featured'}
                locale="en"
                onButtonClick={() => alert('Button clicked')}
            />
        )),
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop', // Ensure desktop view for 3 items
        },
    },
};

// German Locale: Test with a different locale
export const GermanLocale: Story = {
    args: {
        locale: 'de',
        children: mockCards
            .slice(0, 3)
            .map((card) => (
                <GeneralCard
                    key={card.title}
                    imageUrl={card.imageUrl}
                    title={card.title}
                    description={card.description}
                    buttonText={card.buttonText}
                    buttonUrl={card.buttonUrl}
                    badge={card.badge}
                    locale="de"
                    onButtonClick={() => alert('Button clicked')}
                />
            )),
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop', // Ensure desktop view for 3 items
        },
    },
};

// Single Item View: Test with only one item
export const SingleItemView: Story = {
    args: {
        locale: 'en',
        children: (
            <GeneralCard
                imageUrl={mockCards[1].imageUrl}
                title={mockCards[1].title}
                description={mockCards[1].description}
                buttonText={mockCards[1].buttonText}
                buttonUrl={mockCards[1].buttonUrl}
                badge={mockCards[1].badge}
                locale="en"
                onButtonClick={() => alert('Button clicked')}
            />
        ),
    },
};

// Long Titles and Descriptions: Test overflow handling
export const LongTitlesAndDescriptions: Story = {
    args: {
        locale: 'en',
        children: mockCards.map((card) => (
            <GeneralCard
                key={card.title}
                imageUrl={card.imageUrl}
                title={`${card.title} - Extended Version with a Much Longer Title to Test Overflow Handling`}
                description={`${card.description} This is an extended description that adds more content to test how the component handles longer text. It should properly truncate or wrap text based on the available space.`}
                buttonText={card.buttonText}
                buttonUrl={card.buttonUrl}
                badge={card.badge}
                locale="en"
                onButtonClick={() => alert('Button clicked')}
            />
        )),
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop', // Ensure desktop view for 3 items
        },
    },
};

// Tablet Layout Simulation: Test responsive behavior
export const TabletLayoutSimulation: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet', // Explicitly test tablet view (2 items)
        },
    },
    args: {
        locale: 'en',
        children: mockCards.map((card) => (
            <GeneralCard
                key={card.title}
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                buttonUrl={card.buttonUrl}
                badge={card.badge}
                locale="en"
                onButtonClick={() => alert('Button clicked')}
            />
        )),
    },
};

// Mobile Layout Simulation: Test single-item view
export const MobileLayoutSimulation: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1', // Explicitly test mobile view (1 item)
        },
    },
    args: {
        locale: 'en',
        children: mockCards.map((card) => (
            <GeneralCard
                key={card.title}
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                buttonUrl={card.buttonUrl}
                badge={card.badge}
                locale="en"
                onButtonClick={() => alert('Button clicked')}
            />
        )),
    },
};
