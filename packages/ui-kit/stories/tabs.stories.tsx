import { Tabs } from '../lib/components/tabs/tab';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconAccountInformation } from '../lib/components/icons/icon-account-information';
import { IconAssignment } from '../lib/components/icons/icon-assignment';
import { IconCertification } from '../lib/components/icons/icon-certification';

const meta: Meta<typeof Tabs.Root> = {
  title: 'Components/Tabs/Usage',
  component: Tabs.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs.Root>;

// Template component that properly handles isLast prop for all TabTriggers
const Template = () => {
  const tabs = [
    {
      value: 'account',
      icon: <IconAccountInformation size="5" />,
      label: 'Account',
      content: {
        title: 'Account Settings',
        description: 'Manage your account preferences and personal information.'
      }
    },
    {
      value: 'assignments',
      icon: <IconAssignment size="5" />,
      label: 'Assignments',
      content: {
        title: 'Assignments Preferences',
        description: 'Control how and when you receive assignments.'
      }
    },
    {
      value: 'settings',
      icon: <IconCertification size="5" />,
      label: 'Settings',
      content: {
        title: 'General Settings',
        description: 'Configure your application settings and preferences.'
      }
    }
  ];

  return (
    <div className="overflow-auto">
      <Tabs.Root defaultTab="account">
        <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
          {tabs.map((tab, index) => (
            <Tabs.Trigger
              key={tab.value}
              icon={tab.icon}
              value={tab.value}
              isLast={index === tabs.length - 1} // Only last tab gets isLast=true
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        
        {/* Render content for each tab */}
        {tabs.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            <div className="prose">
              <h4 className="text-lg font-medium mb-2">{tab.content.title}</h4>
              <p className="text-gray-600">{tab.content.description}</p>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
};

// Template for testing with different number of tabs
const FlexibleTabsTemplate = ({ tabCount = 3 }: { tabCount?: number }) => {
  // Generate tabs based on count
  const tabs = Array.from({ length: tabCount }, (_, i) => ({
    value: `tab-${i + 1}`,
    icon: i === 0 ? <IconAccountInformation size="5" /> : 
          i === 1 ? <IconAssignment size="5" /> : 
          <IconCertification size="5" />,
    label: `Tab ${i + 1}`,
    content: {
      title: `Tab ${i + 1} Content`,
      description: `This is the content for tab number ${i + 1}.`
    }
  }));

  return (
    <div className="overflow-auto">
      <Tabs.Root defaultTab="tab-1">
        <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
          {tabs.map((tab, index) => (
            <Tabs.Trigger
              key={tab.value}
              icon={tab.icon}
              value={tab.value}
              isLast={index === tabs.length - 1}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        
        {tabs.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            <div className="prose">
              <h4 className="text-lg font-medium mb-2">{tab.content.title}</h4>
              <p className="text-gray-600">{tab.content.description}</p>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
};

// Default story with standard 3 tabs
export const Default: Story = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default tabs implementation with proper isLast prop handling. The last tab will not have a border divider.'
      }
    }
  }
};

// Story with only 2 tabs to test isLast behavior
export const TwoTabs: Story = {
  render: () => <FlexibleTabsTemplate tabCount={2} />,
  parameters: {
    docs: {
      description: {
        story: 'Example with only 2 tabs to demonstrate that the second tab correctly receives isLast=true and has no border divider.'
      }
    }
  }
};

// Story with 5 tabs to test with more elements
export const ManyTabs: Story = {
  render: () => <FlexibleTabsTemplate tabCount={5} />,
  parameters: {
    docs: {
      description: {
        story: 'Example with 5 tabs to show how isLast prop works with multiple tabs. Only the 5th tab should not have a border divider.'
      }
    }
  }
};

// Story with single tab (edge case)
export const SingleTab: Story = {
  render: () => <FlexibleTabsTemplate tabCount={1} />,
  parameters: {
    docs: {
      description: {
        story: 'Edge case with a single tab that should have isLast=true and no border divider.'
      }
    }
  }
};

// Story specifically for testing different visual states
export const WithLongLabels: Story = {
  render: () => {
    const tabs = [
      {
        value: 'very-long-account',
        icon: <IconAccountInformation size="5" />,
        label: 'Account Management & Settings',
        content: {
          title: 'Account Management',
          description: 'Comprehensive account management and personal settings configuration.'
        }
      },
      {
        value: 'assignment-management',
        icon: <IconAssignment size="5" />,
        label: 'Assignment & Task Management',
        content: {
          title: 'Assignment Management',
          description: 'Advanced assignment and task management with detailed preferences.'
        }
      },
      {
        value: 'system-configuration',
        icon: <IconCertification size="5" />,
        label: 'System Configuration & Preferences',
        content: {
          title: 'System Configuration',
          description: 'Advanced system configuration and application preferences.'
        }
      }
    ];

    return (
      <div className="overflow-auto max-w-4xl">
        <Tabs.Root defaultTab="very-long-account">
          <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2">
            {tabs.map((tab, index) => (
              <Tabs.Trigger
                key={tab.value}
                icon={tab.icon}
                value={tab.value}
                isLast={index === tabs.length - 1}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          
          {tabs.map((tab) => (
            <Tabs.Content key={tab.value} value={tab.value}>
              <div className="prose">
                <h4 className="text-lg font-medium mb-2">{tab.content.title}</h4>
                <p className="text-gray-600">{tab.content.description}</p>
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with longer tab labels to test how the isLast prop works with text overflow and wrapping.'
      }
    }
  }
};
