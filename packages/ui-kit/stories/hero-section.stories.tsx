import type { Meta, StoryObj } from '@storybook/react';
import HeroSection from '../lib/components/cms/homepage-edit/hero-section';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof HeroSection> = {
    title: 'Components/CMS/HeroSection',
    component: HeroSection,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        initialValue: {
            control: 'object',
            description: 'Initial banner data',
        },
        onChange: {
            action: 'changed',
            description: 'Callback fired when banner data changes',
        },
        onFileUpload: {
            action: 'fileUploaded',
            description: 'Callback fired when file is uploaded',
        },
        onFileDelete: {
            action: 'fileDeleted',
            description: 'Callback fired when file is deleted',
        },
        onFileDownload: {
            action: 'fileDownloaded',
            description: 'Callback fired when file is downloaded',
        },
    },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

// Mock file upload function
const mockFileUpload = async (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
): Promise<fileMetadata.TFileMetadata> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (abortSignal?.aborted) {
        throw new Error('Upload cancelled');
    }

    // Return mock file metadata
    return {
        id: fileRequest.id || 'mock-file-id',
        name: fileRequest.name,
        size: fileRequest.file.size,
        category: 'image',
        status: 'available',
        url: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png'
    };
};

export const Default: Story = {
    args: {
        onChange: (bannerData) => console.log('Banner data changed:', bannerData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const WithInitialData: Story = {
    args: {
        initialValue: {
            title: 'Welcome to Our Platform',
            description: 'Discover amazing content and learn new skills with our comprehensive courses.',
            videoId: 'sample-video-123',
            thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
        },
        onChange: (bannerData) => console.log('Banner data changed:', bannerData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const LongContent: Story = {
    args: {
        initialValue: {
            title: 'Transform Your Career with Professional Development Courses That Actually Matter',
            description: 'Join thousands of professionals who have already transformed their careers through our comprehensive, industry-leading courses. Our expert instructors bring real-world experience to every lesson, ensuring you gain practical skills that employers value. From beginner-friendly introductions to advanced masterclasses, we have something for everyone looking to advance their career.',
            videoId: 'long-content-video-456',
            thumbnailUrl: null,
        },
        onChange: (bannerData) => console.log('Banner data changed:', bannerData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const MinimalContent: Story = {
    args: {
        initialValue: {
            title: 'Quick Start',
            description: 'Get started today!',
            videoId: null,
            thumbnailUrl: null,
        },
        onChange: (bannerData) => console.log('Banner data changed:', bannerData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const WithVideoOnly: Story = {
    args: {
        initialValue: {
            title: 'Watch Our Introduction Video',
            description: 'Learn about our platform through this comprehensive introduction video.',
            videoId: 'intro-video-789',
            thumbnailUrl: null,
        },
        onChange: (bannerData) => console.log('Banner data changed:', bannerData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const WithThumbnailOnly: Story = {
    args: {
        initialValue: {
            title: 'Visual Content',
            description: 'Experience our platform through rich visual content and imagery.',
            videoId: null,
            thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
        },
        onChange: (bannerData) => console.log('Banner data changed:', bannerData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const Interactive: Story = {
    args: {
        initialValue: {
            title: 'Edit Me!',
            description: 'Try editing the fields below to see the component in action.',
            videoId: 'interactive-demo',
            thumbnailUrl: null,
        },
        onChange: (bannerData) => {
            console.log('Banner data changed:', bannerData);
            alert(`Title: ${bannerData.title}\nDescription: ${bannerData.description}\nVideo ID: ${bannerData.videoId}\nThumbnail URL: ${bannerData.thumbnailUrl}`);
        },
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => {
            console.log('File deleted:', id);
            alert(`File ${id} deleted successfully!`);
        },
        onFileDownload: (id) => {
            console.log('File downloaded:', id);
            alert(`Downloading file ${id}...`);
        },
    },
};