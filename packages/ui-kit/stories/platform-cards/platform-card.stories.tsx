import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlatformCard } from '../../lib/components/platform-cards/platform-card';

const meta: Meta<typeof PlatformCard> = {
    title: 'Components/PlatformCard',
    component: PlatformCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            defaultValue: 'en',
            description: 'The language locale for translations',
        },
        imageUrl: {
            control: 'text',
            description: 'URL of the platform logo/image',
        },
        platformName: {
            control: 'text',
            description: 'Name of the platform',
        },
        courseCount: {
            control: 'number',
            description: 'Number of courses in the platform',
        },
    },
};

export default meta;

type Story = StoryObj<typeof PlatformCard>;

const mockData = {
    imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb4PNcNKSzikII3m1iNf1LMVch8Tb_bT5f2Q&s',
    platformName: 'Learning Platform',
    courseCount: 12,
    onClickManage: () => alert('Manage clicked'),
};

export const Default: Story = {
    args: {
        ...mockData,
        locale: 'en',
    },
};

export const WithGermanLocale: Story = {
    args: {
        ...mockData,
        locale: 'de',
        platformName: 'Lernplattform',
    },
};

export const BrokenImage: Story = {
    args: {
        ...mockData,
        imageUrl: 'https://example.com/nonexistent-image.jpg',
        locale: 'en',
    },
};

export const NoImage: Story = {
    args: {
        ...mockData,
        imageUrl: '',
        locale: 'en',
    },
};

export const LongPlatformName: Story = {
    args: {
        ...mockData,
        platformName: 'Very Long Platform Name That Should Test Truncation Behavior',
        locale: 'en',
    },
};

export const NoCourses: Story = {
    args: {
        ...mockData,
        courseCount: 0,
        locale: 'en',
    },
};

export const ManyCourses: Story = {
    args: {
        ...mockData,
        courseCount: 150,
        locale: 'en',
    },
};