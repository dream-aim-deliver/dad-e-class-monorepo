import { Meta, StoryObj } from '@storybook/react';
import { CreateCourseModal } from '../lib/components/create-course-modal';

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
        onClose: {
            action: 'closed',
            description: 'Function to call when the modal is closed',
        },
        onCreateNewCourseDraft: {
            action: 'createNewCourseDraft',
            description: 'Function to call when creating a new course draft',
        },
        onDuplicateCourse: {
            action: 'duplicateCourse',
            description: 'Function to call when duplicating a course',
        },
    },
} satisfies Meta<typeof CreateCourseModal>;

type Story = StoryObj<typeof CreateCourseModal>;

export const Default: Story = {
    args: {
        onClose: () => alert('Modal closed'),
        onCreateNewCourseDraft: () => alert('Create new course draft'),
        onDuplicateCourse: (courseId) =>
            alert(`Duplicate course with ID: ${courseId}`),
        locale: 'en',
        courses: [
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
                title: 'Node.js for Beginners',
                ownerName: 'Alice Johnson',
                ownerAvatarUrl:
                    'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
                isYou: false,
                totalRating: 8,
                rating: 4.8,
                id: 'course-3',
            },
            {
                title: 'Full Stack Development',
                ownerName: 'Jane Smith',
                ownerAvatarUrl:
                    'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
                isYou: true,
                totalRating: 10,
                rating: 4.2,
                id: 'course-4',
            },
        ],
    },
};
