import React from 'react';
import { CoachBanner } from '../lib/components/coach-banner'; // Adjust the import path
import { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
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
  },
};

export default meta;

const Template: StoryFn<{ locale: 'en' | 'de' }> = (args) => <CoachBanner {...args} />;

export const EnglishLocale = Template.bind({});
EnglishLocale.args = {
  locale: 'en',
};

export const GermanLocale = Template.bind({});
GermanLocale.args = {
  locale: 'de',
};
