import type { Meta, StoryObj } from '@storybook/react';
import { CoachNotesEdit, CoachNotesView } from '../lib/components/coach-notes';
import { Descendant } from 'slate';
import { useState } from 'react';

// Define the noteLink type to match the component
type noteLink = {
    url: string;
    title: string;
    icon?: string;
    file?: File | null;
    isEdit?: boolean;
};

// Define props for the wrapper component
interface CoachNotesWrapperProps {
    noteDescription: Descendant[];
    noteLinks: noteLink[];
    includeInMaterials: boolean;
    locale: 'en' | 'de';
}

// Wrapper component that manages state
const CoachNotesWrapper = (args: CoachNotesWrapperProps) => {
    const [noteLinks, setNoteLinks] = useState<noteLink[]>(args.noteLinks);
    const [includeInMaterials, setIncludeInMaterials] = useState(args.includeInMaterials);

    const handleChange = (description: string, newLinks: noteLink[], newIncludeInMaterials: boolean) => {
        setNoteLinks(newLinks);
        setIncludeInMaterials(newIncludeInMaterials);
        console.log('onChange:', { description, links: newLinks, includeMaterials: newIncludeInMaterials });
    };

    const handlePublish = (description: string, links: noteLink[], includeMaterials: boolean) => {
        console.log('onPublish:', { description, links, includeMaterials });
        alert('Notes published successfully!');
    };

    return (
        <CoachNotesEdit
            {...args}
            noteLinks={noteLinks}
            includeInMaterials={includeInMaterials}
            onChange={handleChange}
            onPublish={handlePublish}
        />
    );
};

const meta: Meta<typeof CoachNotesEdit> = {
    title: 'Components/CoachNotes',
    component: CoachNotesEdit,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onChange: { action: 'changed' },
        onPublish: { action: 'published' },
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        includeInMaterials: { control: 'boolean' },
        noteDescription: { control: 'object' },
        noteLinks: { control: 'object' },
    },
};

export default meta;
type Story = StoryObj<typeof CoachNotesEdit>;

// Default initial value for the rich text editor
const defaultNoteDescription: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is a sample coaching note. You can write your ' },
            { text: 'important', bold: true },
            { text: ' observations and feedback here.' },
        ],
    },
    {
        type: 'paragraph',
        children: [
            { text: 'Key points to remember:' },
        ],
    },
    {
        type: 'bulleted-list',
        children: [
            {
                type: 'list-item',
                children: [{ text: 'Student shows good understanding of concepts' }],
            },
            {
                type: 'list-item',
                children: [{ text: 'Needs more practice with practical applications' }],
            },
        ],
    },
];

// Sample links data
const sampleLinks = [
    {
        title: 'Additional Reading Material',
        url: 'https://example.com/reading',
        icon: 'document',
        isEdit: false,
    },
    {
        title: 'Practice Exercises',
        url: 'https://example.com/exercises',
        icon: 'exercise',
        isEdit: false,
    },
];

// Empty state for testing
const emptyNoteDescription: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

// Coach Notes Edit - Default state with interactive behavior
export const EditDefault: Story = {
    render: (args) => <CoachNotesWrapper {...args} />,
    args: {
        noteDescription: defaultNoteDescription,
        noteLinks: sampleLinks,
        includeInMaterials: true,
        locale: 'en',
    },
};

// Coach Notes Edit - Empty state with interactive behavior
export const EditEmpty: Story = {
    render: (args) => <CoachNotesWrapper {...args} />,
    args: {
        noteDescription: emptyNoteDescription,
        noteLinks: [],
        includeInMaterials: false,
        locale: 'en',
    },
};

// Coach Notes Edit - With editing links and interactive behavior
export const EditWithEditingLinks: Story = {
    render: (args) => <CoachNotesWrapper {...args} />,
    args: {
        noteDescription: defaultNoteDescription,
        noteLinks: [
            ...sampleLinks,
            {
                title: '',
                url: '',
                isEdit: true,
            },
        ],
        includeInMaterials: true,
        locale: 'en',
    },
};

// Coach Notes Edit - German locale with interactive behavior
export const EditGerman: Story = {
    render: (args) => <CoachNotesWrapper {...args} />,
    args: {
        noteDescription: [
            {
                type: 'paragraph',
                children: [
                    { text: 'Dies ist eine Beispiel-Coaching-Notiz. Sie können Ihre ' },
                    { text: 'wichtigen', bold: true },
                    { text: ' Beobachtungen und Rückmeldungen hier schreiben.' },
                ],
            },
        ],
        noteLinks: [
            {
                title: 'Zusätzliches Lesematerial',
                url: 'https://example.com/reading-de',
                icon: 'document',
                isEdit: false,
            },
        ],
        includeInMaterials: true,
        locale: 'de',
    },
};

// Coach Notes View Stories
type ViewStory = StoryObj<typeof CoachNotesView>;

export const ViewDefault: ViewStory = {
    render: (args) => <CoachNotesView {...args} />,
    args: {
        noteDescription: defaultNoteDescription,
        noteLinks: sampleLinks,
        includeInMaterials: true,
        locale: 'en',
        // View component doesn't need onChange/onPublish but they're required by the interface
        onChange: () => { /* no-op */ },
        onPublish: () => { /* no-op */ },
    },
};

export const ViewEmpty: ViewStory = {
    render: (args) => <CoachNotesView {...args} />,
    args: {
        noteDescription: emptyNoteDescription,
        noteLinks: [],
        includeInMaterials: false,
        locale: 'en',
        onChange: () => { /* no-op */ },
        onPublish: () => { /* no-op */ },
    },
};

export const ViewWithManyLinks: ViewStory = {
    render: (args) => <CoachNotesView {...args} />,
    args: {
        noteDescription: [
            {
                type: 'paragraph',
                children: [
                    { text: 'This coaching session covered multiple topics with extensive resources.' },
                ],
            },
        ],
        noteLinks: [
            {
                title: 'JavaScript Fundamentals',
                url: 'https://example.com/js-fundamentals',
                icon: 'code',
                isEdit: false,
            },
            {
                title: 'React Documentation',
                url: 'https://react.dev',
                icon: 'react',
                isEdit: false,
            },
            {
                title: 'TypeScript Handbook',
                url: 'https://typescriptlang.org/docs',
                icon: 'typescript',
                isEdit: false,
            },
            {
                title: 'Practice Exercises',
                url: 'https://example.com/exercises',
                icon: 'exercise',
                isEdit: false,
            },
            {
                title: 'Video Tutorial',
                url: 'https://example.com/video',
                icon: 'video',
                isEdit: false,
            },
        ],
        includeInMaterials: true,
        locale: 'en',
        onChange: () => { /* no-op */ },
        onPublish: () => { /* no-op */ },
    },
};

export const ViewGerman: ViewStory = {
    render: (args) => <CoachNotesView {...args} />,
    args: {
        noteDescription: [
            {
                type: 'paragraph',
                children: [
                    { text: 'Dies ist eine Coaching-Notiz in deutscher Sprache. ' },
                    { text: 'Wichtige', bold: true },
                    { text: ' Punkte wurden während der Sitzung besprochen.' },
                ],
            },
        ],
        noteLinks: [
            {
                title: 'Deutsche Ressourcen',
                url: 'https://example.com/de-resources',
                icon: 'document',
                isEdit: false,
            },
        ],
        includeInMaterials: true,
        locale: 'de',
        onChange: () => { /* no-op */ },
        onPublish: () => { /* no-op */ },
    },
};
