import { Meta, StoryObj } from '@storybook/react-vite';
import { PlatformCardList } from '../../lib/components/platform-cards/platform-card-list';
import {
    PlatformCard,
    PlatformCardProps,
} from '../../lib/components/platform-cards/platform-card';

const meta: Meta<typeof PlatformCardList> = {
    title: 'Components/PlatformCard/PlatformCardList',
    component: PlatformCardList,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        children: {
            control: false,
            description: 'List of platform cards to display.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof PlatformCardList>;

const baseProps: Omit<PlatformCardProps, 'platformName' | 'courseCount'> = {
    locale: 'en',
    imageUrl: 'https://media.timeout.com/images/104064974/750/562/image.jpg',
    onClickManage: () => alert('Manage platform clicked'),
};

const createPlatformCard = (props: PlatformCardProps, key: string | number) => (
    <PlatformCard key={key} {...props} />
);

export const DifferentStates: Story = {
    args: {
        locale: 'en',
        children: [
            createPlatformCard(
                {
                    ...baseProps,
                    platformName: 'Digital Marketing Hub',
                    courseCount: 15,
                    onClickManage: () => alert('Manage Digital Marketing Hub'),
                },
                '1',
            ),
            createPlatformCard(
                {
                    ...baseProps,
                    platformName: 'Web Development Academy',
                    courseCount: 8,
                    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTV2hOQK0hCnq3aVhQy7YMjsskchNvny0IjQ&s',
                    onClickManage: () => alert('Manage Web Development Academy'),
                },
                '2',
            ),
            createPlatformCard(
                {
                    ...baseProps,
                    platformName: 'Data Science Center',
                    courseCount: 22,
                    imageUrl: 'https://ogden_images.s3.amazonaws.com/www.motherearthnews.com/images/2022/01/13093146/baby-Juliana-Pig-447x300.jpg',
                    onClickManage: () => alert('Manage Data Science Center'),
                },
                '3',
            ),
            createPlatformCard(
                {
                    ...baseProps,
                    platformName: 'UX Design Studio',
                    courseCount: 6,
                    imageUrl: '',
                    onClickManage: () => alert('Manage UX Design Studio'),
                },
                '4',
            ),
            createPlatformCard(
                {
                    ...baseProps,
                    platformName: 'Business Innovation Platform',
                    courseCount: 18,
                    imageUrl: 'https://images.squarespace-cdn.com/content/v1/57a2aeb1ff7c509ef76566c9/1619646261027-MMRWZPQCSUOY3XRF0UJ4/image-asset.jpeg',
                    onClickManage: () => alert('Manage Business Innovation Platform'),
                },
                '5',
            ),
            createPlatformCard(
                {
                    ...baseProps,
                    platformName: 'Mobile App Development',
                    courseCount: 0,
                    imageUrl: 'https://example.com/broken-image.jpg',
                    onClickManage: () => alert('Manage Mobile App Development'),
                },
                '6',
            ),
        ],
    },
};

export const Empty: Story = {
    args: {
        locale: 'en',
        children: [],
    },
};