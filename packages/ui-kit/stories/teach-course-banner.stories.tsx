import { TeachCourseBanner } from '../lib/components/teach-course-banner';
import { Meta, StoryFn } from '@storybook/react-vite';
import { isLocalAware } from '@maany_shr/e-class-translations';

interface TeachCourseBannerProps {
  imageUrl: string;
  title: string;
  description: string;
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
    title: {
      control: 'text',
      description: 'The title text to display in the banner',
    },
    description: {
      control: 'text',
      description: 'The description text to display in the banner',
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
  title: 'Turn Your Expertise Into Earnings',
  description: 'Have the skills? Become a coach and inspire others! Share your knowledge, teach this course, and earn while making a difference. Join our community of experts.',
  onClick: () => alert('Teach this course clicked! (English)'),
};

export const GermanLocale = Template.bind({});
GermanLocale.args = {
  locale: 'de',
  imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
  title: 'Verwandeln Sie Ihr Fachwissen in Einkommen',
  description: 'Haben Sie die Fähigkeiten? Werden Sie Coach und inspirieren Sie andere! Teilen Sie Ihr Wissen, unterrichten Sie diesen Kurs und verdienen Sie dabei einen Unterschied. Treten Sie unserer Experten-Community bei.',
  onClick: () => alert('Diesen Kurs unterrichten geklickt! (German)'),
};

export const WithBrokenImage = Template.bind({});
WithBrokenImage.args = {
  locale: 'en',
  imageUrl: 'https://broken-url-example.com/nonexistent-image.jpg',
  title: 'Turn Your Expertise Into Earnings',
  description: 'Have the skills? Become a coach and inspire others! Share your knowledge, teach this course, and earn while making a difference. Join our community of experts.',
  onClick: () => alert('Teach this course clicked!'),
};

