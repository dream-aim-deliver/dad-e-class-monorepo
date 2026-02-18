import { Meta, StoryObj } from '@storybook/react-vite';
import {
    CourseGeneralInformationVisitor,
    CourseGeneralInformationVisitorProps,
} from '../../lib/components/course-general-information/course-general-information-visitor';

const coachesExample = [
    {
        name: 'John Smith',
        avatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
    },
    {
        name: 'Alice Johnson',
        avatarUrl: 'https://cdn.unotv.com/images/2024/02/marranito-160831.jpg',
    },
    {
        name: 'Bob Lee',
        avatarUrl:
            'https://www.agronet.gov.co/Noticias/PublishingImages/AgenciaUNAL01-120522.jpg',
    },
    {
        name: 'Charlie Brown',
        avatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
    },
];

const requiredCoursesExample = [
    {
        image: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
        courseTitle: 'JS Basics',
        slug: 'js-basics',
    },
    {
        image: 'https://www.agronet.gov.co/Noticias/PublishingImages/AgenciaUNAL01-120522.jpg',
        courseTitle: 'HTML & CSS',
        slug: 'html-css',
    },
    {
        image: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
        courseTitle: 'JS Basics',
        slug: 'js-as',
    },
    {
        image: 'https://www.agronet.gov.co/Noticias/PublishingImages/AgenciaUNAL01-120522.jpg',
        courseTitle: 'HTML & CSS',
        slug: 'html-as',
    },
    {
        image: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
        courseTitle: 'JS Basics',
        slug: 'js-basics',
    },
    {
        image: 'https://www.agronet.gov.co/Noticias/PublishingImages/AgenciaUNAL01-120522.jpg',
        courseTitle: 'HTML & CSS',
        slug: 'html-css',
    },
    {
        image: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
        courseTitle: 'JS Basics',
        slug: 'js-as',
    },
    {
        image: 'https://www.agronet.gov.co/Noticias/PublishingImages/AgenciaUNAL01-120522.jpg',
        courseTitle: 'HTML & CSS',
        slug: 'html-as',
    },
];

const meta: Meta<typeof CourseGeneralInformationVisitor> = {
    title: 'Components/CourseGeneralInformation/Visitor',
    component: CourseGeneralInformationVisitor,
    args: {
        title: 'React for Beginners',
        longDescription:
            'Learn React from scratch with hands-on examples and projects.',
        duration: { video: 120, coaching: 60, selfStudy: 90 },
        author: {
            name: 'Jane Doe',
            image: 'https://www.agronet.gov.co/Noticias/PublishingImages/AgenciaUNAL01-120522.jpg',
        },
        pricing: { currency: 'USD', partialPrice: 49, fullPrice: 99 },
        rating: 4.5,
        totalRating: 120,
        ownerRating: 4.8,
        ownerTotalRating: 50,
        locale: 'en',
        coaches: coachesExample,
        totalCoachesCount: 4,
        requiredCourses: requiredCoursesExample,
        onClickBook: () => alert('Book clicked'),
        onClickBuyCourse: (included: boolean) =>
            alert(`Buy course clicked, coaching included: ${included}`),
        onCoachingIncludedChange: (included: boolean) =>
            console.log('Coaching included changed:', included),
        onClickRequiredCourse: (slug: string) =>
            alert(`Navigate to course: ${slug}`),
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    },
};

export default meta;
type Story = StoryObj<CourseGeneralInformationVisitorProps>;

export const OneRequirement: Story = {
    args: {
        requiredCourses: [
            {
                image: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
                courseTitle: 'JS Basics',
                slug: 'js-basics',
            },
        ],
    },
};

export const NoRequirements: Story = {
    args: {
        requiredCourses: [],
    },
};

export const ManyRequirements: Story = {};
