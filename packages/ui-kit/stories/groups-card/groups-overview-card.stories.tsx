import type { Meta, StoryObj } from '@storybook/react-vite';
import { GroupOverviewCard } from '../../lib/components/groups-card/groups-overview-card';

const meta: Meta<typeof GroupOverviewCard> = {
    title: 'Components/Groups/GroupOverviewCard',
    component: GroupOverviewCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: { type: 'select' },
            options: ['en', 'de'],
        },
        isAdmin: {
            name: 'is-admin',
            control: { type: 'boolean' },
            description: 'Toggle admin view (true / false)',
        },
    },
};

export default meta;
type Story = StoryObj<typeof GroupOverviewCard>;

const sampleGroupDetails = {
  groupId: 1,
  groupName: 'Marketing Team Group',
  currentStudents: 22,
  totalStudents: 24,
  course: {
    image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    title: 'Course Title',
    slug: 'course-title',
  },
  coach: {
    name: 'Coach Name',
    isCurrentUser: false,
  },
  creator: {
    name: 'Course Creator Full Name',
    image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
  },
};

export const AdminView: Story = {
  args: {
    isAdmin: true,
    cardDetails: sampleGroupDetails,
    locale: 'en',
    onClickManage: () => console.log('Manage clicked'),
    onClickCourse: (slug: string) => console.log('Course clicked:', slug),
  },
};

export const German: Story = {
  args: {
    isAdmin: true,
    cardDetails: sampleGroupDetails,
    locale: 'de',
    onClickManage: () => console.log('Manage clicked'),
    onClickCourse: (slug: string) => console.log('Course clicked:', slug),
  },
};