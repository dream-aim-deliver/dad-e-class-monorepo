import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserAvatarReel } from '../lib/components/avatar/user-avatar-reel';

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

const AVATAR_URL = 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3';

export const MediumSize: Story = {
  args: {
    locale: 'en',
    totalUsersCount: 6,
    size: 'medium',
    users: [
      { name: 'Alice Smith', avatarUrl: AVATAR_URL },
      { name: 'Bob Johnson', avatarUrl: AVATAR_URL },
      { name: 'Charlie Brown', avatarUrl: AVATAR_URL },
    ],
  },
};

export const LargeSize: Story = {
  args: {
    locale: 'en',
    totalUsersCount: 6,
    size: 'large',
    users: [
      { name: 'Alice Smith', avatarUrl: AVATAR_URL },
      { name: 'Bob Johnson', avatarUrl: AVATAR_URL },
      { name: 'Charlie Brown', avatarUrl: AVATAR_URL },
    ],
  },
};

export const MixedAvatars: Story = {
  args: {
    locale: 'en',
    totalUsersCount: 5,
    size: 'medium',
    users: [
      { name: 'Alice Smith', avatarUrl: AVATAR_URL },
      { name: 'Bob Johnson', avatarUrl: '' },
      { name: 'Charlie Brown', avatarUrl: AVATAR_URL },
    ],
  },
};

export const TwoUsers: Story = {
  args: {
    locale: 'en',
    totalUsersCount: 2,
    size: 'medium',
    users: [
      { name: 'Dana White', avatarUrl: AVATAR_URL },
      { name: 'Eli Black', avatarUrl: AVATAR_URL },
    ],
  },
};

export const SingleAvatar: Story = {
  args: {
    locale: 'en',
    totalUsersCount: 1,
    size: 'medium',
    users: [
      { name: 'Solo User', avatarUrl: AVATAR_URL },
    ],
  },
};

export const SingleAvatarLarge: Story = {
  args: {
    locale: 'en',
    totalUsersCount: 1,
    size: 'large',
    users: [
      { name: 'Solo User', avatarUrl: AVATAR_URL },
    ],
  },
};
