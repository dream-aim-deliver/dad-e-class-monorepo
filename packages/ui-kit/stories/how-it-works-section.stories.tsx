import type { Meta, StoryObj } from '@storybook/react-vite';
import HowItWorksSection from '../lib/components/cms/homepage-edit/how-it-works-section';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof HowItWorksSection> = {
    title: 'Components/CMS/HowItWorksSection',
    component: HowItWorksSection,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        initialValue: {
            control: 'object',
            description: 'Initial accordion data',
        },
        onChange: {
            action: 'changed',
            description: 'Callback fired when accordion data changes',
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
type Story = StoryObj<typeof HowItWorksSection>;

// Mock file upload function
const mockFileUpload = async (
    fileRequest: fileMetadata.TFileUploadRequest,
    uploadType: "upload_accordion_icon",
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
        onChange: (accordionData) => console.log('Accordion data changed:', accordionData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const WithInitialData: Story = {
    args: {
        initialValue: {
            title: 'How It Works',
            showNumbers: true,
            items: [
                {
                    title: 'Step 1: Sign Up',
                    content: 'Create your account to get started with our platform.',
                    position: 1,
                    iconImageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                },
                {
                    title: 'Step 2: Choose Your Course',
                    content: 'Browse our extensive library and select the course that fits your needs.',
                    position: 2,
                    iconImageUrl: null,
                },
                {
                    title: 'Step 3: Start Learning',
                    content: 'Begin your learning journey with interactive lessons and expert guidance.',
                    position: 3,
                    iconImageUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png',
                },
            ],
        },
        onChange: (accordionData) => console.log('Accordion data changed:', accordionData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const WithoutNumbers: Story = {
    args: {
        initialValue: {
            title: 'Our Process',
            showNumbers: false,
            items: [
                {
                    title: 'Discovery',
                    content: 'We understand your goals and requirements.',
                    position: 1,
                    iconImageUrl: null,
                },
                {
                    title: 'Planning',
                    content: 'We create a detailed plan tailored to your needs.',
                    position: 2,
                    iconImageUrl: null,
                },
                {
                    title: 'Execution',
                    content: 'We implement the plan with precision and care.',
                    position: 3,
                    iconImageUrl: null,
                },
            ],
        },
        onChange: (accordionData) => console.log('Accordion data changed:', accordionData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const MinimalContent: Story = {
    args: {
        initialValue: {
            title: 'Quick Guide',
            showNumbers: true,
            items: [
                {
                    title: 'Start',
                    content: 'Begin here.',
                    position: 1,
                    iconImageUrl: null,
                },
            ],
        },
        onChange: (accordionData) => console.log('Accordion data changed:', accordionData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const EmptyAccordion: Story = {
    args: {
        initialValue: {
            title: 'Getting Started',
            showNumbers: true,
            items: [],
        },
        onChange: (accordionData) => console.log('Accordion data changed:', accordionData),
        onFileUpload: mockFileUpload,
        onFileDelete: (id) => console.log('File deleted:', id),
        onFileDownload: (id) => console.log('File downloaded:', id),
    },
};

export const Interactive: Story = {
    args: {
        initialValue: {
            title: 'Interactive Demo',
            showNumbers: true,
            items: [
                {
                    title: 'Try editing this item',
                    content: 'Use the accordion builder to modify this content.',
                    position: 1,
                    iconImageUrl: null,
                },
            ],
        },
        onChange: (accordionData) => {
            console.log('Accordion data changed:', accordionData);
            alert(`Title: ${accordionData.title}\nShow Numbers: ${accordionData.showNumbers}\nItems: ${accordionData.items.length}`);
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