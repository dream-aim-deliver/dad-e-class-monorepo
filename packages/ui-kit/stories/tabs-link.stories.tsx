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
}

/**
 * Tabs Render Function
 */
const TabsRender = ({ 
  language = 'en', 
  variant = 'default' 
}: ExtendedTabsProps) => {
  const t = messages[language].tabs.coaching;

  return (
    <Tabs.Root defaultTab="upcoming">
      <Tabs.List variant={variant}>
        <Tabs.Trigger value="upcoming">
          {t.upcoming.label}
        </Tabs.Trigger>
        <Tabs.Trigger value="ended">
          {t.ended.label}
        </Tabs.Trigger>
        <Tabs.Trigger value="available">
          {t.available.label}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="upcoming">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">
            {t.upcoming.title}
          </h4>
          <p className="text-gray-600">
            {t.upcoming.description}
          </p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="ended">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">
            {t.ended.title}
          </h4>
          <p className="text-gray-600">
            {t.ended.description}
          </p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="available">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">
            {t.available.title}
          </h4>
          <p className="text-gray-600">
            {t.available.description}
          </p>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

/**
 * Storybook Metadata
 */
const meta: Meta<typeof Tabs.Root> = {
  title: 'Components/Tabs',
  component: Tabs.Root,
  parameters: {
    layout: 'centered',
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
      description: 'The visual style of the tabs.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs.Root>;

/**
 * Default Tabs Story with English Language
 */
export const Default: Story = {
  render: (args) => <TabsRender {...args} />,
  args: {
    language: 'en',
    variant: 'default',
  },
};

/**
 * Tabs Story with German Language
 */
export const German: Story = {
  render: (args) => <TabsRender {...args} />,
  args: {
    language: 'de',
    variant: 'default',
  },
};

/**
 * Small Variant Tabs Story with English Language
 */
export const SmallEnglish: Story = {
  render: (args) => <TabsRender {...args} />,
  args: {
    language: 'en',
    variant: 'small',
  },
};

/**
 * Small Variant Tabs Story with German Language
 */
export const SmallGerman: Story = {
  render: (args) => <TabsRender {...args} />,
  args: {
    language: 'de',
    variant: 'small',
  },
};