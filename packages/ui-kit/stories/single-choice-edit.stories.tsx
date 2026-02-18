import type { Meta, StoryObj } from '@storybook/react-vite';
import { SingleChoiceEdit } from '../lib/components/single-choice';

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
    
    return (
        <div className="w-[500px]">
            <SingleChoiceEdit
              locale='en'
              initialTitle={"Select an option"}
            initialOptions={[]}
            onChange={(value)=>console.log(value)}
            />
        </div>
    );
};

export const Default: Story = {
    render: () => <SingleChoiceEditWithState />
};

export const Empty: Story = {
    render: () => {
      

        return (
            <div className="w-[500px]">
                <SingleChoiceEdit
                 locale='en'
                 initialTitle={"Select an option"}
                  initialOptions={[]}
                    onChange={(value)=>console.log(value)}
                />
            </div>
        );
    }
};

export const LongOptions: Story = {
    render: () => {
        const title= "Select your favorite programming language";
        const options = [
            { name: "JavaScript/TypeScript" , isSelected: false },
            { name: "Python", isSelected: false },
            { name: "Java", isSelected: false },
            { name: "C++", isSelected: false },
            { name: "Ruby", isSelected: false },
            { name: "Go", isSelected: false }
        ];

        return (
            <div className="w-[500px]">
                <SingleChoiceEdit
                locale="en"
                    initialTitle={title}
                    initialOptions={options}
                    onChange={(value)=>console.log(value)}
                />
            </div>
        );
    }
}; 