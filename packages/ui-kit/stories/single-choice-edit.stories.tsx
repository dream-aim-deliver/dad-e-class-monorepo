import type { Meta, StoryObj } from '@storybook/react';
import { SingleChoiceEdit } from '../lib/components/single-choice';
import { useState } from 'react';

const meta: Meta<typeof SingleChoiceEdit> = {
    title: 'Components/SingleChoiceEdit',
    component: SingleChoiceEdit,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SingleChoiceEdit>;

// Wrapper component to handle state
const SingleChoiceEditWithState = () => {
    const [title, setTitle] = useState("Select your favorite color");
    const [options, setOptions] = useState([
        { name: "Red" },
        { name: "Blue" },
        { name: "Green" }
    ]);

    return (
        <div className="w-[500px]">
            <SingleChoiceEdit
                title={title}
                options={options}
                setTitle={setTitle}
                setOptions={setOptions}
            />
        </div>
    );
};

export const Default: Story = {
    render: () => <SingleChoiceEditWithState />
};

export const Empty: Story = {
    render: () => {
        const [title, setTitle] = useState("Select an option");
        const [options, setOptions] = useState<{ name: string }[]>([]);

        return (
            <div className="w-[500px]">
                <SingleChoiceEdit
                    title={title}
                    options={options}
                    setTitle={setTitle}
                    setOptions={setOptions}
                />
            </div>
        );
    }
};

export const LongOptions: Story = {
    render: () => {
        const [title, setTitle] = useState("Select your favorite programming language");
        const [options, setOptions] = useState([
            { name: "JavaScript/TypeScript" },
            { name: "Python" },
            { name: "Java" },
            { name: "C++" },
            { name: "Ruby" },
            { name: "Go" }
        ]);

        return (
            <div className="w-[500px]">
                <SingleChoiceEdit
                    title={title}
                    options={options}
                    setTitle={setTitle}
                    setOptions={setOptions}
                />
            </div>
        );
    }
}; 