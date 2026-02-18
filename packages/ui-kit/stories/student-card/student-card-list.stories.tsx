import { Meta, StoryObj } from '@storybook/react-vite';
import { StudentCardList } from '../../lib/components/student-card/student-card-list';
import {
    StudentCard,
    StudentCardProps,
} from '../../lib/components/student-card/student-card';

const meta: Meta<typeof StudentCardList> = {
    title: 'Components/StudentCard/StudentCardList',
    component: StudentCardList,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        children: {
            control: false,
            description: 'List of student cards to display.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof StudentCardList>;

const baseProps: Omit<StudentCardProps, 'status'> = {
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
    onStudentDetails: () => alert('Student details clicked'),
    onClickCourse: () => alert('Course clicked'),
    onClickCoach: () => alert('Coach clicked'),
};

const createStudentCard = (props: StudentCardProps, key: string | number) => (
    <StudentCard key={key} {...props} />
);

export const DiferentStates: Story = {
    args: {
        locale: 'en',
        children: [
            createStudentCard(
                {
                    ...baseProps,
                    status: 'no-assignment',
                    studentName: 'Charlie Brown',
                    isYou: true,
                },
                '1',
            ),
            createStudentCard(
                {
                    ...baseProps,
                    status: 'waiting-feedback',
                    studentName: 'Dora Schulz',
                    assignmentTitle: 'Create a user journey map',
                    onViewAssignment: () => alert('View assignment clicked'),
                },
                '2',
            ),
            createStudentCard(
                {
                    ...baseProps,
                    status: 'long-wait',
                    studentName: 'Nina Weber',
                    assignmentTitle: 'Design a landing page',
                    onViewAssignment: () => alert('View assignment clicked'),
                },
                '3',
            ),
            createStudentCard(
                {
                    ...baseProps,
                    status: 'course-completed',
                    studentName: 'Max Müller',
                    completedCourseDate: new Date('2025-03-20'),
                },
                '4',
            ),
            createStudentCard(
                {
                    ...baseProps,
                    status: 'waiting-feedback',
                    studentName: 'Liam Johnson',
                    assignmentTitle: 'Wireframe for homepage',
                    onViewAssignment: () => alert('View assignment clicked'),
                },
                '5',
            ),
            createStudentCard(
                {
                    ...baseProps,
                    status: 'no-assignment',
                    studentName: 'Sofia Lee',
                    isYou: true,
                    coachingSessionsLeft: 3,
                },
                '6',
            ),
        ],
    },
};

export const Empty: Story = {
    args: {
        locale: 'en',
        children: [],
    },
};
