import { FC, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AssignmentCard } from '../../lib/components/assignment/assignment-card';
import { course, fileMetadata, role, shared, assignment } from '@maany_shr/e-class-models';

// --- Mock Data Generators ---
const mockCourse: course.TCourseMetadata = {
    title: 'Mathematics 101',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
};

const mockStudent = {
    id: 'student-1',
    name: 'Alice Johnson',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
};

const mockGroup = {
    id: 'group-1',
    name: 'Team React',
};

const generateMockFile = (): fileMetadata.TFileMetadata => ({
    id: Math.floor(Math.random() * 1000000),
    name: 'Assignment.pdf',
    mimeType: 'application/pdf',
    size: 123456,
    checksum: 'checksum123',
    status: 'available',
    category: 'document',
    url: 'https://example.com/assignment.pdf',
});

const generateMockImage = (): fileMetadata.TFileMetadata => ({
    id: Math.floor(Math.random() * 1000000),
    name: 'Diagram.png',
    mimeType: 'image/png',
    size: 54321,
    checksum: 'checksum456',
    status: 'available',
    category: 'image',
    url: 'https://picsum.photos/400/300',
    thumbnailUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
});

const generateMockLink = (overrides?: Partial<shared.TLink>): shared.TLink => ({
    linkId: Math.floor(Math.random() * 1000000),
    url: 'https://react.dev',
    title: 'React Documentation',
    customIconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
    ...overrides,
});

const generateMockReply = (overrides?: Partial<assignment.TAssignmentReply>): assignment.TAssignmentReply => ({
    replyId: Math.floor(Math.random() * 1000000),
    timestamp: new Date().toISOString(),
    sender: {
        id: 'student-1',
        name: 'Alice Johnson',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        isCurrentUser: true,
        role: 'student',
    },
    type: 'text',
    comment: 'I have submitted my assignment!',
    ...overrides,
});

// --- Storybook Meta ---
const meta: Meta<typeof AssignmentCard> = {
    title: 'Components/Assignment/AssignmentCard',
    component: AssignmentCard,
    tags: ['autodocs'],
    argTypes: {
        role: {
            control: 'radio',
            options: ['student', 'coach'],
            defaultValue: 'student',
        },
        locale: {
            control: 'radio',
            options: ['en', 'de'],
            defaultValue: 'en',
        },
    },
};
export default meta;
type Story = StoryObj<typeof AssignmentCard>;

// --- Helper: onChange Handler ---
function useAssignmentCardState(initialFiles: fileMetadata.TFileMetadata[], initialLinks: shared.TLink[], initialReplies: assignment.TAssignmentReply[] = []) {
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>(initialFiles);
    const [links, setLinks] = useState<shared.TLink[]>(initialLinks);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);
    const [replies, setReplies] = useState<assignment.TAssignmentReply[]>(initialReplies);

    // AssignmentCard expects these handlers:
    const onFileDelete = (id: number, fileId: number, type: 'file') => {
        if (replies.length > 0) {
            // If replies, update latest reply's files
            setReplies(prev =>
                prev.map(reply =>
                    reply.replyId === id && reply.type === 'resources'
                        ? { ...reply, files: (reply.files ?? []).filter(f => f.id !== fileId) }
                        : reply
                )
            );
        } else {
            setFiles(prev => prev.filter(f => f.id !== fileId));
        }
    };

    const onFileDownload = (fileId: number) => {
        alert(`Download clicked for file with id: ${fileId}`);
    };

    const onLinkDelete = (id: number, linkId: number, type: 'link') => {
        if (replies.length > 0) {
            setReplies(prev =>
                prev.map(reply =>
                    reply.replyId === id && reply.type === 'resources'
                        ? { ...reply, links: (reply.links ?? []).filter(l => l.linkId !== linkId) }
                        : reply
                )
            );

            // SAFELY check for links only if reply.type === 'resources'
            const targetReply = replies.find(r => r.replyId === id);
            if (
                linkEditIndex !== null &&
                targetReply &&
                targetReply.type === 'resources' &&
                targetReply.links &&
                targetReply.links[linkEditIndex]?.linkId === linkId
            ) {
                setLinkEditIndex(null);
            }
        } else {
            setLinks(prev => prev.filter(l => l.linkId !== linkId));
            if (linkEditIndex !== null && links[linkEditIndex]?.linkId === linkId) {
                setLinkEditIndex(null);
            }
        }
    };


    // This handler is used for both files and links, and for link editing
    const onChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLink[],
        newLinkEditIndex?: number | null
    ) => {
        if (replies.length > 0) {
            // Only update latest reply
            setReplies(prev => {
                const latestIndex = prev.reduce(
                    (latestIdx, curr, idx, arr) =>
                        new Date(curr.timestamp) > new Date(arr[latestIdx].timestamp) ? idx : latestIdx,
                    0
                );
                return prev.map((reply, idx) =>
                    idx === latestIndex
                        ? { ...reply, files: newFiles, links: newLinks }
                        : reply
                );
            });
        } else {
            setFiles(newFiles);
            setLinks(newLinks);
        }
        setLinkEditIndex(typeof newLinkEditIndex === 'number' ? newLinkEditIndex : null);
    };

    return {
        files,
        setFiles,
        links,
        setLinks,
        linkEditIndex,
        setLinkEditIndex,
        replies,
        setReplies,
        onFileDelete,
        onFileDownload,
        onLinkDelete,
        onChange,
    };
}

