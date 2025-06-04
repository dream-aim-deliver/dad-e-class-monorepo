import { Meta, StoryObj } from '@storybook/react';
import { GroupCourseBanner } from '../lib/components/group-course-banner';
import { UserAvatar } from '../lib/components/avatar/user-avatar';
import { UserAvatarReel } from '../lib/components/avatar/user-avatar-reel';

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
        studentNames: {
            control: 'text',
            description: 'Name of the students who has taken the course',
        },
        onClickGroupWorkspace: {
            action: 'clicked',
            description:
                'Function to call when the group workspace button is clicked',
        },
    },
} satisfies Meta<typeof GroupCourseBanner>;

type Story = StoryObj<typeof GroupCourseBanner>;

// Reusable Avatar Reel Example
const AvatarReelExample = (
    <div className="flex gap-[15px] items-center md:flex-row flex-col">
        <UserAvatarReel>
            <UserAvatar
                size="small"
                fullName="Alice Smith"
                imageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1"
                className="mr-[-12px]"
                title="Alice Smith"
            />
            <UserAvatar
                size="small"
                fullName="Bob Johnson"
                imageUrl="https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600"
                className="mr-[-12px]"
                title="Bob Johnson"
            />
            <UserAvatar
                size="small"
                fullName="Charlie Brown"
                imageUrl="https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png"
                className="mr-[-12px]"
                title="Charlie Brown"
            />
            <UserAvatar size="small" fullName="+24" />
        </UserAvatarReel>
    </div>
);

export const Default: Story = {
    args: {
        locale: 'en',
        onClickGroupWorkspace: () => alert('Group workspace clicked'),
        children: AvatarReelExample,
        studentNames: "Alice Smith, Bob Johnson, Charlie brown and 24 others",
    },
};
