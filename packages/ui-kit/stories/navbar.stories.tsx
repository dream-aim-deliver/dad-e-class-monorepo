import { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../lib/components/navbar';
import { NextIntlClientProvider } from 'next-intl';

// Mock dictionary structure
const mockMessages = {
  components: {
    navbar: {
      offers: 'Offers',
      coaching: 'Coaching',
      howItWorks: 'How It Works',
      about: 'About',
      workspace: 'Workspace',
      english: 'English',
      german: 'German',
      login: 'Login',
    },
  },
};

// Mock Next.js Link component for Storybook
const MockLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} onClick={(e) => e.preventDefault()}>
    {children}
  </a>
);

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <div className="min-h-screen">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
  argTypes: {
    isLoggedIn: {
      control: 'boolean',
      description: 'Whether the user is logged in.',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'The locale for language selection.',
    },
    notificationCount: {
      control: 'number',
      description: 'Number of notifications to display.',
    },
  },
};

export default meta;

const Template: StoryObj<typeof Navbar> = {
  render: (args) => <Navbar {...args} />,
};

export const LoggedOut: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: false,
    locale: 'en',
    notificationCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar when the user is not logged in.',
      },
    },
  },
};

export const LoggedInWithNotifications: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    notificationCount: 3,
  },
};

export const LoggedOutGerman: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: false,
    locale: 'de',
    notificationCount: 0,
  },
};

export const MobileViewLoggedIn: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    notificationCount: 2,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const LoggedInNoNotifications: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    notificationCount: 0,
  },
};