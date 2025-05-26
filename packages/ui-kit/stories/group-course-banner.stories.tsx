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
    studentsName: {
      control: 'text',
      description: 'Name of the students who has taken the course',
    },
    avatarImageUrl: {
      control: 'text',
      description: 'URL of the avatar image of the student',
    },
    onClickGroupWorkspace: {
      action: 'clicked',
      description: 'Function to call when the group workspace button is clicked',
    },
  },
} satisfies Meta<typeof GroupCourseBanner>;

type Story = StoryObj<typeof GroupCourseBanner>;

// Reusable Avatar Reel Example
const AvatarReelExample = (
  <div className='flex gap-[15px] items-center md:flex-row flex-col'>
    <UserAvatarReel>
      <UserAvatar size='small' fullName="Alice Smith" imageUrl="https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1" className='mr-[-12px]' />
      <UserAvatar size='small' fullName="Bob Johnson" imageUrl="https://s.abcnews.com/images/Lifestyle/AP_micro_pigs_1_sr_140319_14x11_1600.jpg?w=1600" className='mr-[-12px]' />
      <UserAvatar size='small' fullName="Charlie Brown" imageUrl="https://kessenvetclinic.com/wp-content/uploads/2019/02/Mini-pig.png" className='mr-[-12px]' />
      <UserAvatar size='small' fullName="+24" />
    </UserAvatarReel>
    <p className='text-text-primary text-sm'>
      Alice Smith, Bob Johnson and 22 others
    </p>
  </div>
);

export const Default: Story = {
    args: {
        locale: 'en',
        avatarImageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        onClickGroupWorkspace: () => alert('Group workspace clicked'),
        children: AvatarReelExample,
    },
    };
