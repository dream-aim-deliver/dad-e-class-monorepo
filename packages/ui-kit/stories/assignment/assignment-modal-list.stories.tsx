import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssignmentModalList } from '../../lib/components/assignment/assignment-modal-list';
import { AssignmentModalProps } from '../../lib/components/assignment/assignment-modal';
import { assignment, fileMetadata, shared } from '@maany_shr/e-class-models';

// Mock Data Generators
const mockCourse = {
    id: 1,
    title: 'Storybook Champions  Champions Champions Champions Champions Champions Champions ',
    imageUrl: 'https://picsum.photos/40/40',
};

const mockStudent = {
    id: '1',
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    isCurrentUser: false,
    role: 'student' as const,
};

const mockCoach = {
    id: '2',
    name: 'Coach Jane',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    isCurrentUser: true,
    role: 'coach' as const,
};

const generateFile = () => ({
    id: Math.random().toString(),
    name: 'Slide.pdf',
    mimeType: 'application/pdf',
    size: 102400,
    checksum: 'xyz123',
    status: 'available' as const,
    category: 'generic' as const,
    url: 'https://example.com/slide.pdf',
});

const generateLink = () => ({
    linkId: Math.floor(Math.random() * 1_000_000),
    title: 'Example Link',
    url: 'https://example.com',
});

