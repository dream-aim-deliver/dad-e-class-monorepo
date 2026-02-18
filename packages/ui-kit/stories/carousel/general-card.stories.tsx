import type { Meta, StoryObj } from '@storybook/react-vite';
import { GeneralCard } from '../../lib/components/carousel/general-card';

const meta: Meta<typeof GeneralCard> = {
  title: 'Components/GeneralCard',
  component: GeneralCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en',
      description: 'The language locale for translations'
    },
    imageUrl: {
      control: 'text',
      description: 'URL of the card image'
    },
    title: {
      control: 'text',
      description: 'Title of the card'
    },
    description: {
      control: 'text',
      description: 'Description text of the card'
    },
    badge: {
      control: 'text',
      description: 'Optional badge text'
    },
    buttonText: {
      control: 'text',
      description: 'Text for the button'
    },
    buttonUrl: {
      control: 'text',
      description: 'URL associated with the button'
    },
    onButtonClick: {
      action: 'clicked', // Storybook action to log button clicks
      description: 'Callback function executed when the button is clicked'
    },
  }
};

export default meta;

type Story = StoryObj<typeof GeneralCard>;

const mockData = {
  imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  title: 'Digital Marketing Strategy',
  description: 'Learn the fundamentals of digital marketing and develop effective strategies for your business.Learn the fundamentals of digital marketing and develop effective strategies for your business.Learn the fundamentals of digital marketing and develop effective strategies for your business.',
  buttonText: 'Explore Course',
  buttonUrl: '/course/digital-marketing',
  onButtonClick: () => alert('Button clicked'), // Updated to onButtonClick
};

export const Default: Story = {
  args: {
    ...mockData,
    locale: 'en'
  }
};

export const WithBadge: Story = {
  args: {
    ...mockData,
    badge: 'Popular',
    locale: 'en'
  }
};

export const GermanLocale: Story = {
  args: {
    ...mockData,
    locale: 'de',
    title: 'Digitale Marketingstrategie',
    description: 'Lernen Sie die Grundlagen des digitalen Marketings und entwickeln Sie effektive Strategien für Ihr Unternehmen.',
    buttonText: 'Kurs Entdecken'
  }
};

export const BrokenImage: Story = {
  args: {
    ...mockData,
    imageUrl: 'https://example.com/nonexistent-image.jpg',
    locale: 'en'
  }
};

export const NoImage: Story = {
  args: {
    ...mockData,
    imageUrl: '',
    locale: 'en'
  }
};

export const LongContent: Story = {
  args: {
    ...mockData,
    title: 'Digital Marketing Strategy - Extended Version with a Much Longer Title to Test Overflow Handling',
    description: 'Learn the fundamentals of digital marketing and develop effective strategies for your business. This is an extended description that adds more content to test how the component handles longer text. It should properly truncate or wrap text based on the available space.',
    locale: 'en'
  }
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  args: {
    ...mockData,
    locale: 'en'
  }
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  },
  args: {
    ...mockData,
    locale: 'en'
  }
};