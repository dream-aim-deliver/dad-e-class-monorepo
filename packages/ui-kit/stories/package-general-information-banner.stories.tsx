import type { Meta, StoryObj } from '@storybook/react-vite';
import { PackageGeneralInformation } from '../lib/components/package-general-information-banner';

export default {
    title: 'Components/PackageGeneralInformation',
    component: PackageGeneralInformation,
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
            description: 'URL of the package image',
        },
        title: {
            control: 'text',
            description: 'Title of the package banner',
        },
        description: {
            control: 'text',
            description: 'Description text of the package banner',
        },
        duration: {
            control: 'number',
            description: 'Duration of the package (e.g., "6 hours")',
        },
        pricing: {
            control: 'object',
            description: 'Object containing price and saved price information',
        },
        subTitle: {
            control: 'text',
            description: 'Subtitle of the package banner',
        },
    },
} satisfies Meta<typeof PackageGeneralInformation>;

type Story = StoryObj<typeof PackageGeneralInformation>;

const mockData = {
    title: 'Visualisierung',
    subTitle: 'Als Package oder flexibel:',
    description:
        'Das Angebot "Visualisierung" richtet sich an Firmen und Einzelpersonen, die bereits über eine Idee, ein Konzept und ein Briefing verfügen. Es setzt voraus, dass ein Grundkonzept sowie konkrete Vorstellungen bezüglich der gewünschten Medien und Umsetzungen vorhanden sind. Dieses Angebot zielt darauf ab, die Ideen zielgerichtet umzusetzen und den bestmöglichen Weg zu finden, dies mithilfe vorhandener oder neuer Tools zu erreichen. Das Ziel jeder Umsetzung ist ein fertiges Produkt, das auf dem Briefing und den definierten Zielen basiert. Gemeinsam entwickeln wir dein Branding, deine Kampagne, deine Website oder deinen Film für das Web oder Social Media. Unsere Coaches begleiten dich Schritt für Schritt auf dem Weg zum Ziel.',
    imageUrl:
        'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    pricing: {
        fullPrice: 299,
        partialPrice: 249,
        currency: 'CHF',
    },
    duration: 165, // in minutes
    onClickPurchase: () => alert('Purchase button clicked'),
    locale: 'en',
};

export const Default: Story = {
    args: {
        ...mockData,
        locale: 'en',
    },
    render: (args) => <PackageGeneralInformation {...args} />,
};

export const BrokenImage: Story = {
    args: {
        ...mockData,
        imageUrl: 'https://example.com/broken-image.jpg', // Intentionally broken image
        locale: 'en',
    },
    render: (args) => <PackageGeneralInformation {...args} />,
};
