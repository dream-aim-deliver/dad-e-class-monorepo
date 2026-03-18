import { Meta, StoryObj } from '@storybook/react-vite';
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

const getNavbarCopy = (locale: TLocale) =>
  locale === 'en' ? mockMessages.components.navbar : mockMessagesDe.components.navbar;

const getDropdownOptions = (locale: TLocale) => {
  if (locale === 'en') {
    return [
      { label: 'Courses', value: 'courses' },
      { label: 'Profile', value: 'profile' },
      { label: 'Logout', value: 'logout' },
    ];
  }

  return [
    { label: 'Kurse', value: 'courses' },
    { label: 'Profil', value: 'profile' },
    { label: 'Abmelden', value: 'logout' },
  ];
};

// Navigation links using the dictionary
const NavLinks = ({ locale }: { locale: TLocale }) => {
  const t = getNavbarCopy(locale);

  const linkClass = 'hover:text-button-primary-hover-fill cursor-pointer text-md';

  return (
    <>
      <a href="/offers">
        <span className={linkClass}>{t.offers}</span>
      </a>
      <a href="/coaching">
        <span className={linkClass}>{t.coaching}</span>
      </a>
      <a href="/how-it-works">
        <span className={linkClass}>{t.howItWorks}</span>
      </a>
      <a href="/about">
        <span className={linkClass}>{t.about}</span>
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

  const navbarCopy = getNavbarCopy(locale);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={locale === 'en' ? mockMessages : mockMessagesDe}
    >
      <Navbar
        {...args}
        locale={locale}
        onChangeLanguage={handleLocaleChange}
        dropdownTriggerText={args.dropdownTriggerText ?? navbarCopy.workspace}
        dropdownOptions={args.dropdownOptions ?? getDropdownOptions(locale)}
        children={<NavLinks locale={locale} />}
      />
    </NextIntlClientProvider>
  );
};

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '400px' }}>
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
      description: 'The current locale for language selection.',
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
      description: 'URL for the navbar logo image.',
    },
    availableLocales: {
      control: 'object',
      description: 'Array of available locales for the language dropdown.',
      defaultValue: ['en', 'de'],
    },
    children: {
      control: false, // Disable control since it's rendered via NavLinks
      description:
        'Navigation links to be rendered in the navbar. Automatically styled with `hover:text-button-primary-hover-fill cursor-pointer text-sm`.',
    },
    userProfile: {
      control: false, // Disable control since it's optional and custom
      description: 'Custom user profile component to override the default.',
    },
    dropdownTriggerText: {
      control: 'text',
      description: 'Text shown next to the user avatar dropdown trigger.',
    },
    dropdownOptions: {
      control: 'object',
      description: 'Options shown in the workspace dropdown.',
    },
    onChangeLanguage: {
      action: 'changed', // Log action in Storybook's Actions panel
      description: 'Callback function triggered when the language is changed.',
    },
  },
};

export default meta;

// Template uses the wrapper component
const Template: StoryObj<typeof Navbar> = {
  render: (args) => <NavbarWrapper {...args} />,
};

export const DefaultEnglish: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: false,
    locale: 'en',
    notificationCount: 0,
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar with English locale, logged-out state, and default logo.',
      },
    },
  },
};

export const LoggedInWithNotifications: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    showNotifications: true,
    notificationCount: 200,
    dropdownTriggerText: 'Workspace',
    dropdownOptions: getDropdownOptions('en'),
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar with English locale, logged-in state, and notifications.',
      },
    },
  },
};

export const MobileView: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    showNotifications: true,
    notificationCount: 2,
    dropdownTriggerText: 'Workspace',
    dropdownOptions: getDropdownOptions('en'),
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Navbar in mobile view with English locale and logged-in state.',
      },
    },
  },
};

export const MobileGuestView: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: false,
    locale: 'en',
    showNotifications: false,
    notificationCount: 0,
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Navbar in mobile view with English locale and logged-out state.',
      },
    },
  },
};

export const NoLogo: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'en',
    notificationCount: 0,
    dropdownTriggerText: 'Workspace',
    dropdownOptions: getDropdownOptions('en'),
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: '',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar without a custom logo, logged-in state.',
      },
    },
  },
};

export const LocalizedNavbar: StoryObj<typeof Navbar> = {
  ...Template,
  args: {
    isLoggedIn: true,
    locale: 'de',
    notificationCount: 0,
    dropdownTriggerText: 'Arbeitsbereich',
    dropdownOptions: getDropdownOptions('de'),
    userProfileImageSrc:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    userName: 'John Doe',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar with localized navigation links in German.',
      },
    },
  },
};
