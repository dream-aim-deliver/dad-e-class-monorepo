import { Meta, StoryObj } from '@storybook/react-vite';
import { BuyCoachingSessionBanner } from '../lib/components/buy-coaching-session-banner';

export default {
    title: 'Components/BuyCoachingSessionBanner',
    component: BuyCoachingSessionBanner,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        coachName: {
            control: 'text',
            description: 'Full name of the coach.',
        },
        coachAvatarUrl: {
            control: 'text',
            description: 'URL of the coach’s avatar image.',
        },
        description: {
            control: 'text',
            description: 'Short description or bio of the coach.',
        },
        coachRating: {
            control: { type: 'number', min: 0, max: 5 },
            description: 'Average rating of the coach.',
        },
        totalRatings: {
            control: { type: 'number', min: 0 },
            description: 'Total number of ratings the coach has received.',
        },
        isCourseCreator: {
            control: 'boolean',
            description: 'Determines if the user is also a course creator.',
        },
        onBookSessionWith: {
            action: 'Book session clicked',
            description: 'Callback when the "Book session" button is clicked.',
        },
    },
} satisfies Meta<typeof BuyCoachingSessionBanner>;

type Story = StoryObj<typeof BuyCoachingSessionBanner>;

export const Default: Story = {
    args: {
        coachName: 'Anna Keller',
        coachAvatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.',
        coachRating: 4.7,
        totalRatings: 128,
        locale: 'en',
        isCourseCreator: false,
        skills: ['Career Coaching', 'Resume Building'],
        onBookSessionWith: () => alert('Buy coaching session clicked'),
    },
};

export const CourseCreatorCoach: Story = {
    args: {
        ...Default.args,
        coachName: 'Sophie Müller',
        coachAvatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        isCourseCreator: true,
        skills: ['Career Coaching', 'Resume Building'],
        onBookSessionWith: () => alert('Buy coaching session clicked'),
    },
};
