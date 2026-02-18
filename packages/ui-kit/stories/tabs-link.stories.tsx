import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
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
 * Extended Tabs Props
 */
interface ExtendedTabsProps {
  language?: 'en' | 'de';
  fullWidth?: boolean;
}

/**
 * Tabs Render Function with proper isLast implementation
 */
const TabsRender = ({
  language = 'en',
  fullWidth = false
}: ExtendedTabsProps) => {
  const t = messages[language].tabs.coaching;

  // Define tabs array to handle isLast prop dynamically
  const tabs = [
    {
      value: 'upcoming',
      label: t.upcoming.label,
      title: t.upcoming.title,
      description: t.upcoming.description
    },
    {
      value: 'ended',
      label: t.ended.label,
      title: t.ended.title,
      description: t.ended.description
    },
    {
      value: 'available',
      label: t.available.label,
      title: t.available.title,
      description: t.available.description
    }
  ];

  return (
    <div className={fullWidth ? "w-full p-4" : "w-full max-w-md p-4"}>
      <Tabs.Root defaultTab="upcoming">
        <Tabs.List className="border-b border-card-stroke">
          {/* Dynamically render tabs with proper isLast prop */}
          {tabs.map((tab, index) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 text-sm md:text-base"
              isLast={index === tabs.length - 1} // Only last tab gets isLast=true
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Render content for each tab */}
        {tabs.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value} className="py-4">
            <div className="prose max-w-none">
              <h4 className="text-xl text-base-white md:text-2xl font-medium mb-3">
                {tab.title}
              </h4>
              <p className="text-base-white text-base md:text-lg">
                {tab.description}
              </p>
            </div>
          </Tabs.Content>
        ))}
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
  // Remove invalid argTypes that don't exist in the actual component
};

export default meta;
type Story = StoryObj<typeof Tabs.Root>;

/**
 * Full Width Default Tabs Story (English)
 */
export const FullWidthDefault: Story = {
  render: () => <TabsRender language="en" fullWidth={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Full width tabs in English with proper isLast implementation. The last tab (Available) will not have a border divider.'
      }
    }
  }
};

/**
 * Smaller Contained Tabs Story (English)
 */
export const ContainedDefault: Story = {
  render: () => <TabsRender language="en" fullWidth={false} />,
  parameters: {
    docs: {
      description: {
        story: 'Contained tabs in English with maximum width constraint. Demonstrates isLast prop behavior in a smaller container.'
      }
    }
  }
};

/**
 * Full Width Tabs in German
 */
export const FullWidthGerman: Story = {
  render: () => <TabsRender language="de" fullWidth={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Full width tabs in German language. Shows how isLast prop works with localized content.'
      }
    }
  }
};

/**
 * Contained Tabs in German
 */
export const ContainedGerman: Story = {
  render: () => <TabsRender language="de" fullWidth={false} />,
  parameters: {
    docs: {
      description: {
        story: 'Contained tabs in German language. Demonstrates responsive behavior with German text lengths.'
      }
    }
  }
};

/**
 * Interactive Language Comparison
 */
export const LanguageComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-base-white">English Version</h3>
        <TabsRender language="en" fullWidth={true} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-base-white">German Version</h3>
        <TabsRender language="de" fullWidth={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of English and German tabs to demonstrate internationalization and isLast prop consistency across languages.'
      }
    }
  }
};

/**
 * Responsive Layout Test
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-base-white">Full Width Layout</h3>
        <TabsRender language="en" fullWidth={true} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-base-white">Contained Layout</h3>
        <TabsRender language="en" fullWidth={false} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates responsive behavior of tabs in different container widths. Both layouts properly implement the isLast prop for consistent styling.'
      }
    }
  }
};