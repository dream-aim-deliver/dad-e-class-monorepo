import { UserAvatar, UserAvatarProps } from '../lib/components/avatar/user-avatar';
import { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/UserAvatar',
    component: UserAvatar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `The **UserAvatar** component is used to display a user's profile picture or their initials if no image is provided.
        
### Features:
- Displays a profile picture if available.
- Falls back to initials when no image is present.
- Supports multiple sizes: **xSmall, small, medium, large, xLarge**.
- Customizable through props like \`imageUrl\`, \`initials\`, and \`size\`.`
            },
        },
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['xSmall', 'small', 'medium', 'large', 'xLarge'],
            description: 'Determines the size of the avatar.',
        },
        hasProfilePicture: {
            control: 'boolean',
            description: 'Determines if the user has a profile picture.',
        },
        imageUrl: {
            control: 'text',
            description: 'The URL of the user profile picture.',
        },
        initials: {
            control: 'text',
            description: 'The initials of the user.',
        },
    },
} satisfies Meta<UserAvatarProps>;

type Story = StoryObj<UserAvatarProps>;

/**
 * Displays an avatar with a profile picture.
 */
export const WithProfilePicture: Story = {
    args: {
        hasProfilePicture: true,
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', // Placeholder image
        size: 'medium',
        initials: 'hello',
    },
    parameters: {
        docs: {
            description: {
                story: 'This story shows a user avatar with a valid profile picture.',
            },
        },
    },
};

/**
 * Displays an avatar using user initials when no profile picture is available.
 */
export const WithoutProfilePicture: Story = {
    args: {
        hasProfilePicture: false,
        initials: 'AB',
        size: 'medium',
    },
    parameters: {
        docs: {
            description: {
                story: 'This story shows a user avatar with initials instead of an image.',
            },
        },
    },
};

/**
 * Demonstrates how the component handles an invalid image URL.
 */
export const InvalidImageUrl: Story = {
    args: {
        hasProfilePicture: true,
        imageUrl:
            'https://res.cloudnary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
        initials: 'CD',
        size: 'medium',
    },
    parameters: {
        docs: {
            description: {
                story: 'This story simulates an invalid image URL fallback scenario.',
            },
        },
    },
};

/**
 * Showcases the avatar in different sizes.
 */
export const DifferentSizes: Story = {
    args: {
        hasProfilePicture: false,
        initials: 'EF',
        size: 'large',
    },
    parameters: {
        docs: {
            description: {
                story: 'This story demonstrates the different available avatar sizes.',
            },
        },
    },
};
