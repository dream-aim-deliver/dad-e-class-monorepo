// Footer.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Footer } from '../lib/components/footer';
import { NextIntlClientProvider } from 'next-intl';

// Mock dictionary structure for the footer
const mockMessages = {
  components: {
    footer: {
      impressum: 'Impressum',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      rules: 'Rules',
      coursesInformation: 'Courses Information',
    },
  },
};

// Footer links to pass as children
const FooterLinks = ({ locale }: { locale: string }) => (
  <>
    <a href="/impressum" className="hover:text-orange-400">
      {locale === 'en'
        ? mockMessages.components.footer.impressum
        : 'Impressum (DE)'}
    </a>
    <a href="/privacy-policy" className="hover:text-orange-400">
      {locale === 'en'
        ? mockMessages.components.footer.privacyPolicy
        : 'Datenschutzrichtlinie'}
    </a>
    <a href="/terms-of-use" className="hover:text-orange-400">
      {locale === 'en'
        ? mockMessages.components.footer.termsOfUse
        : 'Nutzungsbedingungen'}
    </a>
    <a href="/rules" className="hover:text-orange-400">
      {locale === 'en' ? mockMessages.components.footer.rules : 'Regeln'}
    </a>
    <a href="/courses-information" className="hover:text-orange-400">
      {locale === 'en'
        ? mockMessages.components.footer.coursesInformation
        : 'Kursinformationen'}
    </a>
  </>
);

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow" />
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'The locale for language selection.',
    },
    logoSrc: {
      control: 'text',
      description: 'URL for the footer logo image.',
    },
  },
};

export default meta;

// Template to include children
const Template: StoryObj<typeof Footer> = {
  render: (args) => (
    <Footer {...args}>
      <FooterLinks locale={args.locale} />
    </Footer>
  ),
};

export const DefaultEnglish: StoryObj<typeof Footer> = {
  ...Template,
  args: {
    locale: 'en',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with English locale and default logo.',
      },
    },
  },
};

export const GermanLocale: StoryObj<typeof Footer> = {
  ...Template,
  args: {
    locale: 'de',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with German locale.',
      },
    },
  },
};

export const MobileView: StoryObj<typeof Footer> = {
  ...Template,
  args: {
    locale: 'en',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Footer in mobile view with English locale.',
      },
    },
  },
};

export const NoLogo: StoryObj<typeof Footer> = {
  ...Template,
  args: {
    locale: 'en',
    logoSrc: undefined, // No logoSrc, will use default text logo
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer without a custom logo, using the default text logo.',
      },
    },
  },
};

// Example with additional custom links
export const WithCustomLinks: StoryObj<typeof Footer> = {
  render: (args) => (
    <Footer {...args}>
      <FooterLinks locale={args.locale} />
      <a href="/contact" className="hover:text-orange-400">
        {args.locale === 'en' ? 'Contact' : 'Kontakt'}
      </a>
      <a href="/faq" className="hover:text-orange-400">
        {args.locale === 'en' ? 'FAQ' : 'Häufige Fragen'}
      </a>
    </Footer>
  ),
  args: {
    locale: 'en',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with additional custom links passed as children.',
      },
    },
  },
};

// Example with localized footer links
export const LocalizedFooterLinks: StoryObj<typeof Footer> = {
  render: (args) => (
    <Footer {...args}>
      <FooterLinks locale={args.locale} />
    </Footer>
  ),
  args: {
    locale: 'de',
    logoSrc: 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with localized navigation links in German.',
      },
    },
  },
};