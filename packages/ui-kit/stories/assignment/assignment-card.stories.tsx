import { FC, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AssignmentCard } from '../../lib/components/assignment/assignment-card';
import { fileMetadata, shared, role } from '@maany_shr/e-class-models';
import { assignment as assignmentTypes } from '@maany_shr/e-class-models';

const mockCourse = {
    id: 1,
    title: 'React Fundamentals',
    imageUrl: 'https://picsum.photos/40/40',
};

const mockStudent = {
    id: '1',
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    isCurrentUser: false,
    role: 'student' as const,
};

const mockCoach = {
    id: '2',
    name: 'Jane Coach',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    isCurrentUser: true,
    role: 'coach' as const,
};

const generateFile = (): fileMetadata.TFileMetadata => ({
    id: String(Math.random()),
    name: 'Document.pdf',
    mimeType: 'application/pdf',
    size: 102400,
    checksum: 'abc123',
    status: 'available',
    category: 'document',
    url: 'https://example.com/document.pdf',
});

const generateImage = (): fileMetadata.TFileMetadata => ({
    id: String(Math.random()),
    name: 'Image.png',
    mimeType: 'image/png',
    size: 204800,
    checksum: 'def456',
    status: 'available',
    category: 'image',
    url: 'https://example.com/image.png',
    thumbnailUrl: 'https://picsum.photos/100',
});

const generateLink = (): shared.TLinkWithId => ({
    linkId: Math.floor(Math.random() * 1_000_000),
    title: 'Google',
    url: 'https://www.google.com',
});

const baseAssignmentProps = {
    module: 1,
    lesson: 2,
    course: mockCourse,
    student: mockStudent,
    groupName: 'Group A',
    onClickCourse: () => alert('Course clicked'),
    onClickUser: () => alert('User clicked'),
    onClickGroup: () => alert('Group clicked'),
    onClickView: () => alert('View clicked'),
};

const meta: Meta<typeof AssignmentCard> = {
    title: 'Components/Assignment/AssignmentCard',
    component: AssignmentCard,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'radio',
            options: ['en', 'de'],
            defaultValue: 'en',
        },
        role: {
            control: 'radio',
            options: ['student', 'coach'],
        },
        status: {
            control: 'radio',
            options: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        },
    },
};
export default meta;

type Story = StoryObj<typeof AssignmentCard>;

/**
 * Story Template with State Handling
 */
const WithStateTemplate: FC<{
    locale: 'en' | 'de';
    role: Omit<role.TRole, 'visitor' | 'admin'>;
    status: assignmentTypes.TAssignmentStatusEnum;
}> = ({ locale, role, status = 'AwaitingReview' }) => {
    const [files, setFiles] = useState([
        generateFile(),
        generateImage(),
    ]);

    const [links, setLinks] = useState([
        generateLink(),
        generateLink(),
    ]);

    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    const handleFileDownload = (id: string) => {
        alert(`Download file ${id}`);
    };

    const handleFileDelete = (assignId: number, fileId: string) => {
        const updated = files.filter(file => file.id !== fileId);
        setFiles(updated);
        console.log('Updated files:', updated);
    };

    const handleLinkDelete = (assignId: number, linkId: number) => {
        const updated = links.filter(link => link.linkId !== linkId);
        setLinks(updated);
        if (linkEditIndex !== null && links[linkEditIndex]?.linkId === linkId) {
            setLinkEditIndex(null);
        }
        console.log('Updated links:', updated);
    };

    const handleChange = (
        updatedFiles: fileMetadata.TFileMetadata[],
        updatedLinks: shared.TLinkWithId[],
        editedIndex?: number | null
    ) => {
        setFiles(updatedFiles);
        setLinks(updatedLinks);
        setLinkEditIndex(editedIndex ?? null);
        console.log('Change - Files:', updatedFiles, 'Links:', updatedLinks, 'LinkIndex:', editedIndex);
    };

    return (
        <AssignmentCard
            {...baseAssignmentProps}
            assignmentId={10}
            locale={locale}
            role={role}
            status={status}
            title="Assignment with State"
            description="Editable files and links"
            files={files}
            links={links}
            replies={[]}
            linkEditIndex={linkEditIndex}
            onFileDownload={handleFileDownload}
            onFileDelete={handleFileDelete}
            onImageChange={() => { console.log('Image changed'); }}
            onLinkDelete={handleLinkDelete}
            onChange={handleChange}
        />
    );
};

