import type { Meta, StoryObj } from '@storybook/react';
import { GeneralCardCarousel } from '../../lib/components/carousel/general-card-carousel';
import { homePage } from '@maany_shr/e-class-models';

const meta: Meta<typeof GeneralCardCarousel> = {
  title: 'Components/GeneralCard/GeneralCardCarousel',
  component: GeneralCardCarousel,
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en',
    },
    cards: {
      control: 'object',
    },
    onClick: {
      action: 'clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof GeneralCardCarousel>;

const mockCards: homePage.TGeneralCard[] = [
  {
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Digital Marketing Strategy',
    description: 'Learn the fundamentals of digital marketing and develop effective strategies for your business. Understand search engine optimization techniques to improve your website visibility.',
    buttonText: 'Explore Course',
    buttonUrl: '/digital-marketing',
    badge: 'Package',
  },
  {
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Content Creation Masterclass',
    description: 'Master the art of creating engaging content that drives traffic and conversions. Understand search engine optimization techniques to improve your website visibility.',
    buttonText: 'View Details',
    buttonUrl: '/content-creation',
    badge: 'Package',
  },
  {
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Social Media Management',
    description: 'Learn how to effectively manage multiple social media platforms for maximum engagement.',
    buttonText: 'Get Started',
    buttonUrl: '/social-media',
  },
  {
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'SEO Fundamentals',
    description: 'Understand search engine optimization techniques to improve your website visibility.',
    buttonText: 'Learn More',
    buttonUrl: '/seo',
    badge: 'New',
  },
  {
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Email Marketing Essentials',
    description: 'Build effective email campaigns that convert leads into customers. Understand search engine optimization techniques to improve your website visibility.',
    buttonText: 'Enroll Now',
    buttonUrl: '/email-marketing',
  },
];

export const Default: Story = {
  args: {
    cards: mockCards,
    locale: 'en',
    onClick: () => alert('Default CTA Clicked'),
  },
};

export const WithMultipleCards: Story = {
  args: {
    cards: mockCards,
    locale: 'en',
    onClick: () => alert('Multiple Cards CTA Clicked'),
  },
};

export const WithBadges: Story = {
  args: {
    cards: mockCards.map(card => ({
      ...card,
      badge: card.badge || 'Featured',
    })),
    locale: 'en',
    onClick: () => alert('Badges CTA Clicked'),
  },
};

export const GermanLocale: Story = {
  args: {
    cards: mockCards.slice(0, 3),
    locale: 'de',
    onClick: () => alert('German Locale CTA Clicked'),
  },
};

export const SingleCardView: Story = {
  args: {
    cards: [mockCards[1]],
    locale: 'en',
    onClick: () => alert('Single Card CTA Clicked'),
  },
};

export const LongTitlesAndDescriptions: Story = {
  args: {
    cards: mockCards.map(card => ({
      ...card,
      title: `${card.title} - Extended Version with a Much Longer Title to Test Overflow Handling`,
      description: `${card.description} This is an extended description that adds more content to test how the component handles longer text. It should properly truncate or wrap text based on the available space.`,
    })),
    locale: 'en',
    onClick: () => alert('Long Text CTA Clicked'),
  },
};

export const TabletLayoutSimulation: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  args: {
    cards: mockCards,
    locale: 'en',
    onClick: () => alert('Tablet View CTA Clicked'),
  },
};

export const WithCustomCTA: Story = {
  args: {
    cards: mockCards,
    locale: 'en',
    onClick: () => alert('Custom CTA Clicked'),
  },
};