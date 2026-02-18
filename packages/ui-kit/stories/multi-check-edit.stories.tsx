import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultipleChoiceEdit } from '../lib/components/multiple-check';

const meta: Meta<typeof MultipleChoiceEdit> = {
    title: 'Components/MultipleChoiceEdit',
    component: MultipleChoiceEdit,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: {
                type: 'select',
                options: ['en', 'de'],
            },
            defaultValue: 'en',
            description: 'Language locale for the component',
        },
        initialTitle: { control: 'text' },
        initialOptions: { control: 'object' },
    },
};

export default meta;
type Story = StoryObj<typeof MultipleChoiceEdit>;

// --- Story 1: Default ---
const DefaultWrapper = () => {


    return (
        <div className="w-[500px]">
            <MultipleChoiceEdit
                locale='en'
                initialTitle={"Select your favorite color"}
                initialOptions={[]}
                onChange={(value) => console.log(value)}
            />
        </div>
    );
};

export const Default: Story = {
    render: () => <DefaultWrapper />,
};

// --- Story 2: Empty ---
const EmptyWrapper = () => {


    return (
        <div className="w-[500px]">
            <MultipleChoiceEdit
                locale='en'
                initialTitle={"Select an option"}
                initialOptions={[]}
            />
        </div>
    );
};

export const Empty: Story = {
    render: () => <EmptyWrapper />,
};

