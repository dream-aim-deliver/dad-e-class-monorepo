import { Meta, StoryObj } from '@storybook/react-vite';
import { GroupCourseBanner } from '../lib/components/group-course-banner';

const studentsExample = [
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
];

export default {
    title: 'Components/GroupCourseBanner',
    component: GroupCourseBanner,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        onClickGroupWorkspace: {
            action: 'clicked',
            description:
                'Function to call when the group workspace button is clicked',
        },
    },
} satisfies Meta<typeof GroupCourseBanner>;

type Story = StoryObj<typeof GroupCourseBanner>;

export const Default: Story = {
    args: {
        locale: 'en',
        students: studentsExample,
        totalStudentCount: 9,
        onClickGroupWorkspace: () => alert('Group workspace clicked'),
    },
};
