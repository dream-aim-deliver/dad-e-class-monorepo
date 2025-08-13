import { Meta, StoryObj } from '@storybook/react';
import CreateCourseModal from '../../lib/components/create-modal/create-course-modal';
import { Dialog, DialogContent, DialogTrigger } from '../../lib/components/dialog';

const meta: Meta = {
    title: 'Components/CreateCourseModal',
    component: CreateCourseModal,
    tags: ['docs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;

export const Default: StoryObj<typeof CreateCourseModal> = {
    args: {
        locale: 'en',
        isLoading: false,
        onCreateNew: () => console.log('Create New Course'),
        onDuplicate: (course) => console.log('Duplicate Course', course),
        onQueryChange: (query) => console.log('Search Query Changed:', query),
        onClose: () => console.log('Modal Closed'),
    },
};

export const Loading: StoryObj<typeof CreateCourseModal> = {
    args: {
        locale: 'en',
        isLoading: true,
        onCreateNew: () => console.log('Create New Course'),
        onDuplicate: (course) => console.log('Duplicate Course', course),
        onQueryChange: (query) => console.log('Search Query Changed:', query),
        onClose: () => console.log('Modal Closed'),
        courses: [],
    },
};

export const NoCourses: StoryObj<typeof CreateCourseModal> = {
    args: {
        locale: 'en',
        isLoading: false,
        onCreateNew: () => console.log('Create New Course'),
        onDuplicate: (course) => console.log('Duplicate Course', course),
        onQueryChange: (query) => console.log('Search Query Changed:', query),
        onClose: () => console.log('Modal Closed'),
        courses: [],
    },
};

export const WithCourses: StoryObj<typeof CreateCourseModal> = {
    args: {
        locale: 'en',
        isLoading: false,
        onCreateNew: () => console.log('Create New Course'),
        onDuplicate: (course) => console.log('Duplicate Course', course),
        onQueryChange: (query) => console.log('Search Query Changed:', query),
        onClose: () => console.log('Modal Closed'),
        courses: [
            {
                id: 1,
                slug: 'introduction-to-programming',
                title: 'Introduction to Programming',
                averageRating: 4.5,
                reviewCount: 10,
                author: {
                    username: 'johndoe',
                    name: 'John',
                    surname: 'Doe',
                    isYou: true,
                    avatarUrl:
                        'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
            },
            {
                id: 2,
                slug: 'advanced-react-techniques',
                title: 'Advanced React Techniques',
                averageRating: 4.8,
                reviewCount: 5,
                author: {
                    username: 'janedoe',
                    name: 'Jane',
                    surname: 'Doe',
                    isYou: false,
                    avatarUrl:
                        'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
            },
            {
                id: 3,
                slug: 'data-science-with-python',
                title: 'Data Science with Python',
                averageRating: 4.2,
                reviewCount: 8,
                author: {
                    username: 'alexsmith',
                    name: 'Alex',
                    surname: 'Smith',
                    isYou: false,
                    avatarUrl:
                        'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=766&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
            },
            {
                id: 4,
                slug: 'machine-learning-basics',
                title: 'Machine Learning Basics',
                averageRating: 4.6,
                reviewCount: 12,
                author: {
                    username: 'emilyjohnson',
                    name: 'Emily',
                    surname: 'Johnson',
                    isYou: false,
                    avatarUrl:
                        'https://images.unsplash.com/photo-1587614382400-2c5f5c5c5c5c?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
            },
        ],
    },
};

export const InDialog: StoryObj<typeof CreateCourseModal> = {
    args: {
        locale: 'en',
        isLoading: false,
        onCreateNew: () => console.log('Create New Course'),
        onDuplicate: (course) => console.log('Duplicate Course', course),
        onQueryChange: (query) => console.log('Search Query Changed:', query),
        onClose: () => console.log('Modal Closed'),
    },
    render: (args) => (
        <Dialog open={undefined} onOpenChange={() => {
            console.log('Dialog Opened/Closed');
        }} defaultOpen={false}>
            <DialogTrigger asChild><span>Open a course</span></DialogTrigger>
            <DialogContent showCloseButton={true} closeOnOverlayClick closeOnEscape>
                <div className="p-6">
                    <CreateCourseModal {...args} />
                </div>
            </DialogContent>
        </Dialog>
    ),
};

