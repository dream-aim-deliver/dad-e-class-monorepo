import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoachingOnDemandBanner } from '../lib/components/coaching-on-demand-banner/coaching-on-demand-banner';

const meta: Meta<typeof CoachingOnDemandBanner> = {
  title: 'Components/CoachingOnDemandBanner',
  component: CoachingOnDemandBanner,
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
type Story = StoryObj<typeof CoachingOnDemandBanner>;

export const Default: Story = {
  args: {
    title: 'Coaching on demand.Coaching on demandCoaching ',
    description:
      'Are you looking for someone to exchange ideas with on equal footing, or do you want to learn newAre you looking for someone to exchange ideas with on equal footing, or do you want to learn newAre you looking for someone to exchange ideas with on equal footing, or do you want to learn newAre you looking for someone to exchange ideas with on equal footing, or do you want to learn newAre you looking for someone to exchange ideas with on equal footing, or do you want to learn new',
    desktopImageUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    tabletImageUrl:
      'https://.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    mobileImageUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'de',
  },
};

export const WithLongTitle: Story = {
  args: {
    title:
      'Comprehensive Coaching on Demand: Empowering Your Professional Growth and Project Success with Expert Guidance',
    description:
      'Are you seeking a collaborative partner to exchange ideas, enhance your skill set, or receive tailored advice? Our seasoned industry experts are prepared to provide personalized support, helping you navigate tool selection, project challenges, and career advancement. Let us be your catalyst for success',
    desktopImageUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    tabletImageUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    mobileImageUrl:
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
  },
};

export const WithBrokenImages: Story = {
  args: {
    title: 'Coaching On Demand',
    description: 'Experience how our component handles broken image links.',
    desktopImageUrl:
      'https://res.cloudinary.com/dryynqhao/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    tabletImageUrl:
      'https://res.cloudinary.com/dryynqhao/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    mobileImageUrl:
      'https://res.cloudinary.com/dryynqhao/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    locale: 'en',
  },
};
