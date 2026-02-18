import type { Meta, StoryObj } from '@storybook/react-vite';
import PageTitleSection from '../lib/components/cms/offerpage-edit/page-title-section';

const meta: Meta<typeof PageTitleSection> = {
    title: 'Components/CMS/PageTitleSection',
    component: PageTitleSection,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        initialValue: {
            control: 'object',
            description: 'Initial page title data',
        },
        onChange: {
            action: 'changed',
            description: 'Callback fired when page title data changes',
        },
    },
};

export default meta;
type Story = StoryObj<typeof PageTitleSection>;

export const Default: Story = {
    args: {
        onChange: (pageData) => console.log('Page data changed:', pageData),
    },
};

export const WithInitialData: Story = {
    args: {
        initialValue: {
            title: 'Welcome to Our Offers Page',
            description: 'Discover amazing packages and courses designed to help you achieve your goals.',
        },
        onChange: (pageData) => console.log('Page data changed:', pageData),
    },
};

export const LongContent: Story = {
    args: {
        initialValue: {
            title: 'Comprehensive Learning Solutions for Professional Growth and Career Advancement',
            description: 'Explore our extensive collection of premium educational content, expert-led courses, and specialized coaching programs. Whether you\'re looking to acquire new skills, advance your career, or pursue personal development, our carefully curated offerings provide the knowledge and guidance you need to succeed in today\'s competitive landscape.',
        },
        onChange: (pageData) => console.log('Page data changed:', pageData),
    },
};

export const MinimalContent: Story = {
    args: {
        initialValue: {
            title: 'Our Offers',
            description: 'Check out what we have to offer.',
        },
        onChange: (pageData) => console.log('Page data changed:', pageData),
    },
};

export const Interactive: Story = {
    args: {
        initialValue: {
            title: 'Edit This Title',
            description: 'Try editing the title and description fields to see the component in action.',
        },
        onChange: (pageData) => {
            console.log('Page data changed:', pageData);
            alert(`Title: ${pageData.title}\nDescription: ${pageData.description}`);
        },
    },
};