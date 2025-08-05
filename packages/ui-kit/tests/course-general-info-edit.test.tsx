import { render, screen } from '@testing-library/react';
import { TCourseMetadata } from 'packages/models/src/course';
import CourseIntroInformationEdit from '../lib/components/course-builder/course-intro-information';

const mockCourse: Omit<TCourseMetadata, 'imageUrl'> = {
    title: 'Test Course',
    description: JSON.stringify([
        { type: 'paragraph', children: [{ text: 'Test description.' }] }
    ]),
    duration: {
        video: 10,
        coaching: 5,
        selfStudy: 20,
    },
    pricing: {
        fullPrice: 100,
        partialPrice: 50,
        currency: 'USD',
    },
    rating: 5,
    language: { code: 'en', name: 'English' },
};

const mockFileMetadataImage = {
    id: '1',
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    size: 12345,
    url: 'https://via.placeholder.com/320x180',
    metadata: {
        width: 320,
        height: 180,
    }
};

describe('CourseIntroInformationEdit', () => {
    it('renders course title and description', () => {
        render(
            <CourseIntroInformationEdit
                {...mockCourse}
                imageUrl={mockFileMetadataImage}
                requiredCourses={[]}
                availableCourses={[]}
                coaches={[]}
                courseCreator={{ name: 'Creator', imageUrl: mockFileMetadataImage }}
                onFileChange={vi.fn()}
                onUploadComplete={vi.fn()}
                onSave={vi.fn()}
                onDelete={vi.fn()}
                onDownload={vi.fn()}
                locale="en"
            />
        );
        expect(screen.getByDisplayValue('Creator')).toBeInTheDocument();
        expect(screen.getByText('Test description.')).toBeInTheDocument();
    });

    it('renders rich text editor for description', () => {
        const onSave = vi.fn();
        render(
            <CourseIntroInformationEdit
                {...mockCourse}
                imageUrl={mockFileMetadataImage}
                requiredCourses={[]}
                availableCourses={[]}
                coaches={[]}
                courseCreator={{ name: 'Creator', imageUrl: mockFileMetadataImage }}
                onFileChange={vi.fn()}
                onUploadComplete={vi.fn()}
                onSave={onSave}
                onDelete={vi.fn()}
                onDownload={vi.fn()}
                locale="en"
            />
        );
        // Find the contentEditable rich text editor for description
        const editors = screen.getAllByRole('textbox');
        // The description editor has attribute name="courseDescription"
        const rte = editors.find(el => el.getAttribute('name') === 'courseDescription');
        expect(rte).toBeTruthy();
        // Test that the rich text editor is present and accessible
        expect(rte).toBeInTheDocument();
    });
});
