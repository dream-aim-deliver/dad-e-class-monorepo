import type { Meta, StoryObj } from '@storybook/react-vite';
import { PackageCmsCard } from '../../lib/components/packages/package-cms-card';
import type {
    PackageCmsPublishedCardProps,
    PackageCmsArchivedCardProps,
} from '../../lib/components/packages/package-cms-card';

const meta: Meta<typeof PackageCmsCard> = {
    title: 'Components/PackageCard/CMSVariant',
    component: PackageCmsCard,
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
        status: {
            control: 'radio',
            options: ['published', 'archived'],
            description: 'State of the package card',
        },
        onClickEdit: { action: 'clicked edit' },
        onClickArchive: { action: 'clicked archive' },
        onClickPublished: { action: 'clicked publish' },
    },
};

export default meta;

type Story = StoryObj<typeof PackageCmsCard>;

const basePublishedData: PackageCmsPublishedCardProps = {
    imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
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
    locale: 'en',
    onClickEdit: () => alert('Edit clicked'),
    onClickArchive: () => alert('Archive clicked'),
    status: 'published',
};

const baseArchivedData: PackageCmsArchivedCardProps = {
    ...basePublishedData,
    status: 'archived',
    onClickPublished: () => alert('Publish clicked'),
};

export const Published: Story = {
    args: {
        ...basePublishedData,
    },
};

export const Archived: Story = {
    args: {
        ...baseArchivedData,
    },
};

export const WithGermanLocale: Story = {
    args: {
        ...basePublishedData,
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
        ...basePublishedData,
        imageUrl: 'https://example.com/nonexistent-image.jpg',
    },
};

export const NoImage: Story = {
    args: {
        ...basePublishedData,
        imageUrl: '',
    },
};

export const LongContentTitleAndDescription: Story = {
    args: {
        ...basePublishedData,
        title: 'Complete Digital Marketing Package - Extended Title for Testing Overflow Handling and Truncation Behavior in UI Components',
        description:
            'Gain comprehensive knowledge in digital marketing with this all-inclusive package. This extended description is designed to test how the component handles longer text. It should properly truncate or wrap text based on the available space.',
    },
};
