import type { Meta, StoryObj } from '@storybook/react';
import { UserAvatarReel } from '../lib/components/avatar/user-avatar-reel';
import { UserAvatar } from '../lib/components/avatar/user-avatar';

const meta: Meta<typeof UserAvatarReel> = {
  title: 'Components/UserAvatarReel',
  component: UserAvatarReel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatarReel>;

// Test Case 1: Default Avatar Reel
export const Default: Story = {
  args: {
    children: (
      <>
        <UserAvatar fullName="Alice Smith" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className='mr-[-12px]' />
        <UserAvatar fullName="Bob Johnson" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className='mr-[-12px]' />
        <UserAvatar fullName="Charlie Brown" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className='mr-[-12px]' />
        <UserAvatar fullName="+3" />
      </>
    ),
  },
};

// Test Case 2: Mixed Avatars
export const MixedAvatars: Story = {
  args: {
    children: (
      <>
        <UserAvatar fullName="AA" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className='mr-[-12px]' />
        <UserAvatar fullName="BB" className='mr-[-12px]' />
        <UserAvatar fullName="CC" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className='mr-[-12px]' />
        <UserAvatar fullName="DD" className='mr-[-12px]' />
        <UserAvatar fullName="EE" className='mr-[-12px]' />
      </>
    ),
  },
};

// Test Case 3: Small Size
export const SmallSize: Story = {
  args: {
    children: (
      <>
        <UserAvatar size="small" fullName="A" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className="mr-[-6px]" />
        <UserAvatar size="small" fullName="B" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className="mr-[-6px]" />
        <UserAvatar size="small" fullName="C" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" className="mr-[-6px]" />
        <UserAvatar size="small" fullName="+3" />
      </>
    ),
  },
};

// Test Case 4: Single Avatar
export const SingleAvatar: Story = {
  args: {
    children: <UserAvatar fullName="Solo User" imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" />,
  },
};
