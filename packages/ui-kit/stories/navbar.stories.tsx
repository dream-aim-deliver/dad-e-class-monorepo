import { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../lib/components/navbar'; // Adjust alias/path as needed
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

// Navigation links to pass as children
const NavLinks = () => (
  <>
    <a href="/offers">
      <span className="hover:text-button-primary-fill cursor-pointer">
        Offers
      </span>
    </a>
    <a href="/coaching">
      <span className="hover:text-button-primary-fill cursor-pointer">
        Coaching
      </span>
    </a>
    <a href="/how-it-works">
      <span className="hover:text-button-primary-fill cursor-pointer">
        How It Works
      </span>
    </a>
    <a href="/about">
      <span className="hover:text-button-primary-fill cursor-pointer">
        About
      </span>
    </a>
  </>
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
    userProfileImageSrc: {
      control: 'text',
      description: 'URL for the user profile image.',
    },
  },
};

export default meta;

// Updated template to include children
const Template: StoryObj<typeof Navbar> = {
  render: (args) => (
    <Navbar {...args}>
      <NavLinks />
    </Navbar>
  ),
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

// Example with custom user profile image
export const CustomUserProfile: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    notificationCount: 1,
    userProfileImageSrc: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar with a custom user profile image.',
      },
    },
  },
};

// Example with localized navigation links (using dictionary)
export const LocalizedNavLinks: StoryObj<typeof Navbar> = {
  render: (args) => (
    <Navbar {...args}>
      {args.locale === 'en' ? (
        <NavLinks />
      ) : (
        <>
          <a href="/offers">
            <span className="hover:text-button-primary-fill cursor-pointer">
              Angebote
            </span>
          </a>
          <a href="/coaching">
            <span className="hover:text-button-primary-fill cursor-pointer">
              Coaching
            </span>
          </a>
          <a href="/how-it-works">
            <span className="hover:text-button-primary-fill cursor-pointer">
              Wie es funktioniert
            </span>
          </a>
          <a href="/about">
            <span className="hover:text-button-primary-fill cursor-pointer">
              Über uns
            </span>
          </a>
        </>
      )}
    </Navbar>
  ),
  args: {
    isLoggedIn: true,
    locale: 'de',
    notificationCount: 0,
  },
};