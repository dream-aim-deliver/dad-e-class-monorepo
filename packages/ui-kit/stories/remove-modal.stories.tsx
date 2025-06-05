import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RemoveModal } from '../lib/components/remove-modal';

const LocaleProvider: React.FC<{
    locale: string;
    children: React.ReactNode;
}> = ({ locale, children }) => <div data-locale={locale}>{children}</div>;

const meta: Meta<typeof RemoveModal> = {
    title: 'Components/RemoveModal',
    component: RemoveModal,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story, context) => (
            <LocaleProvider locale={context.args.locale || 'en'}>
                <Story />
            </LocaleProvider>
        ),
    ],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale for the modal text',
        },
        onClose: {
            action: 'closed',
            description: 'Callback when the modal is closed',
        },
        onBack: {
            action: 'backed',
            description: 'Callback when the back button is clicked',
        },
        onDelete: {
            action: 'deleted',
            description: 'Callback when the delete action is confirmed',
        },
        isError: {
            control: 'boolean',
            description: 'Indicates if there was an error during deletion',
        },
        isLoading: {
            control: 'boolean',
            description: 'Indicates if the modal is in a loading state',
        },
        deleted: {
            control: 'boolean',
            description: 'Indicates if the item has been deleted successfully',
        },
        variant: {
            control: 'select',
            options: ['lesson', 'module', 'coach'],
        },
    },
};

export default meta;

type Story = StoryObj<typeof RemoveModal>;

// Template for the RemoveModal story
const Template = (args: React.ComponentProps<typeof RemoveModal>) => {
    const [deleted, setDeleted] = React.useState(args.deleted ?? false);
    const [isError, setIsError] = React.useState(args.isError ?? false);
    const [isLoading, setIsLoading] = React.useState(args.isLoading ?? false);

    React.useEffect(() => {
        setDeleted(args.deleted ?? false);
    }, [args.deleted]);

    React.useEffect(() => {
        setIsError(args.isError ?? false);
    }, [args.isError]);

    const handleDelete = () => {
        setIsLoading(true);

        const shouldFail = Math.random() < 0.5; // Simulate a 50% chance of failure

        setTimeout(() => {
            setIsLoading(false);

            if (shouldFail) {
                setIsError(true);
                alert('Error deleting item!');
            } else {
                setDeleted(true);
                setIsError(false);
                alert('Item deleted successfully!');
            }
        }, 1000);

        args.onDelete?.();
    };

    return (
        <RemoveModal
            {...args}
            isLoading={isLoading}
            deleted={deleted}
            isError={isError}
            onDelete={handleDelete}
        />
    );
};

// Lesson Variant

export const LessonDefault: Story = {
    render: Template,
    args: {
        variant: 'lesson',
        lessonTitle: 'Introduction to React',
        locale: 'en',
        isError: false,
        isLoading: false,
        deleted: false,
    },
};

export const LessonLoading: Story = {
    render: Template,
    args: {
        ...LessonDefault.args,
        isLoading: true,
    },
};

export const LessonError: Story = {
    render: Template,
    args: {
        ...LessonDefault.args,
        isError: true,
    },
};

export const LessonDeleted: Story = {
    render: Template,
    args: {
        ...LessonDefault.args,
        deleted: true,
    },
};

// Module Variant

export const ModuleDefault: Story = {
    render: Template,
    args: {
        variant: 'module',
        moduleTitle: 'Advanced React Patterns',
        locale: 'en',
        isError: false,
        isLoading: false,
        deleted: false,
    },
};

export const ModuleLoading: Story = {
    render: Template,
    args: {
        ...ModuleDefault.args,
        isLoading: true,
    },
};
export const ModuleError: Story = {
    render: Template,
    args: {
        ...ModuleDefault.args,
        isError: true,
    },
};
export const ModuleDeleted: Story = {
    render: Template,
    args: {
        ...ModuleDefault.args,
        deleted: true,
    },
};

// Coach Variant

export const CoachDefault: Story = {
    render: Template,
    args: {
        variant: 'coach',
        coachName: 'John Smith',
        coachAvatarUrl:
            'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=1_1',
        courseTitle: 'Mastering JavaScript',
        courseImageUrl:
            'https://spca.bc.ca/wp-content/uploads/piglet-Pixabay-free-photo.jpg',
        locale: 'en',
        isError: false,
        isLoading: false,
        deleted: false,
    },
};

export const CoachLoading: Story = {
    render: Template,
    args: {
        ...CoachDefault.args,
        isLoading: true,
    },
};

export const CoachError: Story = {
    render: Template,
    args: {
        ...CoachDefault.args,
        isError: true,
    },
};

export const CoachDeleted: Story = {
    render: Template,
    args: {
        ...CoachDefault.args,
        deleted: true,
    },
};
