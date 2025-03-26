import { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../lib/components/navbar';
import { NextIntlClientProvider } from 'next-intl';
import { locales, TLocale } from '@maany_shr/e-class-translations';


// Mock dictionary structure (aligned with TDictionary)
const mockMessages = {
  components: {
    navbar: {
      offers: 'Offers',
      coaching: 'Coaching',
      howItWorks: 'How It Works',
      about: 'About',
      workspace: 'Workspace',
      login: 'Login',
    },
  },
};

const mockMessagesDe = {
  components: {
    navbar: {
      offers: 'Angebote',
      coaching: 'Coaching',
      howItWorks: 'Wie es funktioniert',
      about: 'Über uns',
      workspace: 'Arbeitsbereich',
      login: 'Anmelden',
    },
  },
};

// Navigation links to pass as children
const NavLinks = ({ locale }: { locale: TLocale }) => (
  <>
    {locale === 'en' ? (
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
    (Story, { args }) => (
      <NextIntlClientProvider
        locale={args.locale}
        messages={args.locale === 'en' ? mockMessages : mockMessagesDe}
      >
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
      options: locales, // Use locales from i18n config
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
    userName: {
      control: 'text',
      description: 'The name of the user.',
    },
    logoSrc: {
      control: 'text',
      description: 'URL for the logo image.',
    },
    availableLocales: {
      control: 'multi-select',
      options: locales, // Use locales from i18n config
      description: 'Array of available locales for the language dropdown.',
    },
  },
};

export default meta;

// Updated template to include children and locale-aware NavLinks
const Template: StoryObj<typeof Navbar> = {
  render: (args) => (
    <Navbar {...args}>
      <NavLinks locale={args.locale} />
    </Navbar>
  ),
};

export const LoggedOut: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: false,
    locale: 'en',
    notificationCount: 0,
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: locales, // Add availableLocales
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
    notificationCount: 200,
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: locales,
  },
};

export const LoggedOutGerman: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: false,
    locale: 'de',
    notificationCount: 0,
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: locales,
  },
};

export const MobileViewLoggedIn: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    notificationCount: 2,
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: locales,
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
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: locales,
  },
};

export const CustomUserProfile: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    notificationCount: 1,
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: locales,
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar with a custom user profile image.',
      },
    },
  },
};

// Example with localized navigation links
export const LocalizedNavLinks: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'de',
    notificationCount: 0,
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: locales,
  },
};