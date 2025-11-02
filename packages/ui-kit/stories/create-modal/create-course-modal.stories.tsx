import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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

const mockCourses = [
    {
        id: 1,
        slug: 'introduction-to-programming',
        title: 'Introduction to Programming',
        author: {
            name: 'John',
            surname: 'Doe',
            isYou: true,
            avatarUrl: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
    {
        id: 2,
        slug: 'advanced-react-techniques',
        title: 'Advanced React Techniques',
        author: {
            name: 'Jane',
            surname: 'Smith',
            isYou: false,
            avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
    {
        id: 3,
        slug: 'data-science-with-python',
        title: 'Data Science with Python',
        author: {
            name: 'Alex',
            surname: 'Johnson',
            isYou: false,
            avatarUrl: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=766&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
    {
        id: 4,
        slug: 'machine-learning-basics',
        title: 'Machine Learning Basics',
        author: {
            name: 'Emily',
            surname: 'Brown',
            isYou: false,
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
    {
        id: 5,
        slug: 'web-development-fundamentals',
        title: 'Web Development Fundamentals',
        author: {
            name: 'Michael',
            surname: 'Wilson',
            isYou: false,
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
];

export const Default: StoryObj<typeof CreateCourseModal> = {
    args: {
        locale: 'en',
        isLoading: false,
        onCreateNew: () => console.log('Create New Course'),
        onDuplicate: (course) => console.log('Duplicate Course', course),
        onQueryChange: (query) => console.log('Search Query Changed:', query),
        onClose: () => console.log('Modal Closed'),
        courses: mockCourses,
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
        courses: mockCourses,
    },
};

export const WithError: StoryObj<typeof CreateCourseModal> = {
    args: {
        locale: 'en',
        isLoading: false,
        hasSearchError: true,
        onCreateNew: () => console.log('Create New Course'),
        onDuplicate: (course) => console.log('Duplicate Course', course),
        onQueryChange: (query) => console.log('Search Query Changed:', query),
        onClose: () => console.log('Modal Closed'),
        courses: [],
    },
};

// Interactive story with working search functionality
export const InteractiveSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Filter courses based on current search query
    const filteredCourses = searchQuery
        ? mockCourses.filter((course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : mockCourses; // Show all courses when search is empty

    const handleQueryChange = (query: string) => {
        console.log('Storybook - Query changed to:', query);
        setSearchQuery(query);

        // Simulate API loading delay
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const filtered = query
                ? mockCourses.filter((course) =>
                    course.title.toLowerCase().includes(query.toLowerCase()) ||
                    course.slug.toLowerCase().includes(query.toLowerCase())
                )
                : mockCourses;
            console.log('Storybook - After filter, found courses:', filtered.length, filtered);
        }, 300);
    };

    console.log('Storybook - Render:', {
        searchQuery,
        isLoading,
        totalCourses: mockCourses.length,
        filteredCount: filteredCourses.length,
        filteredCourses
    });

    return (
        <CreateCourseModal
            locale="en"
            courses={filteredCourses}
            isLoading={isLoading}
            hasSearchError={false}
            onClose={() => console.log('Modal closed')}
            onCreateNew={() => console.log('Create new course')}
            onDuplicate={(course) => console.log('Duplicate course:', course)}
            onQueryChange={handleQueryChange}
        />
    );
};

export const InDialog: StoryObj<typeof CreateCourseModal> = {
    args: {
        locale: 'en',
        isLoading: false,
        courses: mockCourses,
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

