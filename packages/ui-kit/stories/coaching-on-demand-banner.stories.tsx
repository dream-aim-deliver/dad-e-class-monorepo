import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
    title: 'Coaching on demand',
    description:
      'Are you looking for someone to exchange ideas with on equal footing, or do you want to learn new skills? Do you need support in choosing the right tools or advice for your project? Our industry experts are ready to help you succeed.',
    ImageUrls: [
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    ],
    locale: 'en',
  },
};

export const WithLongTitle: Story = {
  args: {
    title:
      'Comprehensive Coaching on Demand: Empowering Your Professional Growth and Project Success with Expert Guidanc',
    description:
      'Are you seeking a collaborative partner to exchange ideas, enhance your skill set, or receive tailored advice? Our seasoned industry experts are prepared to provide personalized support, helping you navigate tool selection, project challenges, and career advancement. Let us be your catalyst for success',
    ImageUrls: [
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirgqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    ],
    locale: 'en',
  },
};

export const WithManyImages: Story = {
  args: {
    title: 'Coaching On Demand',
    description: 'Choose from a wide variety of coaching specialties.',
    ImageUrls: [
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    ],
    locale: 'en',
  },
};

export const WithBrokenImages: Story = {
  args: {
    title: 'Coaching On Demand',
    description: 'Experience how our component handles broken image links.',
    ImageUrls: [
      'https://res.cloudinary.com/dryynqhao/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
      'https://res.cloudinary.com/dryynqhao/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
    ],
    locale: 'en',
  },
};
