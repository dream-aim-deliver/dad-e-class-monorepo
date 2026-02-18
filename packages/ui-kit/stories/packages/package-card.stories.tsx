import type { Meta, StoryObj } from '@storybook/react-vite';
import { PackageCard } from '../../lib/components/packages/package-card';

const meta: Meta<typeof PackageCard> = {
    title: 'Components/PackageCard/VisitorVariant',
    component: PackageCard,
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
        courseCount: {
            control: 'number',
            description: 'Number of courses included in the package',
        },
        pricing: {
            control: 'object',
            description: 'Object containing price and saved price information',
        },
    },
};

export default meta;

type Story = StoryObj<typeof PackageCard>;

const mockData = {
    imageUrl:
        'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Package Title, Firmen und Einzelpersonen',
    description:
        'Das Angebot "Visualisierung" richtet sich an Firmen und Einzelpersonen, die bereits über eine Idee, ein Konzept und ein Briefing verfügen.',
    duration: 220,
    courseCount: 4,
    pricing: {
        fullPrice: 299,
        partialPrice: 199,
        currency: 'CHF',
    },
    onClickPurchase: () => alert('Purchased'),
    onClickDetails: () => alert('Details'),
};

export const Default: Story = {
    args: {
        ...mockData,
        locale: 'en',
        courseCount: 0,
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        duration: 0,
    },
};

export const WithGermanLocale: Story = {
    args: {
        ...mockData,
        locale: 'de',
        title: 'Komplettes Paket für digitales Marketing',
        description:
            'Erhalten Sie umfassendes Wissen im digitalen Marketing mit diesem All-Inclusive-Paket. Lernen Sie Strategien, Tools und Techniken, um in Ihrer Karriere erfolgreich zu sein.',
        pricing: {
            fullPrice: 599,
            partialPrice: 299,
            currency: 'CHF',
        },
    },
};

export const BrokenImage: Story = {
    args: {
        ...mockData,
        imageUrl: 'https://example.com/nonexistent-image.jpg',
        locale: 'en',
    },
};

export const NoImage: Story = {
    args: {
        ...mockData,
        imageUrl: '',
        locale: 'en',
    },
};

export const LongContentTitleAndDescription: Story = {
    args: {
        ...mockData,
        title: 'Complete Digital Marketing Package - Extended Title for Testing Overflow Handling and Truncation Behavior in UI Components',
        description:
            'Gain comprehensive knowledge in digital marketing with this all-inclusive package. This extended description is designed to test how the component handles longer text. It should properly truncate or wrap text based on the available space.',
        locale: 'en',
    },
};
