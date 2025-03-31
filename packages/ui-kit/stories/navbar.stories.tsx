import { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../lib/components/navbar';
import { NextIntlClientProvider } from 'next-intl';
import { locales, TLocale } from '@maany_shr/e-class-translations';
import { useState, useEffect } from 'react';

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

// Navigation links using the dictionary
const NavLinks = ({ locale }: { locale: TLocale }) => {
  const messages = locale === 'en' ? mockMessages : mockMessagesDe;
  const t = messages.components.navbar;

  return (
    <>
      <a href="/offers">
        <span className="hover:text-button-primary-fill cursor-pointer">
          {t.offers}
        </span>
      </a>
      <a href="/coaching">
        <span className="hover:text-button-primary-fill cursor-pointer">
          {t.coaching}
        </span>
      </a>
      <a href="/how-it-works">
        <span className="hover:text-button-primary-fill cursor-pointer">
          {t.howItWorks}
        </span>
      </a>
      <a href="/about">
        <span className="hover:text-button-primary-fill cursor-pointer">
          {t.about}
        </span>
      </a>
    </>
  );
};

// Wrapper component to manage state and sync with args.locale
const NavbarWrapper = (args: any) => {
  const [locale, setLocale] = useState<TLocale>(args.locale);

  // Sync internal state with args.locale when it changes via Storybook controls
  useEffect(() => {
    setLocale(args.locale);
  }, [args.locale]);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as TLocale);
  };

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={locale === 'en' ? mockMessages : mockMessagesDe}
    >
      <Navbar
        {...args}
        locale={locale}
        onChangeLanguage={handleLocaleChange}
      >
        <NavLinks locale={locale} />
      </Navbar>
    </NextIntlClientProvider>
  );
};

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isLoggedIn: {
      control: 'boolean',
      description: 'Whether the user is logged in.',
    },
    locale: {
      control: 'select',
      options: locales,
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
      options: locales,
      description: 'Array of available locales for the language dropdown.',
    },
  },
};

export default meta;

// Template uses the wrapper component
const Template: StoryObj<typeof Navbar> = {
  render: (args) => <NavbarWrapper {...args} />,
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
    availableLocales: locales,
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