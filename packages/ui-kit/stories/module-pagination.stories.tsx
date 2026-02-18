import { Meta, StoryObj } from '@storybook/react-vite';
import { ModulePagination } from '../lib/components/module-pagination';
import { NextIntlClientProvider } from 'next-intl';
import { useState, useEffect } from 'react';

// Mock dictionary structure for translations
const mockMessagesEN = {
  components: {
    modulePagination: {
      previous: 'Previous',
      next: 'Next',
      lesson: 'Lesson',
      of: 'of',
    },
  },
};

const mockMessagesDE = {
  components: {
    modulePagination: {
      previous: 'Vorherige',
      next: 'Nächste',
      lesson: 'Lektion',
      of: 'von',
    },
  },
};

// Wrapper component to manage state and sync with args.locale
const ModulePaginationWrapper = (args: any) => {
  const [locale, setLocale] = useState<'en' | 'de'>(args.locale);

  // Sync internal state with args.locale when it changes via Storybook controls
  useEffect(() => {
    setLocale(args.locale);
  }, [args.locale]);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as 'en' | 'de');
  };

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={locale === 'en' ? mockMessagesEN : mockMessagesDE}
    >
      <ModulePagination
        {...args}
        locale={locale}
        onChangeLanguage={handleLocaleChange}
      />
    </NextIntlClientProvider>
  );
};


const meta: Meta<typeof ModulePagination> = {
  title: 'Components/ModulePagination',
  component: ModulePagination,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    currentIndex: {
      control: 'number',
      description: 'The current lesson index (0-based).',
    },
    totalLessons: {
      control: 'number',
      description: 'The total number of lessons.',
    },
    onPrevious: {
      action: 'previousClicked',
      description: 'Callback function triggered when the Previous button is clicked.',
    },
    onNext: {
      action: 'nextClicked',
      description: 'Callback function triggered when the Next button is clicked.',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'The current locale for language selection.',
    },
  },
};

export default meta;

/**
 * Template for rendering the ModulePagination component with customizable props.
 */
const Template: StoryObj<typeof ModulePagination> = {
  render: (args) => <ModulePaginationWrapper {...args} />,
};

/**
 * Default story showcasing a middle lesson navigation in English.
 */
export const MiddleLessonEN: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 1,
    totalLessons: 5,
    onPrevious: () => alert('Previous clicked!'),
    onNext: () => alert('Next clicked!'),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A navigation UI showing a middle lesson (e.g., Lesson 2 of 5) with both Previous and Next buttons enabled in English.',
      },
    },
  },
};

/**
 * Middle lesson navigation in German.
 */
export const MiddleLessonDE: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 1,
    totalLessons: 5,
    onPrevious: () => alert('Vorherige geklickt!'),
    onNext: () => alert('Nächste geklickt!'),
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Eine Navigations-UI, die eine mittlere Lektion (z. B. Lektion 2 von 5) mit aktivierten Vorherige- und Nächste-Buttons anzeigt, auf Deutsch.',
      },
    },
  },
};

/**
 * First lesson story in English.
 */
export const FirstLessonEN: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 0,
    totalLessons: 5,
    onPrevious: () => alert('Previous clicked!'),
    onNext: () => alert('Next clicked!'),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation UI for the first lesson in English.',
      },
    },
  },
};

/**
 * First lesson story in German.
 */
export const FirstLessonDE: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 0,
    totalLessons: 5,
    onPrevious: () => alert('Vorherige geklickt!'),
    onNext: () => alert('Nächste geklickt!'),
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigations-UI für die erste Lektion auf Deutsch.',
      },
    },
  },
};

/**
 * Last lesson story in English.
 */
export const LastLessonEN: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 4,
    totalLessons: 5,
    onPrevious: () => alert('Previous clicked!'),
    onNext: () => alert('Next clicked!'),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation UI for the last lesson in English.',
      },
    },
  },
};

/**
 * Last lesson story in German.
 */
export const LastLessonDE: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 4,
    totalLessons: 5,
    onPrevious: () => alert('Vorherige geklickt!'),
    onNext: () => alert('Nächste geklickt!'),
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigations-UI für die letzte Lektion auf Deutsch.',
      },
    },
  },
};

/**
 * Single lesson story in English.
 */
export const SingleLessonEN: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 0,
    totalLessons: 1,
    onPrevious: () => alert('Previous clicked!'),
    onNext: () => alert('Next clicked!'),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation UI for a single lesson in English.',
      },
    },
  },
};

/**
 * Single lesson story in German.
 */
export const SingleLessonDE: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 0,
    totalLessons: 1,
    onPrevious: () => alert('Vorherige geklickt!'),
    onNext: () => alert('Nächste geklickt!'),
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigations-UI für eine einzelne Lektion auf Deutsch.',
      },
    },
  },
};

/**
 * Interactive navigation story in English.
 */
export const InteractiveNavigationEN: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 1,
    totalLessons: 5,
    onPrevious: () => alert('Previous clicked!'),
    onNext: () => alert('Next clicked!'),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive navigation with click handlers in English.',
      },
    },
  },
};

/**
 * Interactive navigation story in German.
 */
export const InteractiveNavigationDE: StoryObj<typeof ModulePagination> = {
  ...Template,
  args: {
    currentIndex: 1,
    totalLessons: 5,
    onPrevious: () => alert('Vorherige geklickt!'),
    onNext: () => alert('Nächste geklickt!'),
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktive Navigation mit Klick-Handlern auf Deutsch.',
      },
    },
  },
};