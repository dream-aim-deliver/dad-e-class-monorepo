import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { PackageCmsCardList } from '../../lib/components/packages/package-cms-card-list';
import {
  PackageCmsCard,
  PackageCmsCardProps,
} from '../../lib/components/packages/package-cms-card';

const meta: Meta<typeof PackageCmsCardList> = {
  title: 'Components/PackageCardList/CMSVariant',
  component: PackageCmsCardList,
  tags: ['autodocs'],
  argTypes: {
    locale: { control: 'select', options: ['en', 'de'] },
    packageCount: { control: { type: 'number' } },
  },
};
export default meta;
type Story = StoryObj<typeof PackageCmsCardList>;

const baseProps: Omit<
  PackageCmsCardProps,
  'status' | 'onClickArchive' | 'onClickPublished'
> = {
  locale: 'en',
  title: 'React for Beginners',
  description: 'Learn React.js from scratch with hands-on projects.',
  duration: 90,
  courseCount: 5,
  imageUrl:
    'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
  pricing: { currency: '$', fullPrice: 199, partialPrice: 99 },
  onClickEdit: () => alert('Edit clicked'),
};

const createPackageCard = (
  props: PackageCmsCardProps,
  key: string | number,
) => <PackageCmsCard key={key} {...props} />;

export const Default: Story = {
  args: {
    locale: 'de',
  },

  render: (args) => {
    const Wrapper = () => {
      const [showArchived, setShowArchived] = React.useState(false);
      const toggleShowArchived = () => setShowArchived((prev) => !prev);

      const cards = [
        {
          ...baseProps,
          locale: args.locale,
          status: 'published',
          key: '1',
          onClickArchive: () => alert('Archive clicked'),
        },
        {
          ...baseProps,
          locale: args.locale,
          title: 'Advanced TypeScript',
          description:
            'Deep dive into TypeScript for large-scale applications.',
          status: 'archived',
          pricing: {
            currency: '€',
            fullPrice: 249,
            partialPrice: 149,
          },
          key: '2',
          onClickPublished: () => alert('Publish clicked'),
        },
        {
          ...baseProps,
          locale: args.locale,
          title: 'Node.js Mastery',
          description: 'Master backend development with Node.js and Express.',
          duration: 120,
          courseCount: 8,
          status: 'published',
          key: '3',
          onClickArchive: () => alert('Archive clicked'),
        },
        {
          ...baseProps,
          locale: args.locale,
          title: 'UI/UX Design Essentials',
          description:
            'Learn design principles and tools for modern applications.',
          duration: 60,
          courseCount: 4,
          pricing: {
            currency: '$',
            fullPrice: 149,
            partialPrice: 79,
          },
          status: 'archived',
          key: '4',
          onClickPublished: () => alert('Publish clicked'),
        },
      ];

      const filteredCards = showArchived
        ? cards
        : cards.filter((card) => card.status === 'published');

      return (
        <PackageCmsCardList
          locale={args.locale}
          packageCount={filteredCards.length}
          showArchived={showArchived}
          onClickCheckbox={toggleShowArchived}
          onCreatePackage={() => alert('Create package clicked')}
        >
          {filteredCards.map((card) =>
            createPackageCard(card as PackageCmsCardProps, card.key),
          )}
        </PackageCmsCardList>
      );
    };

    return <Wrapper />;
  },
};

export const EmptyState: Story = {
  args: {
    locale: 'de',
  },

  render: (args) => {
    const Wrapper = () => {
      const [showArchived, setShowArchived] = React.useState(false);
      const toggleShowArchived = () => setShowArchived((prev) => !prev);

      const filteredCards: React.ReactElement[] = [];

      return (
        <PackageCmsCardList
          locale={args.locale}
          packageCount={filteredCards.length}
          showArchived={showArchived}
          onClickCheckbox={toggleShowArchived}
          onCreatePackage={() => alert('Create package clicked')}
        >
          {filteredCards}
        </PackageCmsCardList>
      );
    };

    return <Wrapper />;
  },
};
