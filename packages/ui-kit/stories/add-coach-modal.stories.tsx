import { Meta, StoryObj } from '@storybook/react';
import { AddCoachModal } from '../lib/components/add-coach-modal';

export default {
    title: 'Components/AddCoachModal',
    component: AddCoachModal,
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
        onAdd: {
            action: 'addedCoach',
            description: 'Function to call when a coach is added',
        },
        addedCoachIds: {
            action: 'coachAdded',
            description: 'List of coach IDs already added',
        },
    },
} satisfies Meta<typeof AddCoachModal>;

type Story = StoryObj<typeof AddCoachModal>;

const mockCoaches = [
    {
        id: 'coach-1',
        coachName: 'John Doe',
        coachAvatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        totalRating: 15,
        rating: 4.7,
    },
    {
        id: 'coach-2',
        coachName: 'Jane Smith',
        coachAvatarUrl:
            'https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600',
        totalRating: 20,
        rating: 4.9,
    },
    {
        id: 'coach-3',
        coachName: 'Alice Johnson',
        coachAvatarUrl:
            'https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png',
        totalRating: 10,
        rating: 4.3,
    },
];

export const Default: Story = {
    args: {
        locale: 'en',
        onClose: () => alert('Modal closed'),
        onAdd: (id: string) => alert(`Added coach with ID: ${id}`),
        content: mockCoaches,
        addedCoachIds: ['coach-2'],
    },
};
