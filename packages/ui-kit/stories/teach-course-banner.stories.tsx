import { TeachCourseBanner } from '../lib/components/teach-course-banner';
import { Meta, StoryFn } from '@storybook/react';
import { isLocalAware } from '@maany_shr/e-class-translations';

interface TeachCourseBannerProps {
  imageUrl: string;
  onClick: () => void;
}

const meta: Meta<typeof TeachCourseBanner> = {
  title: 'Components/TeachCourseBanner',
  component: TeachCourseBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
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

const Template: StoryFn<isLocalAware & TeachCourseBannerProps> = (args) => <TeachCourseBanner {...args} />;

export const EnglishLocale = Template.bind({});
EnglishLocale.args = {
  locale: 'en',
  imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
  onClick: () => alert('Teach this course clicked! (English)'),
};

export const GermanLocale = Template.bind({});
GermanLocale.args = {
  locale: 'de',
  imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
  onClick: () => alert('Diesen Kurs unterrichten geklickt! (German)'),
};

export const WithBrokenImage = Template.bind({});
WithBrokenImage.args = {
  locale: 'en',
  imageUrl: 'https://broken-url-example.com/nonexistent-image.jpg',
  onClick: () => alert('Teach this course clicked!'),
};

