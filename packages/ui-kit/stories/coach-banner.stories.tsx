import React from 'react';
import { CoachBanner } from '../lib/components/coach-banner';
import { Meta, StoryFn } from '@storybook/react-vite';
import { isLocalAware } from '@maany_shr/e-class-translations';

interface CoachBannerProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
}

const meta: Meta<typeof CoachBanner> = {
  title: 'Components/CoachBanner',
  component: CoachBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    title: {
      control: 'text',
      description: 'The main title of the banner',
    },
    subtitle: {
      control: 'text',
      description: 'The subtitle of the banner',
    },
    description: {
      control: 'text',
      description: 'The description text of the banner',
    },
    imageUrl: {
      control: 'text',
      description: 'The URL of the banner image',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function when the button is clicked',
    },
  },
};

export default meta;

const Template: StoryFn<isLocalAware & CoachBannerProps> = (args) => <CoachBanner {...args} />;

export const EnglishLocale = Template.bind({});
EnglishLocale.args = {
  locale: 'en',
  title: 'Share Your Skills and Earn',
  subtitle: 'Start Coaching Now',
  description: 'Are you passionate about sharing your expertise and helping others advance their careers while earning income? Join our community of coaches and make a real impact—whether you want to create your own course or offer one-on-one coaching, you have the freedom to choose how you contribute and grow. Take the leap and turn your skills into a rewarding opportunity today!',
  imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  onClick: () => alert('Join now clicked! (English)'),
};

export const GermanLocale = Template.bind({});
GermanLocale.args = {
  locale: 'de',
  title: 'Teilen Sie Ihre Fähigkeiten und verdienen',
  subtitle: 'Starte Coaching jetzt',
  description: 'Möchten Sie Ihr Fachwissen mit Leidenschaft weitergeben und anderen dabei helfen, ihre Karriere voranzutreiben und gleichzeitig Geld zu verdienen? Treten Sie unserer Coach-Community bei und leisten Sie einen echten Beitrag – ob Sie nun Ihren eigenen Kurs erstellen oder Einzelcoaching anbieten möchten, Sie haben die Freiheit zu entscheiden, wie Sie beitragen und sich weiterentwickeln. Wagen Sie den Sprung und verwandeln Sie Ihre Fähigkeiten noch heute in eine lohnende Chance!',
  imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  onClick: () => alert('Jetzt beitreten geklickt! (German)'),
};