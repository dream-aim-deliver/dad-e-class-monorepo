import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '../../lib/components/carousel/carousel';
import { GeneralCard } from '../../lib/components/carousel/general-card'; 
import { homePage } from '@maany_shr/e-class-models';
import React from 'react';

// Define the meta configuration for the Carousel component
const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS class for additional styling',
    },
    children: {
      control: false,
      description: 'Content to display inside the carousel (e.g., GeneralCard components or custom elements)',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Locale for translation (e.g., "en" for English, "de" for German)',
    },
    onClick: {
      action: 'cta-clicked',
      description: 'Callback function triggered when the CTA button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

// Mock data for GeneralCard components
const mockCards: homePage.TGeneralCard[] = [
  {
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Digital Marketing Strategy',
    description: 'Learn the fundamentals of digital marketing and develop effective strategies for your business.',
    buttonText: 'Explore Course',
    buttonUrl: '/digital-marketing',
    badge: 'Package',
  },
  {
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Content Creation Masterclass',
    description: 'Master the art of creating engaging content that drives traffic and conversions.',
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
    description: 'Build effective email campaigns that convert leads into customers.',
    buttonText: 'Enroll Now',
    buttonUrl: '/email-marketing',
  },
  {
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Analytics and Data',
    description: 'Learn to analyze marketing data and make data-driven decisions for better results.',
    buttonText: 'Start Learning',
    buttonUrl: '/analytics',
    badge: 'Popular',
  },
];

// Helper function to create GeneralCard with onButtonClick
const createCard = (card: homePage.TGeneralCard, locale: 'en' | 'de' = 'en') => (
  <GeneralCard
    key={`${card.title}-${card.buttonUrl}`}
    imageUrl={card.imageUrl}
    title={card.title}
    description={card.description}
    buttonText={card.buttonText}
    buttonUrl={card.buttonUrl}
    badge={card.badge}
    locale={locale}
    onButtonClick={() => console.log(`Card clicked: ${card.title}`)}
  />
);

/**
 * Default carousel story with multiple cards
 */
export const Default: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.map((card) => createCard(card, args.locale))}
    </Carousel>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default carousel with multiple GeneralCard components. Responsive design automatically adjusts items per view based on screen size.'
      }
    }
  }
};

/**
 * Carousel with many items to test pagination
 */
export const WithManyItems: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.map((card) => createCard(card, args.locale))}
    </Carousel>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Carousel with many items to showcase pagination and navigation functionality on desktop view.'
      }
    }
  }
};

/**
 * Carousel with all cards having badges
 */
export const WithBadges: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.map((card) => 
        createCard({
          ...card,
          badge: card.badge || 'Featured'
        }, args.locale)
      )}
    </Carousel>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel where all cards display badges to test badge positioning and styling.'
      }
    }
  }
};

/**
 * German locale carousel
 */
export const GermanLocale: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.slice(0, 4).map((card) => createCard(card, args.locale))}
    </Carousel>
  ),
  args: {
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with German locale to test internationalization and localized text.'
      }
    }
  }
};

/**
 * Single item carousel
 */
export const SingleItem: Story = {
  render: (args) => (
    <Carousel {...args}>
      {createCard(mockCards[0], args.locale)}
    </Carousel>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with only one item to test edge case handling and layout when navigation is not needed.'
      }
    }
  }
};

/**
 * Carousel with long titles and descriptions
 */
export const LongContent: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.slice(0, 4).map((card) => 
        createCard({
          ...card,
          title: `${card.title} - Extended Version with a Much Longer Title to Test Overflow Handling`,
          description: `${card.description} This is an extended description that adds more content to test how the component handles longer text. It should properly truncate or wrap text based on the available space and maintain proper layout structure.`
        }, args.locale)
      )}
    </Carousel>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with cards containing long titles and descriptions to test text overflow and truncation behavior.'
      }
    }
  }
};

/**
 * Tablet responsive view
 */
export const TabletView: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.map((card) => createCard(card, args.locale))}
    </Carousel>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Carousel optimized for tablet view (typically 2 items per view). Tests responsive behavior on medium-sized screens.'
      }
    }
  }
};

/**
 * Mobile responsive view
 */
export const MobileView: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.map((card) => createCard(card, args.locale))}
    </Carousel>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Carousel optimized for mobile view (1 item per view). Tests responsive behavior and touch navigation on small screens.'
      }
    }
  }
};

/**
 * Carousel with broken images
 */
export const WithBrokenImages: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.slice(0, 3).map((card) => 
        createCard({
          ...card,
          imageUrl: 'https://broken-url-that-will-fail.invalid/image.jpg'
        }, args.locale)
      )}
    </Carousel>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with broken image URLs to test fallback placeholder behavior in GeneralCard components.'
      }
    }
  }
};

/**
 * Carousel with custom styling
 */
export const CustomStyling: Story = {
  render: (args) => (
    <Carousel {...args}>
      {mockCards.slice(0, 4).map((card) => createCard(card, args.locale))}
    </Carousel>
  ),
  args: {
    locale: 'en',
    className: 'bg-gray-100 p-8 rounded-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with custom CSS classes applied to test styling flexibility and customization options.'
      }
    }
  }
};

/**
 * Interactive demo with state management
 */
export const InteractiveDemo: Story = {
  render: (args) => {
    const [clickedCard, setClickedCard] = React.useState<string | null>(null);
    
    return (
      <div className="space-y-4">
        <Carousel 
          {...args}
          onClick={() => setClickedCard('CTA Button')}
        >
          {mockCards.slice(0, 5).map((card) => (
            <GeneralCard
              key={`${card.title}-${card.buttonUrl}`}
              imageUrl={card.imageUrl}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              buttonUrl={card.buttonUrl}
              badge={card.badge}
              locale={args.locale || 'en'}
              onButtonClick={() => setClickedCard(card.title)}
            />
          ))}
        </Carousel>
        {clickedCard && (
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <p>Last clicked: <strong>{clickedCard}</strong></p>
            <button 
              onClick={() => setClickedCard(null)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
  },
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive carousel demo that tracks which cards or CTA button was clicked, demonstrating callback functionality.'
      }
    }
  }
};
