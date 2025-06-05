import { Meta, StoryObj } from '@storybook/react';
import { CreateContentModal } from '../lib/components/create-content-modal';

export default {
    title: 'Components/CreateContentModal',
    component: CreateContentModal,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: 'radio',
            options: ['course', 'lesson'],
        },
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        onClose: {
            action: 'closed',
            description: 'Function to call when the modal is closed',
        },
        onCreateNewContentDraft: {
            action: 'createNewCourseDraft',
            description: 'Function to call when creating a new draft',
        },
        onDuplicateContent: {
            action: 'duplicateCourse',
            description: 'Function to call when duplicating a course or lesson',
        },
    },
} satisfies Meta<typeof CreateContentModal>;

type Story = StoryObj<typeof CreateContentModal>;

const mockCourses = [
    {
        title: 'React Basics',
        ownerName: 'John Doe',
        ownerAvatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        isYou: false,
        totalRating: 12,
        rating: 4.5,
        id: 'course-1',
    },
    {
        title: 'Advanced TypeScript',
        ownerName: 'Jane Smith',
        ownerAvatarUrl:
            'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
        isYou: true,
        totalRating: 8,
        rating: 4.8,
        id: 'course-2',
    },
    {
        title: 'Basics of CSS',
        ownerName: 'Alice Johnson',
        ownerAvatarUrl:
            'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
        isYou: false,
        totalRating: 8,
        rating: 4.8,
        id: 'course-3',
    },
    {
        title: 'Introduction to Web Development',
        ownerName: 'Bob Brown',
        ownerAvatarUrl:
            'https://www.elperiodista.cl/wp-content/uploads/2021/03/Minipig.jpeg',
        isYou: false,
        totalRating: 5,
        rating: 4.2,
        id: 'course-4',
    },
];

const mockLessons = [
    {
        title: 'Intro to JSX',
        ownerName: 'Jane Smith',
        ownerAvatarUrl:
            'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
        isYou: true,
        totalRating: 6,
        rating: 4.6,
        id: 'lesson-1',
    },
    {
        title: 'Understanding React Hooks',
        ownerName: 'Alice Johnson',
        ownerAvatarUrl:
            'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
        isYou: false,
        totalRating: 10,
        rating: 4.9,
        id: 'lesson-2',
    },
    {
        title: 'CSS Flexbox Fundamentals',
        ownerName: 'Bob Brown',
        ownerAvatarUrl:
            'https://www.elperiodista.cl/wp-content/uploads/2021/03/Minipig.jpeg',
        isYou: false,
        totalRating: 7,
        rating: 4.3,
        id: 'lesson-3',
    },
    {
        title: 'JavaScript ES6 Features',
        ownerName: 'John Doe',
        ownerAvatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        isYou: false,
        totalRating: 9,
        rating: 4.7,
        id: 'lesson-4',
    },
];

export const CourseVariant: Story = {
    args: {
        variant: 'course',
        locale: 'en',
        onClose: () => alert('Modal closed'),
        onCreateNewContentDraft: () => alert('Create new course draft'),
        onDuplicateContent: (id) => alert(`Duplicate course with ID: ${id}`),
        content: mockCourses,
    },
};

export const LessonVariant: Story = {
    args: {
        variant: 'lesson',
        locale: 'en',
        onClose: () => alert('Modal closed'),
        onCreateNewContentDraft: () => alert('Create new lesson draft'),
        onDuplicateContent: (id) => alert(`Duplicate lesson with ID: ${id}`),
        content: mockLessons,
    },
};
