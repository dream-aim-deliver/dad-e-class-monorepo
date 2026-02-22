import { Meta, StoryObj } from '@storybook/react-vite';
import {
    CourseGeneralInformationView,
    CourseGeneralInformationViewProps,
} from '../../lib/components/course-general-information/course-general-information-view';

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

const meta: Meta<typeof CourseGeneralInformationView> = {
    title: 'Components/CourseGeneralInformation/View',
    component: CourseGeneralInformationView,
    args: {
        title: 'React for Beginners',
        longDescription:
            'Learn React from scratch with hands-on examples and projects.',
        duration: {
            video: 120,
            coaching: 60,
            selfStudy: 90,
        },
        author: {
            name: 'Jane Doe',
            image: 'https://www.agronet.gov.co/Noticias/PublishingImages/AgenciaUNAL01-120522.jpg',
        },
        rating: 4.5,
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        locale: 'en',
        coaches: coachesExample,
        onClickAuthor: () => alert('Author clicked'),
    },
};

export default meta;

type Story = StoryObj<CourseGeneralInformationViewProps>;

export const WithoutProgress: Story = {
    args: {
        showProgress: false,
    },
};

export const NotStarted: Story = {
    args: {
        showProgress: true,
        progress: 0,
        onClickResume: () => alert('Begin course clicked'),
        onClickReview: () => alert('Review clicked'),
    },
};

export const InProgress: Story = {
    args: {
        showProgress: true,
        progress: 65,
        onClickResume: () => alert('Resume course clicked'),
        onClickReview: () => alert('Review clicked'),
    },
};

export const Completed: Story = {
    args: {
        showProgress: true,
        progress: 100,
        onClickResume: () => alert('Resume clicked'),
        onClickReview: () => alert('Review course clicked'),
    },
};