// --- Stories ---

// 1. AssignmentCard without any replies (shows files/links at top level)
const WithoutRepliesRender: FC<{ role: Omit<role.TRole, 'visitor' | 'admin'>, locale: 'en' | 'de' }> = ({ role, locale }) => {
    const {
        files, links, linkEditIndex,
        onFileDelete, onFileDownload, onLinkDelete, onChange
    } = useAssignmentCardState(
        [generateMockFile(), generateMockImage()],
        [generateMockLink(), generateMockLink({ url: 'https://storybook.js.org', title: 'Storybook Docs', customIconUrl: '' })]
    );

    return (
        <AssignmentCard
            assignmentId={123}
            title="Component Design Assignment"
            description="Create a reusable button component with variants and size options."
            files={files}
            links={links}
            course={mockCourse}
            module={1}
            lesson={1}
            status="AwaitingReview"
            replies={[]}
            student={mockStudent}
            groupName={mockGroup.name}
            role={role}
            linkEditIndex={linkEditIndex}
            onFileDelete={onFileDelete}
            onFileDownload={onFileDownload}
            onLinkDelete={onLinkDelete}
            onChange={onChange}
            onClickCourse={() => alert('Course clicked')}
            onClickUser={() => alert('User clicked')}
            onClickGroup={() => alert('Group clicked')}
            onClickView={() => alert('View clicked')}
            locale={locale}
        />
    );
};

// 2. AssignmentCard with replies (shows latest reply as Message)
const WithRepliesRender: FC<{ role: Omit<role.TRole, 'visitor' | 'admin'>, locale: 'en' | 'de' }> = ({ role, locale }) => {
    // Initial replies: text reply (student), then resources reply (coach)
    const initialReplies: assignment.TAssignmentReply[] = [
        generateMockReply(),
        {
            replyId: Math.floor(Math.random() * 1000000),
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            sender: {
                id: 'coach-1',
                name: 'Coach Bob',
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                isCurrentUser: false,
                role: 'coach',
            },
            type: 'resources',
            comment: 'Please review these resources:',
            files: [generateMockImage()],
            links: [
                generateMockLink({ url: 'https://react-typescript-cheatsheet.netlify.app', title: 'TS Cheatsheet' }),
            ],
        }
    ];

    // Use files/links from latest reply for editing
    const {
        files, setFiles,
        links, setLinks,
        linkEditIndex,
        onFileDelete, onFileDownload, onLinkDelete, onChange,
        replies, setReplies
    } = useAssignmentCardState(
        [generateMockFile()],
        [generateMockLink()],
        initialReplies
    );

    // Keep files/links in sync with latest reply
    // (for demo, not strictly necessary unless you want editing to propagate up)
    // You can add useEffect here if you want to sync files/links with latest reply

    return (
        <AssignmentCard
            assignmentId={456}
            title="Component Design Assignment"
            description="Create a reusable button component with variants and size options."
            files={files}
            links={links}
            course={mockCourse}
            module={2}
            lesson={1}
            status="AwaitingForLongTime"
            replies={replies}
            student={mockStudent}
            groupName={mockGroup.name}
            role={role}
            linkEditIndex={linkEditIndex}
            onFileDelete={onFileDelete}
            onFileDownload={onFileDownload}
            onLinkDelete={onLinkDelete}
            onChange={onChange}
            onClickCourse={() => alert('Course clicked')}
            onClickUser={() => alert('User clicked')}
            onClickGroup={() => alert('Group clicked')}
            onClickView={() => alert('View clicked')}
            locale={locale}
        />
    );
};

