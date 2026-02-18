import { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from '../lib/components/footer';
import { NextIntlClientProvider } from 'next-intl';
import { locales, TLocale } from '@maany_shr/e-class-translations';
import { useState, useEffect } from 'react';

// Mock dictionary structure (aligned with TDictionary)
const mockMessages = {
  components: {
    footer: {
      impressum: 'Impressum',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      rules: 'Rules',
      coursesInformation: 'Courses Information',
      companyInfo: '© 2024 JUST DO AD GmbH  •  Hermetschloostrasse 70, 8048 Zürich  •  hi@justdoad.ai',
    },
  },
};

const mockMessagesDe = {
  components: {
    footer: {
      impressum: 'Impressum (DE)',
      privacyPolicy: 'Datenschutzrichtlinie',
      termsOfUse: 'Nutzungsbedingungen',
      rules: 'Regeln',
      coursesInformation: 'Kursinformationen',
      companyInfo: '© 2024 JUST DO AD GmbH • Hermetschloostrasse 70, 8048 Zürich • hallo@justdoad.ai',
    },
  },
};

// Footer links using the dictionary
const FooterLinks = ({ locale }: { locale: TLocale }) => {
  const messages = locale === 'en' ? mockMessages : mockMessagesDe;
  const t = messages.components.footer;

  const linkClass = 'hover:text-button-primary-hover-fill cursor-pointer text-button-primary-fill text-sm';

  return (
    <>
      <a href="/impressum">
        <span className={linkClass}>{t.impressum}</span>
      </a>
      <a href="/privacy-policy">
        <span className={linkClass}>{t.privacyPolicy}</span>
      </a>
      <a href="/terms-of-use">
        <span className={linkClass}>{t.termsOfUse}</span>
      </a>
      <a href="/rules">
        <span className={linkClass}>{t.rules}</span>
      </a>
      <a href="/offer-information">
        <span className={linkClass}>{t.coursesInformation}</span>
      </a>
    </>
  );
};

// Footer company info using the dictionary
const FooterCompanyInfo = ({ locale }: { locale: TLocale }) => {
  const messages = locale === 'en' ? mockMessages : mockMessagesDe;
  const t = messages.components.footer;

  return <span>{t.companyInfo}</span>;
};

// Wrapper component to manage state and sync with args.locale
const FooterWrapper = (args: any) => {
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
      <Footer
        {...args}
        locale={locale}
        onChangeLanguage={handleLocaleChange}
        availableLocales={args.availableLocales}
        footerChildren={<FooterCompanyInfo locale={locale} />}
        children={<FooterLinks locale={locale} />}
      />
    </NextIntlClientProvider>
  );
};

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow" />
        <Story />
      </div>
    ),
  ],
  argTypes: {
    locale: {
      control: 'select',
      options: locales,
      description: 'The current locale for language selection.',
    },
    logoSrc: {
      control: 'text',
      description: 'URL for the footer logo image.',
    },
    footerChildren: {
      control: false, // Disable control since it's rendered via FooterCompanyInfo
      description: 'Content to be rendered as company information.',
    },
    children: {
      control: false, // Disable control since it's rendered via FooterLinks
      description:
        'Navigation links to be rendered in the footer. Automatically styled with `hover:text-button-primary-hover-fill cursor-pointer text-sm`.',
    },
    availableLocales: {
      control: 'object',
      description: 'Array of available locales for the language dropdown.',
      defaultValue: ['en', 'de'],
    },
    onChangeLanguage: {
      action: 'changed', // Log action in Storybook's Actions panel
      description: 'Callback function triggered when the language is changed.',
    },
  },
};

export default meta;

// Template uses the wrapper component
const Template: StoryObj<typeof Footer> = {
  render: (args) => <FooterWrapper {...args} />,
};

export const DefaultEnglish: StoryObj<typeof Footer> = {
  ...Template,
  args: {
    locale: 'en',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with English locale, default logo, and company info.',
      },
    },
  },
};

export const MobileView: StoryObj<typeof Footer> = {
  ...Template,
  args: {
    locale: 'en',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Footer in mobile view with English locale and company info.',
      },
    },
  },
};

export const NoLogo: StoryObj<typeof Footer> = {
  ...Template,
  args: {
    locale: 'en',
    logoSrc: '',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer without a custom logo and with company info.',
      },
    },
  },
};

export const LocalizedFooter: StoryObj<typeof Footer> = {
  ...Template,
  args: {
    locale: 'de',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
    availableLocales: ['en', 'de'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with localized navigation links and company info in German.',
      },
    },
  },
};