import { Meta, StoryObj } from '@storybook/react-vite';
import { ReviewSnippet } from '../../lib/components/review/review-snippet';

export default {
    title: 'Components/Review/ReviewSnippet',
    component: ReviewSnippet,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        rating: {
            control: { type: 'number', min: 1, max: 5 },
            description: 'The rating given by the user (1-5 stars).',
        },
        reviewerName: {
            control: 'text',
            description: 'The name of the reviewer.',
        },
        reviewerAvatarUrl: {
            control: 'text',
            description: 'The URL of the reviewer’s avatar.',
        },
        reviewText: {
            control: 'text',
            description: 'The main review content.',
        },
    },
} satisfies Meta<typeof ReviewSnippet>;

type Story = StoryObj<typeof ReviewSnippet>;

export const ShortText: Story = {
    args: {
        reviewText:
            'This was an excellent coaching session. The instructor was very knowledgeable and helpful.',
        rating: 4,
        reviewerName: 'John Doe',
        reviewerAvatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        locale: 'en',
    },
};

export const LongText: Story = {
    args: {
        reviewText:
            'This was an excellent coaching session. The instructor was very knowledgeable and helpful. I learned a lot about the topic and feel more confident in my skills. The session was well-structured and engaging, making it easy to follow along. I would highly recommend this coaching session to anyone looking to improve their understanding of the subject matter.',
        rating: 4,
        reviewerName: 'John Doe',
        reviewerAvatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        locale: 'en',
    },
};
