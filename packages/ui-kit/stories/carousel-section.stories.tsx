import type { Meta, StoryObj } from '@storybook/react-vite';
import CarouselSection from '../lib/components/cms/carousel-section';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof CarouselSection> = {
    title: 'Components/CMS/CarouselSection',
    component: CarouselSection,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        initialValue: {
            control: 'object',
            description: 'Initial carousel data array',
        },
        onChange: {
            action: 'changed',
            description: 'Callback fired when carousel data changes',
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
type Story = StoryObj<typeof CarouselSection>;

// Mock file upload function
const mockFileUpload = async (
    fileRequest: fileMetadata.TFileUploadRequest,
    uploadType: "upload_home_page_carousel_item_image" | "upload_offers_page_carousel_card_image",
    abortSignal?: AbortSignal
): Promise<fileMetadata.TFileMetadata> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (abortSignal?.aborted) {
        throw new Error('Upload cancelled');
    }

    // Return mock file metadata
    return {
        id: fileRequest.id || `mock-file-id-${Date.now()}`,
        name: fileRequest.name,
        size: fileRequest.file.size,
        category: 'image',
        status: 'available',
        url: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png'
    };
};

export const Default: Story = {
    args: {
        onChange: (carouselData) => console.log('Carousel data changed:', carouselData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const WithInitialData: Story = {
    args: {
        initialValue: [
            {
                title: 'Featured Course: Web Development',
                description: 'Learn modern web development with React, Node.js, and TypeScript. Perfect for beginners and intermediate developers.',
                imageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                buttonText: 'Start Learning',
                buttonUrl: '/courses/web-development',
                badge: 'New'
            },
            {
                title: 'Data Science Fundamentals',
                description: 'Master the basics of data science including Python, statistics, and machine learning algorithms.',
                imageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                buttonText: 'View Course',
                buttonUrl: '/courses/data-science',
                badge: 'Popular'
            },
            {
                title: 'Digital Marketing Mastery',
                description: 'Comprehensive guide to digital marketing strategies, SEO, and social media marketing.',
                imageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                buttonText: 'Explore Now',
                buttonUrl: '/courses/digital-marketing',
                badge: ''
            }
        ],
        onChange: (carouselData) => console.log('Carousel data changed:', carouselData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const SingleItem: Story = {
    args: {
        initialValue: [
            {
                title: 'Premium Course Bundle',
                description: 'Get access to all our premium courses with lifetime updates and exclusive content.',
                imageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                buttonText: 'Get Bundle',
                buttonUrl: '/bundles/premium',
                badge: 'Limited Time'
            }
        ],
        onChange: (carouselData) => console.log('Carousel data changed:', carouselData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const WithoutImages: Story = {
    args: {
        initialValue: [
            {
                title: 'Quick Start Guide',
                description: 'Get up and running with our platform in just 5 minutes.',
                imageUrl: null,
                buttonText: 'Start Now',
                buttonUrl: '/quick-start',
                badge: 'Free'
            },
            {
                title: 'Advanced Techniques',
                description: 'Take your skills to the next level with advanced tutorials and techniques.',
                imageUrl: null,
                buttonText: 'Learn More',
                buttonUrl: '/advanced',
                badge: 'Pro'
            }
        ],
        onChange: (carouselData) => console.log('Carousel data changed:', carouselData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const LongContent: Story = {
    args: {
        initialValue: [
            {
                title: 'Complete Professional Development Program for Career Advancement and Skill Enhancement',
                description: 'This comprehensive program is designed for professionals who want to advance their careers through structured learning paths, hands-on projects, and industry-recognized certifications. Our curriculum covers everything from technical skills to leadership development, ensuring you have all the tools needed for career success.',
                imageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                buttonText: 'Join Professional Program Today',
                buttonUrl: '/programs/professional-development',
                badge: 'Certification Available'
            }
        ],
        onChange: (carouselData) => console.log('Carousel data changed:', carouselData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const MinimalContent: Story = {
    args: {
        initialValue: [
            {
                title: 'Start',
                description: 'Begin now',
                imageUrl: null,
                buttonText: 'Go',
                buttonUrl: '/start',
                badge: ''
            }
        ],
        onChange: (carouselData) => console.log('Carousel data changed:', carouselData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const MixedContent: Story = {
    args: {
        initialValue: [
            {
                title: 'Course with Everything',
                description: 'Full featured course with image and badge.',
                imageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                buttonText: 'Full Course',
                buttonUrl: '/courses/full',
                badge: 'Complete'
            },
            {
                title: 'No Image Course',
                description: 'Great content without an image.',
                imageUrl: null,
                buttonText: 'Text Only',
                buttonUrl: '/courses/text',
                badge: 'Simple'
            },
            {
                title: 'No Badge Course',
                description: 'Course content with image but no badge.',
                imageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                buttonText: 'Standard',
                buttonUrl: '/courses/standard',
                badge: ''
            }
        ],
        onChange: (carouselData) => console.log('Carousel data changed:', carouselData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const Interactive: Story = {
    args: {
        initialValue: [
            {
                title: 'Edit Me!',
                description: 'Try editing the fields below to see the component in action.',
                imageUrl: null,
                buttonText: 'Click Me',
                buttonUrl: '/interactive',
                badge: 'Demo'
            }
        ],
        onChange: (carouselData) => {
            console.log('Carousel data changed:', carouselData);
            alert(`Carousel now has ${carouselData.length} items`);
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

export const EmptyState: Story = {
    args: {
        initialValue: [],
        onChange: (carouselData) => console.log('Carousel data changed:', carouselData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};