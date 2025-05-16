import type { Meta, StoryObj } from '@storybook/react';
import UploadCoachView from '../lib/components/upload-coach-view';

const meta: Meta<typeof UploadCoachView> = {
    title: 'Components/UploadCoachView',
    component: UploadCoachView,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof UploadCoachView>;

// Basic story with a single file
export const SingleFile: Story = {
    args: {
        studentUploadedFiles: [
            {
                fileId: 'file-1',
                fileName: 'assignment.pdf',
                fileSize: 1024 * 1024 * 2.5, // 2.5MB
                url: 'https://example.com/assignment.pdf',
                uploadedAt: '2025-05-14T10:30:00Z'
            }
        ],
        studentComment: 'Here is my completed assignment.',
        onDownload: (fileId: string) => console.log('Downloading file:', fileId)
    }
};

// Story with multiple files
export const MultipleFiles: Story = {
    args: {
        studentUploadedFiles: [
            {
                fileId: 'file-1',
                fileName: 'main-assignment.pdf',
                fileSize: 1024 * 1024 * 3.2, // 3.2MB
                url: 'https://example.com/main-assignment.pdf',
                uploadedAt: '2025-05-14T10:30:00Z'
            },
            {
                fileId: 'file-2',
                fileName: 'supplementary-materials.docx',
                fileSize: 1024 * 1024 * 1.8, // 1.8MB
                url: 'https://example.com/supplementary-materials.docx',
                uploadedAt: '2025-05-14T10:31:00Z'
            },
            {
                fileId: 'file-3',
                fileName: 'presentation.pptx',
                fileSize: 1024 * 1024 * 5.5, // 5.5MB
                url: 'https://example.com/presentation.pptx',
                uploadedAt: '2025-05-14 10:32'
            }
        ],
        studentComment: 'I have included my main assignment, supplementary materials, and a presentation that explains my approach.',
        onDownload: (fileId: string) => console.log('Downloading file:', fileId)
    }
};

// Story with no files but with comment
export const OnlyComment: Story = {
    args: {
        studentUploadedFiles: [],
        studentComment: 'I will upload my files soon. I need a bit more time to complete the assignment.',
        onDownload: (fileId: string) => console.log('Downloading file:', fileId)
    }
};

// Story with long comment
export const LongComment: Story = {
    args: {
        studentUploadedFiles: [
            {
                fileId: 'file-1',
                fileName: 'final-project.pdf',
                fileSize: 1024 * 1024 * 4.7, // 4.7MB
                url: 'https://example.com/final-project.pdf',
                uploadedAt: '2025-05-14 15:45'
            }
        ],
        studentComment: 'I would like to provide some context for my assignment. I chose this particular approach because it aligns with the course objectives and demonstrates the practical application of the concepts we learned. I have included detailed explanations in the document and tried to address all the requirements mentioned in the assignment brief. Please let me know if you need any clarification or have questions about my submission.',
        onDownload: (fileId: string) => console.log('Downloading file:', fileId)
    }
};