import { Meta, StoryObj } from '@storybook/react';
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

const studentCardBaseProps: StudentCardProps = {
    locale: 'en',
    status: 'default',
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
    assignmentTitle: 'Create a brand identity',
    onStudentDetails: () => alert('Student details clicked'),
    onClickCourse: () => alert('Course clicked'),
    onClickCoach: () => alert('Coach clicked'),
    onViewAssignment: () => alert('View assignment clicked'),
};

export const DiferentStates: Story = {
    args: {
        locale: 'en',
        children: [
            <StudentCard
                key="1"
                {...studentCardBaseProps}
                status="default"
                studentName="Charlie Brown"
                studentImageUrl="https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600"
                coachName="Lucy Van Pelt"
                coachImageUrl="https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png"
                courseName="Storytelling 101"
                courseImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                isYou={true}
            />,
            <StudentCard
                key="2"
                {...studentCardBaseProps}
                status="waiting-feedback"
                studentName="Dora Schulz"
                studentImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                coachName="Felix Baum"
                coachImageUrl="https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600"
                courseName="Design Thinking"
                courseImageUrl="https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png"
            />,
            <StudentCard
                key="3"
                {...studentCardBaseProps}
                status="long-wait"
                studentName="Nina Weber"
                studentImageUrl="https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png"
                coachName="Tom Berger"
                coachImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                courseName="UX Fundamentals"
                courseImageUrl="https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600"
            />,
            <StudentCard
                key="4"
                {...studentCardBaseProps}
                status="course-completed"
                studentName="Max Müller"
                studentImageUrl="https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600"
                coachName="Sophie Fischer"
                coachImageUrl="https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png"
                courseName="Digital Marketing"
                courseImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                completedCourseDate={new Date('2025-03-20')}
            />,
            <StudentCard
                key="5"
                {...studentCardBaseProps}
                status="waiting-feedback"
                studentName="Liam Johnson"
                studentImageUrl="https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png"
                coachName="Ella Davis"
                coachImageUrl="https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600"
                courseName="Product Management"
                courseImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
            />,
            <StudentCard
                key="6"
                {...studentCardBaseProps}
                status="default"
                studentName="Sofia Lee"
                studentImageUrl="https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600"
                coachName="Daniel Kim"
                coachImageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                courseName="Business Strategy"
                courseImageUrl="https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png"
                isYou={true}
                coachingSessionsLeft={3}
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
