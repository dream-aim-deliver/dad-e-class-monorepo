import type { Meta, StoryObj } from '@storybook/react';
import { CourseCardAddToPackage } from '../../lib/components/course-card/add-to-package/course-card-add-to-package';
import type { TLocale } from '@maany_shr/e-class-translations';

const sampleCourseData = {
  id: 'course-456',
  title: 'Mastering UI Design with Figma',
  duration: {
    video: 180,
    coaching: 90,
    selfStudy: 150,
  },
  imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  author: {
    name: 'Jordan Rivera',
    image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  },
  language: {
    code: 'ENG' as const,
    name: 'English' as const,
  },
  rating: 4.6,
};

const meta: Meta<typeof CourseCardAddToPackage> = {
  title: 'Components/CourseCardComponents/AddToPackage',
  component: CourseCardAddToPackage,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
    },
    rating: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
    },
    reviewCount: {
      control: 'number',
    },
    sessions: {
      control: 'number',
    },
    sales: {
      control: 'number',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    groupName: {
      control: 'text',
    },
    imageUrl: {
      control: 'text',
    },
    onManage: {
      action: 'manage-clicked',
    },
    onClickUser: {
      action: 'user-clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CourseCardAddToPackage>;

const baseArgs: Partial<typeof sampleCourseData> & {
  reviewCount: number;
  sessions: number;
  sales: number;
  locale: TLocale;
} = {
  ...sampleCourseData,
  reviewCount: 140,
  sessions: 12,
  sales: 450,
  locale: 'en',
};

export const Default: Story = {
  args: {
    ...baseArgs,
  },
};

export const WithGroupName: Story = {
  args: {
    ...baseArgs,
    groupName: 'UX/UI Bootcamp',
  },
};

export const GermanLocale: Story = {
  args: {
    ...baseArgs,
    locale: 'de',
  },
};

export const BrokenImage: Story = {
  args: {
    ...baseArgs,
    imageUrl: 'https://example.com/invalid-image.jpg',
  },
};