// 3. AssignmentCard with a single 'resources' reply (coach)
const ResourceReplyRender: FC<{ role: Omit<role.TRole, 'visitor' | 'admin'>, locale: 'en' | 'de' }> = ({ role, locale }) => {
    const initialReplies: assignment.TAssignmentReply[] = [
        {
            replyId: Math.floor(Math.random() * 1000000),
            timestamp: new Date().toISOString(),
            sender: {
                id: 'coach-1',
                name: 'Coach Bob',
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                isCurrentUser: false,
                role: 'coach',
            },
            type: 'resources',
            comment: 'Please review these resources for your assignment.',
            files: [generateMockFile(), generateMockImage()],
            links: [
                generateMockLink({ url: 'https://storybook.js.org', title: 'Storybook Docs' }),
            ],
        }
    ];

    const {
        files, links, linkEditIndex,
        onFileDelete, onFileDownload, onLinkDelete, onChange,
        replies
    } = useAssignmentCardState(
        [generateMockFile(), generateMockImage()],
        [generateMockLink(), generateMockLink({ url: 'https://storybook.js.org', title: 'Storybook Docs', customIconUrl: '' })],
        initialReplies
    );

    return (
        <AssignmentCard
            assignmentId={789}
            title="Resource Review Assignment"
            description="Review the attached resources and update your submission accordingly."
            files={files}
            links={links}
            course={mockCourse}
            module={3}
            lesson={2}
            status="Passed"
            replies={replies}
            student={mockStudent}
            groupName={mockGroup.name}
            role={role}
            linkEditIndex={linkEditIndex}
            onFileDelete={onFileDelete}
            onFileDownload={onFileDownload}
            onLinkDelete={onLinkDelete}
            onChange={onChange}
            onClickCourse={() => alert('Course clicked')}
            onClickUser={() => alert('User clicked')}
            onClickGroup={() => alert('Group clicked')}
            onClickView={() => alert('View clicked')}
            locale={locale}
        />
    );
};

// 4. AssignmentCard with a single 'resources' reply (student)
const CurrentUserResourcesReplyRender: FC<{ role: Omit<role.TRole, 'visitor' | 'admin'>, locale: 'en' | 'de' }> = ({ role, locale }) => {
    const initialReplies: assignment.TAssignmentReply[] = [
        {
            replyId: Math.floor(Math.random() * 1000000),
            timestamp: new Date().toISOString(),
            sender: {
                id: 'student-1',
                name: 'Alice Johnson',
                image: 'https://randomuser.me/api/portraits/women/2.jpg',
                isCurrentUser: true, // <--- current user
                role: 'student',
            },
            type: 'resources',
            comment: 'Here are my files and links for the assignment!',
            files: [generateMockFile(), generateMockImage()],
            links: [
                generateMockLink({ url: 'https://storybook.js.org', title: 'Storybook Docs' }),
                generateMockLink({ url: 'https://react.dev', title: 'React Docs' }),
            ],
        }
    ];

    const {
        files, links, linkEditIndex,
        onFileDelete, onFileDownload, onLinkDelete, onChange,
        replies
    } = useAssignmentCardState(
        [generateMockFile(), generateMockImage()],
        [generateMockLink(), generateMockLink({ url: 'https://storybook.js.org', title: 'Storybook Docs', customIconUrl: '' })],
        initialReplies
    );

    return (
        <AssignmentCard
            assignmentId={987}
            title="Current User's Submission"
            description="Your latest submission with files and links."
            files={files}
            links={links}
            course={mockCourse}
            module={4}
            lesson={1}
            status="AwaitingReview"
            replies={replies}
            student={mockStudent}
            groupName={mockGroup.name}
            role={role}
            linkEditIndex={linkEditIndex}
            onFileDelete={onFileDelete}
            onFileDownload={onFileDownload}
            onLinkDelete={onLinkDelete}
            onChange={onChange}
            onClickCourse={() => alert('Course clicked')}
            onClickUser={() => alert('User clicked')}
            onClickGroup={() => alert('Group clicked')}
            onClickView={() => alert('View clicked')}
            locale={locale}
        />
    );
};


// --- Story Exports ---
export const WithoutReplies: Story = {
    render: (args) => (
        <WithoutRepliesRender
            role={args.role || 'student'}
            locale={args.locale || 'en'}
        />
    ),
    args: {
        role: 'student',
        locale: 'en',
    },
};

export const WithReplies: Story = {
    render: (args) => (
        <WithRepliesRender
            role={args.role || 'coach'}
            locale={args.locale || 'en'}
        />
    ),
    args: {
        role: 'coach',
        locale: 'en',
    },
};

export const ResourceReply: Story = {
    render: (args) => (
        <ResourceReplyRender
            role={args.role || 'coach'}
            locale={args.locale || 'en'}
        />
    ),
    args: {
        role: 'coach',
        locale: 'en',
    },
};

export const CurrentUserResourcesReply: Story = {
    render: (args) => (
        <CurrentUserResourcesReplyRender
            role={args.role || 'student'}
            locale={args.locale || 'en'}
        />
    ),
    args: {
        role: 'student',
        locale: 'en',
    },
};
