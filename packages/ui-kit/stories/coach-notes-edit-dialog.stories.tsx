import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { NextIntlClientProvider } from 'next-intl';
import { CoachNotesEditDialog } from '../lib/components/coach/coach-notes-edit-dialog';
import { Button } from '../lib/components/button';
import type { Descendant } from 'slate';
import { fileMetadata } from '@maany_shr/e-class-models';
import { IconEdit } from '../lib/components/icons';

/**
 * Mock messages for translations.
 */
const mockMessages = {
    components: {
        coachNotes: {
            editNotes: 'Edit Coach Notes',
            noteDescription: 'Note Description',
            usefulLinks: 'Useful Links',
            addLink: 'Add Link',
            publishNotes: 'Publish Notes',
            includeInMaterials: 'Include in course materials',
            placeholder: 'Write your coach notes here...',
            notesValidation: 'No notes available. Start by exploring courses.',
        },
    },
    common: {
        back: 'Back',
    },
};

// Sample content
const sampleDescription: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is a sample coach note with ' },
            { text: 'bold text', bold: true },
            { text: ' and useful links below.' },
        ],
    },
];

const sampleLinks = [
    {
        title: 'React Documentation',
        url: 'https://react.dev',
        customIconMetadata: undefined,
    },
    {
        title: 'TypeScript Handbook',
        url: 'https://www.typescriptlang.org/docs/',
        customIconMetadata: undefined,
    },
];

const emptyDescription: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

/**
 * Simple wrapper component for Storybook
 */
const CoachNotesEditDialogWrapper = ({
    initialNoteLinks = [],
    initialDescription = JSON.stringify(emptyDescription),
    initialIncludeInMaterials = false,
}) => {
    const [noteLinks, setNoteLinks] = useState(initialNoteLinks);
    const [includeInMaterials, setIncludeInMaterials] = useState(
        initialIncludeInMaterials,
    );
    const [noteDescription, setNoteDescription] = useState(initialDescription);
    const [isOpen, setIsOpen] = useState(false);

    const handleImageChange = async (
        index: number,
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        console.log('Image change:', index, fileRequest.name);

        // Create a mock response for the upload
        const uploadedFile: fileMetadata.TFileMetadata = {
            id: fileRequest.id,
            name: fileRequest.name,
            mimeType: fileRequest.file.type,
            size: fileRequest.file.size,
            category: 'image',
            status: 'available',
            url: URL.createObjectURL(fileRequest.file),
            thumbnailUrl: URL.createObjectURL(fileRequest.file),
            checksum: 'mock-checksum',
        };

        return uploadedFile;
    };

    const handleDeleteIcon = (index: number) => {
        console.log('Delete icon:', index);
    };

    const handlePublish = (
        description: string,
        links: Array<{
            title: string;
            url: string;
            customIconMetadata?: fileMetadata.TFileMetadata;
        }>,
        includeInMaterials: boolean,
    ) => {
        console.log('Published:', { description, links, includeInMaterials });
        alert('Notes published!');
        setIsOpen(false);
    };

    const handleBack = () => {
        console.log('Back clicked');
        setIsOpen(false);
    };

    return (
        <div className="space-y-4">
            <Button
                variant="text"
                text="Edit"
                hasIconLeft
                iconLeft={<IconEdit />}
                onClick={() => setIsOpen(true)}
            />

            <CoachNotesEditDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                noteDescription={noteDescription}
                noteLinks={noteLinks}
                includeInMaterials={includeInMaterials}
                locale="en"
                onPublish={handlePublish}
                onBack={handleBack}
                onImageChange={handleImageChange}
                onDeleteIcon={handleDeleteIcon}
                onNoteLinksChange={setNoteLinks}
                onIncludeInMaterialsChange={setIncludeInMaterials}
                onNoteDescriptionChange={setNoteDescription}
                isEditMode={true}
            />
        </div>
    );
};

const meta: Meta<typeof CoachNotesEditDialog> = {
    title: 'Coach/CoachNotesEditDialog',
    component: CoachNotesEditDialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
A dialog component for editing coach notes with rich text editor, link management, and dual-button layout (Back/Publish).
        `,
            },
        },
    },
    decorators: [
        (Story) => (
            <NextIntlClientProvider locale="en" messages={mockMessages}>
                <div className="min-h-[400px] flex items-center justify-center">
                    <Story />
                </div>
            </NextIntlClientProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof CoachNotesEditDialog>;

/**
 * Default edit dialog with sample content.
 */
export const Default: Story = {
    render: () => (
        <CoachNotesEditDialogWrapper
            initialNoteLinks={sampleLinks}
            initialDescription={JSON.stringify(sampleDescription)}
            initialIncludeInMaterials={true}
        />
    ),
};

/**
 * Edit dialog starting empty.
 */
export const Empty: Story = {
    render: () => (
        <CoachNotesEditDialogWrapper
            initialNoteLinks={[]}
            initialDescription={JSON.stringify(emptyDescription)}
            initialIncludeInMaterials={false}
        />
    ),
};
