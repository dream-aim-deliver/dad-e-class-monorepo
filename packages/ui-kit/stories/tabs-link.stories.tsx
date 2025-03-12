import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '../lib/components/tabs/tab';

/**
 * Comprehensive Translation Messages
 */
const messages = {
  en: {
    tabs: {
      coaching: {
        upcoming: {
          label: 'Upcoming',
          title: 'Upcoming Coaching Sessions',
          description: 'View and manage your upcoming coaching sessions.'
        },
        ended: {
          label: 'Ended',
          title: 'Ended Coaching Sessions',
          description: 'Review and analyze your completed coaching sessions.'
        },
        available: {
          label: 'Available',
          title: 'Available Coaching Sessions',
          description: 'Explore and book new coaching opportunities.'
        }
      }
    }
  },
  de: {
    tabs: {
      coaching: {
        upcoming: {
          label: 'Bevorstehend',
          title: 'Bevorstehende Coaching-Sitzungen',
          description: 'Zeigen und verwalten Sie Ihre bevorstehenden Coaching-Sitzungen.'
        },
        ended: {
          label: 'Beendet',
          title: 'Beendete Coaching-Sitzungen',
          description: 'Überprüfen und analysieren Sie Ihre abgeschlossenen Coaching-Sitzungen.'
        },
        available: {
          label: 'Verfügbar',
          title: 'Verfügbare Coaching-Sitzungen',
          description: 'Entdecken und buchen Sie neue Coaching-Möglichkeiten.'
        }
      }
    }
  }
};

/**
 * Extended Tabs Root Props
 */
interface ExtendedTabsProps {
  language?: 'en' | 'de';
  variant?: 'default' | 'small';
  fullWidth?: boolean;
}

/**
 * Tabs Render Function
 */
const TabsRender = ({
  language = 'en',
  variant = 'default',
  fullWidth = false
}: ExtendedTabsProps) => {
  const t = messages[language].tabs.coaching;

  return (
    <div className={fullWidth ? "w-full p-4" : "w-full max-w-md p-4"}>
      <Tabs.Root defaultTab="upcoming">
        <Tabs.List 
          variant={variant}
          className="border-b border-card-stroke"
        >
          <Tabs.Trigger 
            value="upcoming"
            className="px-4 py-2 text-sm md:text-base"
          >
            {t.upcoming.label}
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="ended"
            className="px-4 py-2 text-sm md:text-base"
          >
            {t.ended.label}
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="available"
            className="px-4 py-2 text-sm md:text-base"
          >
            {t.available.label}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="upcoming" className="py-4">
          <div className="prose max-w-none">
            <h4 className="text-xl text-base-white md:text-2xl font-medium mb-3">
              {t.upcoming.title}
            </h4>
            <p className="text-base-white text-base md:text-lg">
              {t.upcoming.description}
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="ended" className="py-4">
          <div className="prose max-w-none">
            <h4 className="text-xl text-base-white md:text-2xl font-medium mb-3">
              {t.ended.title}
            </h4>
            <p className="text-base-white text-base md:text-lg">
              {t.ended.description}
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="available" className="py-4">
          <div className="prose max-w-none">
            <h4 className="text-xl text-base-white md:text-2xl font-medium mb-3">
              {t.available.title}
            </h4>
            <p className="text-base-white text-base md:text-lg">
              {t.available.description}
            </p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

const meta: Meta<typeof Tabs.Root> = {
  title: 'Components/Tabs',
  component: Tabs.Root,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Language of the tabs content',
    },
    variant: {
      control: 'select',
      options: ['default', 'small'],
      description: 'The visual style of the tabs',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the tabs should take full width',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs.Root>;

/**
 * Full Width Default Tabs Story (English)
 */
export const FullWidthDefault: Story = {
  render: (args) => <TabsRender {...args} />,
  args: {
    language: 'en',
    variant: 'default',
    fullWidth: true,
  },
};

/**
 * Smaller Contained Tabs Story (English)
 */
export const ContainedDefault: Story = {
  render: (args) => <TabsRender {...args} />,
  args: {
    language: 'en',
    variant: 'default',
    fullWidth: false,
  },
};

/**
 * Full Width Small Tabs Story (English)
 */
export const FullWidthSmall: Story = {
  render: (args) => <TabsRender {...args} />,
  args: {
    language: 'en',
    variant: 'small',
    fullWidth: true,
  },
};

/**
 * Smaller Contained Small Tabs Story (English)
 */
export const ContainedSmall: Story = {
  render: (args) => <TabsRender {...args} />,
  args: {
    language: 'en',
    variant: 'small',
    fullWidth: false,
  },
};