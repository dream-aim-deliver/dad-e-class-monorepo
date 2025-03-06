import { Meta, StoryObj } from '@storybook/react';
import {
  UserAvatar,
  UserAvatarProps,
} from '../../lib/components/avatar/user-avatar';

const meta: Meta<typeof UserAvatar> = {
  title: 'Components/Avatar/UserAvatar',
  component: UserAvatar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['xSmall', 'small', 'medium', 'large', 'xLarge'],
      description: 'The size of the avatar.',
    },
    hasProfilePicture: {
      control: 'boolean',
      description: 'Whether the user has a profile picture.',
    },
    imageUrl: {
      control: 'text',
      description: "The URL of the user's profile picture.",
    },
    initials: {
      control: 'text',
      description:
        "The user's initials (used when there is no profile picture).",
    },
  },
};

export default meta;

const Template: StoryObj<typeof UserAvatar> = {
  render: (args) => <UserAvatar {...args} />,
};

export const WithProfilePicture: StoryObj<UserAvatarProps> = {
  ...Template,
  args: {
    size: 'medium',
    hasProfilePicture: true,
    imageUrl:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  },
};

export const WithInitials: StoryObj<UserAvatarProps> = {
  ...Template,
  args: {
    size: 'medium',
    hasProfilePicture: false,
    initials: 'JD',
  },
};

export const DifferentSizes: StoryObj<UserAvatarProps> = {
  render: () => (
    <div className="flex gap-4 items-end">
      <UserAvatar size="xSmall" hasProfilePicture={false} initials="XS" />
      <UserAvatar size="small" hasProfilePicture={false} initials="SM" />
      <UserAvatar size="medium" hasProfilePicture={false} initials="MD" />
      <UserAvatar size="large" hasProfilePicture={false} initials="LG" />
      <UserAvatar size="xLarge" hasProfilePicture={false} initials="XL" />
    </div>
  ),
};

export const WithCustomClass: StoryObj<UserAvatarProps> = {
  ...Template,
  args: {
    size: 'large',
    hasProfilePicture: true,
    imageUrl:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    className: 'border-4 border-blue-500',
  },
};
