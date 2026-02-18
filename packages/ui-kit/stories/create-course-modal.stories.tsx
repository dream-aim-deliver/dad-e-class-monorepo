import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import CreateCourseModal from '../lib/components/create-modal/create-course-modal';

export default {
    title: 'Components/CreateCourseModal',
    component: CreateCourseModal,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        isLoading: {
            control: 'boolean',
            description: 'Whether the course search is loading',
        },
        hasSearchError: {
            control: 'boolean',
            description: 'Whether there was an error searching for courses',
        },
        onClose: {
            action: 'closed',
            description: 'Function to call when the modal is closed',
        },
        onCreateNew: {
            action: 'createNew',
            description: 'Function to call when creating a new course',
        },
        onDuplicate: {
            action: 'duplicate',
            description: 'Function to call when duplicating a course',
        },
        onQueryChange: {
            action: 'queryChange',
            description: 'Function to call when the search query changes',
        },
    },
} satisfies Meta<typeof CreateCourseModal>;

type Story = StoryObj<typeof CreateCourseModal>;

const mockCourses = [
    {
        id: 1,
        slug: 'react-basics',
        title: 'React Basics',
        author: {
            name: 'John',
            surname: 'Doe',
            isYou: true,
        },
    },
    {
        id: 2,
        slug: 'advanced-typescript',
        title: 'Advanced TypeScript',
        author: {
            name: 'Jane',
            surname: 'Smith',
            isYou: false,
        },
    },
    {
        id: 3,
        slug: 'basics-of-css',
        title: 'Basics of CSS',
        author: {
            name: 'Alice',
            surname: 'Johnson',
            isYou: false,
        },
    },
    {
        id: 4,
        slug: 'intro-to-web-dev',
        title: 'Introduction to Web Development',
        author: {
            name: 'Bob',
            surname: 'Brown',
            isYou: false,
        },
    },
];

export const Default: Story = {
    args: {
        locale: 'en',
        courses: mockCourses,
        isLoading: false,
        hasSearchError: false,
        onClose: () => console.log('Modal closed'),
        onCreateNew: () => console.log('Create new course'),
        onDuplicate: (course) => console.log('Duplicate course:', course),
        onQueryChange: (query) => console.log('Search query:', query),
    },
};

export const Loading: Story = {
    args: {
        locale: 'en',
        courses: [],
        isLoading: true,
        hasSearchError: false,
        onClose: () => console.log('Modal closed'),
        onCreateNew: () => console.log('Create new course'),
        onDuplicate: (course) => console.log('Duplicate course:', course),
        onQueryChange: (query) => console.log('Search query:', query),
    },
};

export const EmptyResults: Story = {
    args: {
        locale: 'en',
        courses: [],
        isLoading: false,
        hasSearchError: false,
        onClose: () => console.log('Modal closed'),
        onCreateNew: () => console.log('Create new course'),
        onDuplicate: (course) => console.log('Duplicate course:', course),
        onQueryChange: (query) => console.log('Search query:', query),
    },
};

export const WithError: Story = {
    args: {
        locale: 'en',
        courses: [],
        isLoading: false,
        hasSearchError: true,
        onClose: () => console.log('Modal closed'),
        onCreateNew: () => console.log('Create new course'),
        onDuplicate: (course) => console.log('Duplicate course:', course),
        onQueryChange: (query) => console.log('Search query:', query),
    },
};

// Interactive story with working search
const InteractiveSearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    console.log('=== RENDER ===');
    console.log('searchQuery:', searchQuery);
    console.log('mockCourses:', mockCourses);

    // Filter courses - this recalculates every time searchQuery changes
    const filteredCourses = searchQuery
        ? mockCourses.filter((course) => {
            const matchesTitle = course.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSlug = course.slug.toLowerCase().includes(searchQuery.toLowerCase());
            console.log(`Course "${course.title}": title match=${matchesTitle}, slug match=${matchesSlug}`);
            return matchesTitle || matchesSlug;
        })
        : mockCourses;

    console.log('filteredCourses:', filteredCourses);
    console.log('filteredCourses.length:', filteredCourses.length);

    const handleQueryChange = (query: string) => {
        console.log('=== QUERY CHANGE ===');
        console.log('New query:', query);
        setSearchQuery(query);
        // Simulate API loading
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };

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

export const InteractiveSearch: Story = {
    render: () => <InteractiveSearchComponent />,
};
