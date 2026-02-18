import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeadingLesson, HeadingLessonPreview } from '../lib/components/heading-type';


// The main issue is here - we need to export default the HeadingLessonMeta
// and use that as the primary meta export
const meta: Meta<typeof HeadingLesson> = {
    title: 'Components/Heading',
    component: HeadingLesson,
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
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof HeadingLesson>;

// Now define your stories using the Story type
export const HeadingLessonDefault: Story = {
    name: 'Default HeadingLesson',
    args: {
        locale: 'en',
    },
};

export const HeadingLessonGerman: Story = {
    name: 'HeadingLesson (German)',
    args: {
        locale: 'de',
    },
};



// For the preview component, we'll create a separate meta & stories
// but keep them in the same file for simplicity
export const PreviewExamples = {
    title: 'Components/HeadingPreview',
    component: HeadingLessonPreview,
    render: (args) => <HeadingLessonPreview {...args} />,
};

export const PreviewH1 = {
    ...PreviewExamples,
    name: 'Preview - H1',
    args: {
        headingValue: { heading: 'This is a H1 Heading', type: 'h1' }
    },
};

export const PreviewH2 = {
    ...PreviewExamples,
    name: 'Preview - H2',
    args: {
        headingValue: { heading: 'This is a H2 Heading', type: 'h2' }
    },
};

export const PreviewH3 = {
    ...PreviewExamples,
    name: 'Preview - H3',
    args: {
        headingValue: { heading: 'This is a H3 Heading', type: 'h3' }
    },
};