/**
 * Stories
 */

export const NoRepliesOnlyFilesLinks: Story = {
    render: (args) => {
        const { locale, role, status } = args;
        return <WithStateTemplate locale={locale} role={role} status={status} />;
    },
    args: {
        locale: 'en',
        role: 'coach',
        status: 'AwaitingReview',
    },
};


export const OnlyReplies: Story = {
    render: (args) => (
        <AssignmentCard
            {...baseAssignmentProps}
            {...args}
            assignmentId={11}
            title="Assignment With Replies"
            description=""
            files={[]}
            links={[]}
            replies={[
                {
                    replyId: 1,
                    timestamp: new Date().toISOString(),
                    type: 'text',
                    comment: 'This is a text reply message.',
                    sender: mockStudent,
                },
            ]}
            linkEditIndex={null}
        />
    ),
    args: {
        locale: 'en',
        role: 'coach',
        status: 'AwaitingReview',
    },
};

export const AllCombined: Story = {
    render: (args) => {
        const [files, setFiles] = useState([generateFile()]);
        const [links, setLinks] = useState([generateLink()]);
        const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

        const handleChange = (
            updatedFiles: fileMetadata.TFileMetadata[],
            updatedLinks: shared.TLinkWithId[],
            editedIndex?: number | null
        ) => {
            setFiles(updatedFiles);
            setLinks(updatedLinks);
            setLinkEditIndex(editedIndex ?? null);
            console.log('Change - Files:', updatedFiles, 'Links:', updatedLinks, 'LinkIndex:', editedIndex);
        };

        const mockCoach = {
            id: '2',
            name: 'Jane Coach',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            isCurrentUser: true,
            role: 'coach' as const,
        };

        const replies: assignmentTypes.TAssignmentReplyWithId[] = [
            {
                replyId: 1,
                timestamp: new Date().toISOString(),
                type: 'resources',
                comment: 'Here are updated files and links.',
                sender: mockCoach,
                files,
                links,
            }
        ];

        return (
            <AssignmentCard
                {...baseAssignmentProps}
                {...args}
                assignmentId={12}
                title="Full Assignment"
                description="Files, links, and replies."
                files={files}
                links={links}
                replies={replies}
                linkEditIndex={linkEditIndex}
                onChange={handleChange}
                onFileDownload={(id) => alert(`Download: ${id}`)}
                onFileDelete={(assignId, fileId) => setFiles(fs => fs.filter(f => f.id !== fileId))}
                onLinkDelete={(assignId, linkId) => setLinks(ls => ls.filter(l => l.linkId !== linkId))}
                onImageChange={() => { console.log('Image changed'); }}
            />
        );
    },
    args: {
        locale: 'en',
        role: 'coach',
        status: 'AwaitingReview',
    },
};


export const PassedReply: Story = {
    render: (args) => (
        <AssignmentCard
            {...baseAssignmentProps}
            {...args}
            assignmentId={13}
            title="Assignment Status is Passed"
            files={[]}
            links={[]}
            replies={[
                {
                    replyId: 1,
                    timestamp: new Date().toISOString(),
                    type: 'passed',
                    sender: mockCoach,
                },
            ]}
            linkEditIndex={null}
        />
    ),
    args: {
        locale: 'en',
        role: 'coach',
        status: 'Passed',
    },
};
