import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CourseIntroInformationEdit from '../../lib/components/course-builder/course-intro-information';
import { TCourseMetadata } from 'packages/models/src/course';

const meta: Meta<typeof CourseIntroInformationEdit> = {
    title: 'Components/CourseBuilder/CourseIntroInformationEdit',
    component: CourseIntroInformationEdit,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockCourse: Omit<TCourseMetadata, 'imageUrl' | 'author'> = {
    title: 'Introduction to Programming',
    description: JSON.stringify([
        { type: 'paragraph', children: [{ text: 'This is a beginner-friendly course.' }] }
    ]),
    duration: {
        video: 60,
        coaching: 30,
        selfStudy: 120,
    },
    pricing: {
        fullPrice: 100,
        partialPrice: 50,
        currency: 'USD',
    },
    rating: 4.5,
    language: { code: 'en', name: 'English' },
};

const mockFileMetadataImage = {
    id: '1',
    name: 'course-image.jpg',
    mimeType: 'image/jpeg',
    size: 12345,
    url: 'https://via.placeholder.com/320x180',
    metadata: {
        width: 320,
        height: 180,
    }
};

const availableCourses = [
    { id: 1, name: 'Advanced React', imageUrl: { ...mockFileMetadataImage, url: 'https://via.placeholder.com/40' } },
    { id: 2, name: 'Node.js for Beginners', imageUrl: { ...mockFileMetadataImage, url: 'https://via.placeholder.com/40' } },
    { id: 3, name: 'Database Design', imageUrl: { ...mockFileMetadataImage, url: 'https://via.placeholder.com/40' } },
];

const requiredCourses = [
    { id: 1, name: 'Advanced React', imageUrl: { ...mockFileMetadataImage, url: 'https://via.placeholder.com/40' } },
]

const StoryWithState = () => {
    const [file, setFile] = useState<any>(mockFileMetadataImage);

    const handleFileChange = async (uploadRequest: any): Promise<any> => {
        console.log('File change requested:', uploadRequest);
        // Simulate an upload process
        return new Promise(resolve => {
            setTimeout(() => {
                const newFile = {
                    id: new Date().toISOString(),
                    name: uploadRequest.file.name,
                    mimeType: uploadRequest.file.type,
                    size: uploadRequest.file.size,
                    url: URL.createObjectURL(uploadRequest.file),
                    metadata: {
                        width: 320,
                        height: 180,
                    }
                };
                console.log('File "uploaded":', newFile);
                resolve(newFile);
            }, 1500);
        });
    };

    const handleUploadComplete = (uploadedFile: any) => {
        console.log('Upload complete:', uploadedFile);
        setFile(uploadedFile);
    };

    const handleSave = (course: any) => {
        alert('Course saved: ' + JSON.stringify(course, null, 2));
    };


    const handleDelete = (id: string) => {
        alert('Delete file with id: ' + id);
        setFile(null);
    };

    return (
        <CourseIntroInformationEdit
            {...mockCourse}
            imageUrl={file}
            requiredCourses={requiredCourses}
            availableCourses={availableCourses}
            coaches={[{ name: 'Coach Jane', imageUrl: { ...mockFileMetadataImage, url: 'https://via.placeholder.com/50' } }]}
            courseCreator={{ name: 'Creator John', imageUrl: { ...mockFileMetadataImage, url: 'https://via.placeholder.com/50' } }}
            onFileChange={handleFileChange}
            onUploadComplete={handleUploadComplete}
            onSave={handleSave}
            onDelete={handleDelete}
            onDownload={(file) => {
                alert('Download requested for file: ' + JSON.stringify(file));
            }}
            locale="en"
        />
    );
};


export const Default: Story = {
    render: () => <StoryWithState />,
};

const StoryWithoutImage = () => {
    const [file, setFile] = useState<any>(null);

    const handleFileChange = async (uploadRequest: any): Promise<any> => {
        console.log('File change requested:', uploadRequest);
        // Simulate an upload process
        return new Promise(resolve => {
            setTimeout(() => {
                const newFile = {
                    id: new Date().toISOString(),
                    name: uploadRequest.file.name,
                    mimeType: uploadRequest.file.type,
                    size: uploadRequest.file.size,
                    url: URL.createObjectURL(uploadRequest.file),
                    metadata: {
                        width: 320,
                        height: 180,
                    }
                };
                console.log('File "uploaded":', newFile);
                resolve(newFile);
            }, 1500);
        });
    };

    const handleUploadComplete = (uploadedFile: any) => {
        console.log('Upload complete:', uploadedFile);
        setFile(uploadedFile);
    };

    const handleSave = (course: any) => {
        alert('Course saved: ' + JSON.stringify(course, null, 2));
    };

    const handleDelete = (id: string) => {
        alert('Delete file with id: ' + id);
        setFile(null);
    };

    return (
        <CourseIntroInformationEdit
            {...mockCourse}
            imageUrl={file}
            requiredCourses={requiredCourses}
            availableCourses={availableCourses}
            coaches={[{ name: 'Coach Jane', imageUrl: { ...mockFileMetadataImage, url: 'https://via.placeholder.com/50' } }]}
            courseCreator={{ name: 'Creator John', imageUrl: { ...mockFileMetadataImage, url: 'https://via.placeholder.com/50' } }}
            onFileChange={handleFileChange}
            onUploadComplete={handleUploadComplete}
            onSave={handleSave}
            onDelete={handleDelete}
            onDownload={(file) => {
                alert('Download requested for file: ' + JSON.stringify(file));
            }}
            locale="en"
        />
    );
};

export const WithoutImage: Story = {
    render: () => <StoryWithoutImage />,
};
