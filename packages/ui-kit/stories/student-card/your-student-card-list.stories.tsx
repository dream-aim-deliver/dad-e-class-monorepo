import { Meta, StoryObj } from '@storybook/react-vite';
import { YourStudentCardList } from '../../lib/components/student-card/your-student-card-list';
import { YourStudentCard } from '../../lib/components/student-card/your-student-card';

const meta: Meta<typeof YourStudentCardList> = {
    title: 'Components/StudentCard/YourStudentCardList',
    component: YourStudentCardList,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        children: {
            control: false,
            description: 'List of YourStudentCard components to render.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof YourStudentCardList>;

const courseImg =
    'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png';
const studentImg =
    'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600';

export const MixedCards: Story = {
    args: {
        locale: 'en',
        children: [
            <YourStudentCard
                key="1"
                locale="en"
                studentName="John Doe"
                studentImageUrl={studentImg}
                coachingSessionsLeft={3}
                onStudentDetails={() => alert('Clicked student details')}
                courses={[
                    {
                        courseName: 'Photography 101',
                        courseImageUrl: courseImg,
                        assignmentTitle: 'Create a photo composition',
                        status: 'long-wait',
                        onClickCourse: () => alert('Clicked Photography 101'),
                        onViewAssignment: () =>
                            alert('View assignment: Photography'),
                    },
                    {
                        courseName: 'Art History',
                        courseImageUrl: courseImg,
                        status: 'course-completed',
                        completedCourseDate: new Date('2024-09-20'),
                        onClickCourse: () => alert('Clicked Art History'),
                    },
                ]}
            />,
            <YourStudentCard
                key="2"
                locale="en"
                studentName="Jane Smith"
                studentImageUrl={studentImg}
                coachingSessionsLeft={1}
                onStudentDetails={() => alert('Clicked student details')}
                courses={[
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
                        onClickCourse: () =>
                            alert('Clicked Science Fundamentals'),
                    },
                ]}
            />,
            <YourStudentCard
                key="3"
                locale="en"
                studentName="Emily Davis"
                studentImageUrl={studentImg}
                coachingSessionsLeft={2}
                onStudentDetails={() => alert('Clicked student details')}
                courses={[
                    {
                        courseName: 'Digital Illustration',
                        courseImageUrl: courseImg,
                        assignmentTitle: 'Draw a comic character',
                        status: 'waiting-feedback',
                        onClickCourse: () => alert('Clicked Illustration'),
                        onViewAssignment: () =>
                            alert('View Illustration assignment'),
                    },
                ]}
            />,
            <YourStudentCard
                key="4"
                locale="en"
                studentName="Michael Brown"
                studentImageUrl={studentImg}
                coachingSessionsLeft={0}
                onStudentDetails={() => alert('Clicked student details')}
                courses={[
                    {
                        courseName: 'Creative Writing',
                        courseImageUrl: courseImg,
                        assignmentTitle: 'Write a short story',
                        status: 'waiting-feedback',
                        onClickCourse: () => alert('Clicked Creative Writing'),
                        onViewAssignment: () =>
                            alert('View Writing assignment'),
                    },
                    {
                        courseName: 'History of Art',
                        courseImageUrl: courseImg,
                        status: 'course-completed',
                        completedCourseDate: new Date('2024-06-01'),
                        onClickCourse: () => alert('Clicked History of Art'),
                    },
                ]}
            />,
            <YourStudentCard
                key="5"
                locale="en"
                studentName="Alice Johnson"
                studentImageUrl={studentImg}
                coachingSessionsLeft={5}
                onStudentDetails={() => alert('Clicked student details')}
                courses={[
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
                        onClickCourse: () =>
                            alert('Clicked Data Visualization'),
                    },
                    {
                        courseName: 'JavaScript Essentials',
                        courseImageUrl: courseImg,
                        status: 'no-assignment',
                        onClickCourse: () =>
                            alert('Clicked JavaScript Essentials'),
                    },
                ]}
            />,
            <YourStudentCard
                key="6"
                locale="en"
                studentName="Bob Lee"
                studentImageUrl={studentImg}
                coachingSessionsLeft={0}
                onStudentDetails={() => alert('Clicked student details')}
                courses={[
                    {
                        courseName: 'Advanced CSS',
                        courseImageUrl: courseImg,
                        assignmentTitle: 'Create a responsive layout',
                        status: 'waiting-feedback',
                        onClickCourse: () => alert('Clicked Advanced CSS'),
                        onViewAssignment: () => alert('View CSS assignment'),
                    },
                    {
                        courseName: 'React Basics',
                        courseImageUrl: courseImg,
                        assignmentTitle: 'Build a todo app',
                        status: 'long-wait',
                        onClickCourse: () => alert('Clicked React Basics'),
                        onViewAssignment: () =>
                            alert('View React Basics assignment'),
                    },
                ]}
            />,
        ],
    },
};

export const Empty: Story = {
    args: {
        locale: 'en',
        children: [],
    },
};