const meta: Meta<typeof AssignmentModalList> = {
    title: 'Components/Assignment/AssignmentModalList',
    component: AssignmentModalList,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'radio',
            options: ['en', 'de'],
            defaultValue: 'en',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample assignment modal data
const sampleAssignmentModals: AssignmentModalProps[] = [
    // AwaitingReview, no reply (coach)
    {
        role: 'coach',
        assignmentId: 1,
        title: 'Algebra Homework',
        description: 'Solve all the equations in section B.',
        files: [generateFile()],
        links: [generateLink()],
        course: mockCourse,
        module: 2,
        lesson: 4,
        status: 'AwaitingReview',
        student: mockStudent,
        groupName: 'Team Rockets',
        linkEditIndex: -1,
        onFileDownload: (id: string) => alert(`Download file: ${id}`),
        onFileDelete: (assignmentId: number, fileId: string) =>
            alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
        onLinkDelete: (assignmentId: number, linkId: number) =>
            alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
        onChange: (files, links, linkEditIndex) =>
            alert(`Files changed: ${files.length}, Links: ${links.length}`),
        onImageChange: () => alert('Image changed'),
        onClickCourse: () => alert('Course clicked: Course Title'),
        onClickUser: () => alert('User clicked: Full Name'),
        onClickGroup: () => alert('Group clicked: Group Name'),
        onDeleteIcon: () => alert('Delete icon clicked'),
        onClose: () => alert('Modal closed'),
        locale: 'en',
        children: (
            <div className="p-4 bg-base-neutral-800 rounded-medium">
                <p className="text-text-primary">
                    Assignment content with messages and reply panel would go
                    here...
                </p>
            </div>
        ),
    },
    // AwaitingForLongTime, with reply (coach)
    {
        role: 'coach',
        assignmentId: 2,
        title: 'Photography Essay',
        description:
            'Write a comprehensive essay about portrait photography techniques.',
        files: [
            {
                id: '2',
                name: 'Instructions.pdf',
                mimeType: 'application/pdf',
                size: 204800,
                checksum: 'abc456',
                status: 'available',
                category: 'document',
                url: 'https://example.com/instructions.pdf',
            },
            {
                id: '3',
                name: 'Sample_Image.jpg',
                mimeType: 'image/jpeg',
                size: 512000,
                checksum: 'def789',
                status: 'available',
                category: 'image',
                url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                thumbnailUrl:
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80',
            },
        ],
        links: [],
        course: {
            title: 'Photography Masterclass',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 3,
        lesson: 7,
        status: 'AwaitingForLongTime',
        student: {
            id: 'student2',
            name: 'Jane Smith',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            isCurrentUser: false,
            role: 'student',
        },
        groupName: undefined,
        linkEditIndex: -1,
        onFileDownload: (id: string) => alert(`Download file: ${id}`),
        onFileDelete: (assignmentId: number, fileId: string) =>
            alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
        onLinkDelete: (assignmentId: number, linkId: number) =>
            alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
        onChange: (files, links, linkEditIndex) =>
            alert(`Files changed: ${files.length}, Links: ${links.length}`),
        onImageChange: () => alert('Image changed'),
        onClickCourse: () => alert('Course clicked: Photography Masterclass'),
        onClickUser: () => alert('User clicked: Jane Smith'),
        onClickGroup: () => alert('Group clicked'),
        onDeleteIcon: () => alert('Delete icon clicked'),
        onClose: () => alert('Modal closed'),
        locale: 'en',
        children: (
            <div className="flex flex-col gap-4">
                <div className="p-4 bg-base-neutral-800 rounded-medium">
                    <p className="text-text-primary mb-2">
                        Student submission:
                    </p>
                    <p className="text-text-secondary text-sm">
                        Here is my essay on portrait photography...
                    </p>
                </div>
                <div className="p-4 bg-base-neutral-700 rounded-medium">
                    <p className="text-text-primary">
                        Reply panel would be here for coaches to provide
                        feedback...
                    </p>
                </div>
            </div>
        ),
    },
    // Passed, with reply (student view)
    {
        role: 'student',
        assignmentId: 3,
        title: 'Portrait Composition Exercise',
        description:
            'Practice composition techniques using the rule of thirds and leading lines.',
        files: [],
        links: [
            {
                linkId: 1001,
                title: 'Photography Tutorial',
                url: 'https://example.com/tutorial',
            },
        ],
        course: {
            title: 'Portrait Photography Course',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 1,
        lesson: 3,
        status: 'Passed',
        student: mockStudent,
        groupName: 'Advanced Photography Group',
        linkEditIndex: -1,
        onFileDownload: (id: string) => alert(`Download file: ${id}`),
        onFileDelete: (assignmentId: number, fileId: string) =>
            alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
        onLinkDelete: (assignmentId: number, linkId: number) =>
            alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
        onChange: (files, links, linkEditIndex) =>
            alert(`Files changed: ${files.length}, Links: ${links.length}`),
        onImageChange: () => alert('Image changed'),
        onClickCourse: () =>
            alert('Course clicked: Portrait Photography Course'),
        onClickUser: () => alert('User clicked: John Doe'),
        onClickGroup: () => alert('Group clicked: Advanced Photography Group'),
        onDeleteIcon: () => alert('Delete icon clicked'),
        onClose: () => alert('Modal closed'),
        locale: 'en',
        children: (
            <div className="flex flex-col gap-4">
                <div className="p-4 bg-green-900/20 border border-green-700 rounded-medium">
                    <p className="text-green-400 font-semibold mb-2">
                        ✓ Assignment Passed
                    </p>
                    <p className="text-text-secondary text-sm">
                        Great work on the composition! Your use of leading lines
                        is excellent.
                    </p>
                </div>
                <div className="p-4 bg-base-neutral-800 rounded-medium">
                    <p className="text-text-primary">
                        Conversation history and feedback would appear here...
                    </p>
                </div>
            </div>
        ),
    },
    // Additional assignment for better sorting examples
    {
        role: 'coach',
        assignmentId: 4,
        title: 'Basic Camera Settings',
        description: 'Learn about aperture, shutter speed, and ISO settings.',
        files: [],
        links: [],
        course: {
            title: 'Photography Basics',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 1,
        lesson: 1,
        status: 'AwaitingReview',
        student: {
            id: 'student3',
            name: 'Alice Johnson',
            image: 'https://randomuser.me/api/portraits/women/3.jpg',
            isCurrentUser: false,
            role: 'student',
        },
        groupName: 'Beginner Group',
        linkEditIndex: -1,
        onFileDownload: (id: string) => alert(`Download file: ${id}`),
        onFileDelete: (assignmentId: number, fileId: string) =>
            alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
        onLinkDelete: (assignmentId: number, linkId: number) =>
            alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
        onChange: (files, links, linkEditIndex) =>
            alert(`Files changed: ${files.length}, Links: ${links.length}`),
        onImageChange: () => alert('Image changed'),
        onClickCourse: () => alert('Course clicked: Photography Basics'),
        onClickUser: () => alert('User clicked: Alice Johnson'),
        onClickGroup: () => alert('Group clicked: Beginner Group'),
        onDeleteIcon: () => alert('Delete icon clicked'),
        onClose: () => alert('Modal closed'),
        locale: 'en',
        children: (
            <div className="p-4 bg-base-neutral-800 rounded-medium">
                <p className="text-text-primary">
                    This assignment is waiting for student submission...
                </p>
            </div>
        ),
    },
    // Another assignment with different module/lesson
    {
        role: 'coach',
        assignmentId: 5,
        title: 'Advanced Lighting Techniques',
        description:
            'Master studio lighting setups for professional portraits.',
        files: [generateFile()],
        links: [generateLink()],
        course: {
            title: 'Professional Photography',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 4,
        lesson: 2,
        status: 'Passed',
        student: {
            id: 'student4',
            name: 'Bob Wilson',
            image: 'https://randomuser.me/api/portraits/men/4.jpg',
            isCurrentUser: false,
            role: 'student',
        },
        groupName: undefined,
        linkEditIndex: -1,
        onFileDownload: (id: string) => alert(`Download file: ${id}`),
        onFileDelete: (assignmentId: number, fileId: string) =>
            alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
        onLinkDelete: (assignmentId: number, linkId: number) =>
            alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
        onChange: (files, links, linkEditIndex) =>
            alert(`Files changed: ${files.length}, Links: ${links.length}`),
        onImageChange: () => alert('Image changed'),
        onClickCourse: () => alert('Course clicked: Professional Photography'),
        onClickUser: () => alert('User clicked: Bob Wilson'),
        onClickGroup: () => alert('Group clicked'),
        onDeleteIcon: () => alert('Delete icon clicked'),
        onClose: () => alert('Modal closed'),
        locale: 'en',
        children: (
            <div className="flex flex-col gap-4">
                <div className="p-4 bg-green-900/20 border border-green-700 rounded-medium">
                    <p className="text-green-400 font-semibold mb-2">
                        ✓ Assignment Completed
                    </p>
                    <p className="text-text-secondary text-sm">
                        Excellent work on the lighting setup! Your studio
                        portraits show great mastery of professional techniques.
                    </p>
                </div>
            </div>
        ),
    },
];

export const Default: Story = {
    args: {
        assignments: sampleAssignmentModals,
        locale: 'en',
        onFileDownload: (id: string) => alert(`Download file: ${id}`),
        onFileDelete: (assignmentId: number, fileId: string) =>
            alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
        onLinkDelete: (assignmentId: number, linkId: number) =>
            alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
        onChange: (files, links, linkEditIndex) =>
            alert(
                `Files changed: ${files.length}, Links: ${links.length}, Edit index: ${linkEditIndex}`,
            ),
        onImageChange: (image, abortSignal) =>
            alert(`Image change: ${image.name}`),
        onClickCourse: () => alert('Course clicked from modal list'),
        onClickUser: () => alert('User clicked from modal list'),
        onClickGroup: () => alert('Group clicked from modal list'),
        onClickView: () => alert('View clicked from modal list'),
        onDownloadAll: () => alert('Download all assignments clicked'),
        availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        availableCourses: [
            'Storybook Champions',
            'Photography Masterclass',
            'Portrait Photography Course',
            'Photography Basics',
            'Professional Photography',
        ],
        availableModules: ['Module 1', 'Module 2', 'Module 3', 'Module 4'],
        availableLessons: [
            'Lesson 1',
            'Lesson 2',
            'Lesson 3',
            'Lesson 4',
            'Lesson 5',
            'Lesson 6',
            'Lesson 7',
        ],
    },
};

export const EmptyState: Story = {
    args: {
        assignments: [],
        locale: 'en',
        onFileDownload: (id: string) => alert(`Download file: ${id}`),
        onFileDelete: (assignmentId: number, fileId: string) =>
            alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
        onLinkDelete: (assignmentId: number, linkId: number) =>
            alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
        onChange: (files, links, linkEditIndex) =>
            alert(
                `Files changed: ${files.length}, Links: ${links.length}, Edit index: ${linkEditIndex}`,
            ),
        onImageChange: (image, abortSignal) =>
            alert(`Image change: ${image.name}`),
        onClickCourse: () => alert('Course clicked from modal list'),
        onClickUser: () => alert('User clicked from modal list'),
        onClickGroup: () => alert('Group clicked from modal list'),
        onClickView: () => alert('View clicked from modal list'),
        availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        availableCourses: [],
        availableModules: [],
        availableLessons: [],
    },
};

export const GermanLocale: Story = {
    args: {
        ...Default.args,
        locale: 'de',
        assignments: sampleAssignmentModals.map((assignment) => ({
            ...assignment,
            locale: 'de' as const,
        })),
    },
};

export const SingleAssignment: Story = {
    args: {
        assignments: [sampleAssignmentModals[0]],
        locale: 'en',
        onFileDownload: (id: string) => alert(`Download file: ${id}`),
        onFileDelete: (assignmentId: number, fileId: string) =>
            alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
        onLinkDelete: (assignmentId: number, linkId: number) =>
            alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
        onChange: (files, links, linkEditIndex) =>
            alert(
                `Files changed: ${files.length}, Links: ${links.length}, Edit index: ${linkEditIndex}`,
            ),
        onImageChange: (image, abortSignal) =>
            alert(`Image change: ${image.name}`),
        onClickCourse: () => alert('Course clicked from modal list'),
        onClickUser: () => alert('User clicked from modal list'),
        onClickGroup: () => alert('Group clicked from modal list'),
        onClickView: () => alert('View clicked from modal list'),
        availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        availableCourses: ['Storybook Champions'],
        availableModules: ['Module 2'],
        availableLessons: ['Lesson 4'],
    },
};
