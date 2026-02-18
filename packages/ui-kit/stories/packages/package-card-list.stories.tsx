import type { Meta, StoryObj } from '@storybook/react-vite';
import { PackageCardList } from '../../lib/components/packages/package-card-list';
import { PackageCard } from '../../lib/components/packages/package-card';
import { TLocale } from '@maany_shr/e-class-translations';

// Meta configuration
const meta: Meta<typeof PackageCardList> = {
    title: 'Components/PackageCardList/VisitorVariant',
    component: PackageCardList,
    tags: ['autodocs'],
    argTypes: {
        children: {
            control: false,
            description:
                'Content to display inside the Packages component (e.g., PackageCard components)',
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

type Story = StoryObj<typeof PackageCardList>;

// Mock data for PackageCard components
const mockPackageCards = [
    {
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Basic Package',
        description: 'This is a basic package for beginners.',
        duration: 180,
        courseCount: 5,
        pricing: {
            fullPrice: 100,
            partialPrice: 50,
            currency: 'USD',
        },
        onClickPurchase: () => alert('Purchased'),
        onClickDetails: () => alert('Details'),
    },
    {
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Advanced Package',
        description: 'This package is designed for advanced learners.',
        duration: 220,
        courseCount: 10,
        pricing: {
            fullPrice: 200,
            partialPrice: 100,
            currency: 'USD',
        },
        onClickPurchase: () => alert('Purchased'),
        onClickDetails: () => alert('Details'),
    },
    {
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        title: 'Premium Package',
        description: 'The premium package offers exclusive content.',
        duration: 130,
        courseCount: 20,
        pricing: {
            fullPrice: 300,
            partialPrice: 150,
            currency: 'USD',
        },
        onClickPurchase: () => alert('Purchased'),
        onClickDetails: () => alert('Details'),
    },
];

// Template for stories to inject locale from args
const Template: Story = {
    render: (args) => (
        <PackageCardList {...args}>
            {mockPackageCards.map((card) => (
                <PackageCard
                    key={card.title}
                    imageUrl={card.imageUrl}
                    title={card.title}
                    description={card.description}
                    duration={card.duration}
                    courseCount={card.courseCount}
                    pricing={card.pricing}
                    locale={args.locale as TLocale}
                    onClickPurchase={card.onClickPurchase}
                    onClickDetails={card.onClickDetails}
                />
            ))}
        </PackageCardList>
    ),
    args: {
        locale: 'en',
    },
};

// Default Story: Basic usage with PackageCard components
export const DefaultPackagesStory: Story = {
    ...Template,
};

// With Long Titles and Descriptions
export const LongTitlesAndDescriptionsStory: Story = {
    render: (args) => (
        <PackageCardList {...args}>
            {mockPackageCards.map((card) => (
                <PackageCard
                    key={card.title}
                    imageUrl={card.imageUrl}
                    title={`${card.title} - Extended Version with a Longer Title to Test Overflow Handling`}
                    description={`${card.description} This is an extended description to test how the component handles longer text. It should properly truncate or wrap text based on the space available.`}
                    duration={card.duration}
                    courseCount={card.courseCount}
                    pricing={card.pricing}
                    locale={args.locale as TLocale}
                    onClickPurchase={card.onClickPurchase}
                    onClickDetails={card.onClickDetails}
                />
            ))}
        </PackageCardList>
    ),
    args: {
        locale: 'en',
    },
};

// Single Item View
export const SingleItemStory: Story = {
    render: (args) => (
        <PackageCardList {...args}>
            <PackageCard
                imageUrl={mockPackageCards[0].imageUrl}
                title={mockPackageCards[0].title}
                description={mockPackageCards[0].description}
                duration={mockPackageCards[0].duration}
                courseCount={mockPackageCards[0].courseCount}
                pricing={mockPackageCards[0].pricing}
                locale={args.locale as TLocale}
                onClickPurchase={mockPackageCards[0].onClickPurchase}
                onClickDetails={mockPackageCards[0].onClickDetails}
            />
        </PackageCardList>
    ),
    args: {
        locale: 'en',
    },
};

// With Long Titles and Descriptions
export const TwoItemsStory: Story = {
    render: (args) => (
        <PackageCardList {...args}>
            {mockPackageCards.slice(0, 2).map((card) => (
                <PackageCard
                    key={card.title}
                    imageUrl={card.imageUrl}
                    title={`${card.title} - Extended Version with a Longer Title to Test Overflow Handling`}
                    description={`${card.description} This is an extended description to test how the component handles longer text. It should properly truncate or wrap text based on the space available.`}
                    duration={card.duration}
                    courseCount={card.courseCount}
                    pricing={card.pricing}
                    locale={args.locale as TLocale}
                    onClickPurchase={card.onClickPurchase}
                    onClickDetails={card.onClickDetails}
                />
            ))}
        </PackageCardList>
    ),
    args: {
        locale: 'en',
    },
};
