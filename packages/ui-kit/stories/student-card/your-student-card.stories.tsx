import type { Meta, StoryObj } from '@storybook/react-vite';
import { YourStudentCard } from '../../lib/components/student-card/your-student-card';

const meta: Meta<typeof YourStudentCard> = {
    title: 'Components/StudentCard/YourStudentCard',
    component: YourStudentCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;

type Story = StoryObj<typeof YourStudentCard>;

const courseImg =
    'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png';
const studentImg =
    'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600';

export const Default: Story = {
    args: {
        locale: 'en',
        studentName: 'John Doe',
        studentImageUrl: studentImg,
        coachingSessionsLeft: 3,
        onStudentDetails: () => alert('Clicked student details'),
        courses: [
            {
                courseName: 'Photography 101',
                courseImageUrl: courseImg,
                assignmentTitle: 'Create a photo composition',
                status: 'long-wait',
                onClickCourse: () => alert('Clicked Photography 101'),
                onViewAssignment: () => alert('View assignment: Photography'),
            },
            {
                courseName: 'Creative Writing',
                courseImageUrl: courseImg,
                assignmentTitle: 'Write a short story',
                status: 'waiting-feedback',
                onClickCourse: () => alert('Clicked Creative Writing'),
                onViewAssignment: () => alert('View assignment: Writing'),
            },
            {
                courseName: 'Math Basics',
                courseImageUrl: courseImg,
                status: 'no-assignment',
                onClickCourse: () => alert('Clicked Math Basics'),
            },
            {
                courseName: 'Science Fundamentals',
                courseImageUrl: courseImg,
                status: 'no-assignment',
                onClickCourse: () => alert('Clicked Science Fundamentals'),
            },
            {
                courseName: 'Art History',
                courseImageUrl: courseImg,
                status: 'course-completed',
                completedCourseDate: new Date('2024-09-20'),
                onClickCourse: () => alert('Clicked Art History'),
            },
        ],
    },
};

export const ListOfCourses: Story = {
    args: {
        locale: 'en',
        studentName: 'Jane Smith',
        studentImageUrl: studentImg,
        coachingSessionsLeft: 1,
        onStudentDetails: () => alert('Clicked student details'),
        courses: [
            {
                courseName: 'Math Basics',
                courseImageUrl: courseImg,
                status: 'no-assignment',
                onClickCourse: () => alert('Clicked Math Basics'),
            },
            {
                courseName: 'Science Fundamentals',
                courseImageUrl: courseImg,
                status: 'no-assignment',
                onClickCourse: () => alert('Clicked Science Fundamentals'),
            },
            {
                courseName: 'Literature Intro',
                courseImageUrl: courseImg,
                status: 'no-assignment',
                onClickCourse: () => alert('Clicked Literature Intro'),
            },
        ],
    },
};

export const MixedBadges: Story = {
    args: {
        locale: 'en',
        studentName: 'Alex Johnson',
        studentImageUrl: studentImg,
        coachingSessionsLeft: 0,
        onStudentDetails: () => alert('Clicked student details'),
        courses: [
            {
                courseName: 'UX Design',
                courseImageUrl: courseImg,
                assignmentTitle: 'Redesign a mobile app',
                status: 'long-wait',
                onClickCourse: () => alert('Clicked UX Design'),
                onViewAssignment: () => alert('View UX Design assignment'),
            },
            {
                courseName: 'JavaScript Essentials',
                courseImageUrl: courseImg,
                status: 'no-assignment',
                onClickCourse: () => alert('Clicked JavaScript Essentials'),
            },
            {
                courseName: 'Public Speaking',
                courseImageUrl: courseImg,
                status: 'no-assignment',
                onClickCourse: () => alert('Clicked Public Speaking'),
            },
            {
                courseName: 'Data Visualization',
                courseImageUrl: courseImg,
                status: 'no-assignment',
                onClickCourse: () => alert('Clicked Data Visualization'),
            },
            {
                courseName: 'History of Art',
                courseImageUrl: courseImg,
                status: 'course-completed',
                completedCourseDate: new Date('2024-06-01'),
                onClickCourse: () => alert('Clicked History of Art'),
            },
        ],
    },
};

export const OnlyWaitingFeedback: Story = {
    args: {
        locale: 'en',
        studentName: 'Emily Davis',
        studentImageUrl: studentImg,
        coachingSessionsLeft: 2,
        onStudentDetails: () => alert('Clicked student details'),
        courses: [
            {
                courseName: 'Digital Illustration',
                courseImageUrl: courseImg,
                assignmentTitle: 'Draw a comic character',
                status: 'waiting-feedback',
                onClickCourse: () => alert('Clicked Illustration'),
                onViewAssignment: () => alert('View Illustration assignment'),
            },
        ],
    },
};

export const OnlyLongWait: Story = {
    args: {
        locale: 'en',
        studentName: 'Michael Brown',
        studentImageUrl: studentImg,
        coachingSessionsLeft: 0,
        onStudentDetails: () => alert('Clicked student details'),
        courses: [
            {
                courseName: 'Advanced Physics',
                courseImageUrl: courseImg,
                assignmentTitle: 'Quantum Mechanics Project',
                status: 'long-wait',
                onClickCourse: () => alert('Clicked Advanced Physics'),
                onViewAssignment: () => alert('View Physics assignment'),
            },
        ],
    },
};
