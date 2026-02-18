import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    StudentCard,
    StudentCardProps,
} from '../../lib/components/student-card/student-card';

const meta: Meta<typeof StudentCard> = {
    title: 'Components/StudentCard/StudentCard',
    component: StudentCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        status: {
            control: 'select',
            options: [
                'no-assignment',
                'long-wait',
                'waiting-feedback',
                'course-completed',
            ],
        },
        coachingSessionsLeft: {
            control: { type: 'number', min: 0 },
        },
        completedCourseDate: {
            control: 'date',
        },
        onStudentDetails: { action: 'onStudentDetails' },
        onViewAssignment: { action: 'onViewAssignment' },
        studentName: {
            control: 'text',
            description: 'Name of the student',
        },
        studentImageUrl: {
            control: 'text',
            description: 'Image URL of the student',
        },
        coachName: {
            control: 'text',
            description: 'Name of the coach',
        },
        coachImageUrl: {
            control: 'text',
            description: 'Image URL of the coach',
        },
        courseName: {
            control: 'text',
            description: 'Name of the course',
        },
        courseImageUrl: {
            control: 'text',
            description: 'Image URL of the course',
        },
        assignmentTitle: {
            control: 'text',
            description:
                'Title of the assignment (only for waiting-feedback and long-wait)',
        },
        isYou: {
            control: 'boolean',
            description: 'Indicates if the student is the current user',
        },
    },
};

export default meta;
type Story = StoryObj<typeof StudentCard>;

const baseArgs: Omit<
    StudentCardProps,
    'status' | 'assignmentTitle' | 'completedCourseDate' | 'onViewAssignment'
> = {
    locale: 'en',
    studentName: 'Alice Smith',
    studentImageUrl:
        'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
    coachName: 'Bob Johnson',
    coachImageUrl:
        'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
    courseName: 'Branding Basics',
    courseImageUrl:
        'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
    isYou: false,
    onStudentDetails: () => {
        alert('Student details clicked');
    },
    onClickCourse: () => {
        alert('Course clicked');
    },
    onClickCoach: () => {
        alert('Coach clicked');
    },
};

export const Default: Story = {
    args: {
        ...baseArgs,
        status: 'no-assignment',
    },
};

export const WaitingFeedback: Story = {
    args: {
        ...baseArgs,
        status: 'waiting-feedback',
        assignmentTitle: 'Create a brand identity',
        onViewAssignment: () => {
            alert('View assignment clicked');
        },
    },
};

export const LongWait: Story = {
    args: {
        ...baseArgs,
        status: 'long-wait',
        assignmentTitle: 'Design a logo',
        onViewAssignment: () => {
            alert('View assignment clicked');
        },
    },
};

export const CourseCompleted: Story = {
    args: {
        ...baseArgs,
        status: 'course-completed',
        completedCourseDate: new Date(),
    },
};

export const WithCoachingSessionsLeft: Story = {
    args: {
        ...baseArgs,
        status: 'no-assignment',
        coachingSessionsLeft: 6,
    },
};

export const IsYou: Story = {
    args: {
        ...baseArgs,
        status: 'no-assignment',
        isYou: true,
    },
};
