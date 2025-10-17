import React, { useMemo, useState } from 'react';
import { useGetAssignmentPresenter } from '../../../hooks/use-assignment-presenter';
import { trpc } from '../../../trpc/client';
import {
    fileMetadata,
    shared,
    useCaseModels,
    viewModels,
} from '@maany_shr/e-class-models';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    AssignmentModalContent,
    AssignmentStatus,
    DefaultError,
    DefaultLoading,
    downloadFile,
    Message,
    ReplyPanel,
} from '@maany_shr/e-class-ui-kit';
import { useSession } from 'next-auth/react';
import { useRealProgressUpload } from '../utils/file-upload';

interface AssignmentContentProps {
    assignmentId: string;
    studentId: number;
}

export default function AssignmentContent({
    assignmentId,
    studentId,
}: AssignmentContentProps) {
    const locale = useLocale() as TLocale;
    const session = useSession();

    const [assignmentResponse, { refetch: refetchAssignment }] =
        trpc.getAssignment.useSuspenseQuery({
            assignmentId,
            studentId,
        });
    const [assignmentViewModel, setAssignmentViewModel] = useState<
        viewModels.TAssignmentViewModel | undefined
    >(undefined);
    const { presenter } = useGetAssignmentPresenter(setAssignmentViewModel);
    presenter.present(assignmentResponse, assignmentViewModel);

    if (!assignmentViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (assignmentViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const assignment = assignmentViewModel.data;

    return (
        <div className="p-4 flex flex-col gap-4">
            <AssignmentModalWrapper assignment={assignment} locale={locale} />
            {assignment.progress && (
                <RepliesList
                    replies={assignment.progress.replies}
                    passedDetails={assignment.progress.passedDetails}
                    locale={locale}
                    currentUserId={session.data?.user?.id || ''}
                />
            )}
            <AssignmentInteraction
                studentId={studentId}
                assignmentId={assignmentId}
                assignment={assignment}
                refetchAssignment={refetchAssignment}
            />
        </div>
    );
}

interface AssignmentInteractionProps {
    studentId: number;
    assignmentId: string;
    assignment: viewModels.TAssignmentSuccess;
    refetchAssignment: () => void;
}

function AssignmentInteraction({
    studentId,
    assignmentId,
    assignment,
    refetchAssignment,
}: AssignmentInteractionProps) {
    const locale = useLocale() as TLocale;
    const session = useSession();

    const sendReplyMutation = trpc.sendAssignmentReply.useMutation();
    const passAssignmentMutation = trpc.passAssignment.useMutation();

    const [comment, setComment] = useState<string>('');
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);
    const [links, setLinks] = useState<shared.TLinkWithId[]>([]);

    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    const { uploadFile, uploadError } = useRealProgressUpload({
        lessonId: assignment.lesson.id,
    });

    const onFileDownload = (id: string) => {
        const file = files.find((f) => f.id === id);
        if (!file) return;
        downloadFile(file.url, file.name);
    };

    const onFileDelete = (fileId: string) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    };

    const onFileChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        const result = await uploadFile(file, assignmentId, abortSignal);
        if (!result) {
            // TODO: translate error message
            throw new Error('File upload failed');
        }
        return result;
    };

    const onUploadComplete = (file: fileMetadata.TFileMetadata) => {
        setFiles((prevFiles) => [...prevFiles, file]);
    };

    const onLinkDelete = (index: number) => {
        setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
        setLinkEditIndex(null);
    };

    const onDeleteIcon = (index: number) => {
        setLinks((prevLinks) =>
            prevLinks.map((link, i) =>
                i === index ? { ...link, customIcon: undefined } : link,
            ),
        );
    };

    const onClickEditLink = (index: number) => {
        setLinkEditIndex(index);
    };

    const onCreateLink = () => {
        setLinks((prevLinks) => [...prevLinks, getExampleLink()]);
    };

    const onSaveLink = (link: shared.TLinkWithId, index: number) => {
        setLinks((prevLinks) =>
            prevLinks.map((l, i) => (i === index ? link : l)),
        );
        setLinkEditIndex(null);
    };

    const onLinkDiscard = () => {
        setLinkEditIndex(null);
    };

    const onClickSendMessage = async () => {
        sendReplyMutation.mutate(
            {
                assignmentId,
                studentId,
                comment: comment,
                fileIds: files.map((f) => Number(f.id)),
                links: links.map((l) => ({
                    title: l.title,
                    url: l.url,
                    iconFileId: Number(l.customIcon?.id),
                })),
            },
            {
                onSuccess: () => {
                    // Reset the form state
                    setComment('');
                    setFiles([]);
                    setLinks([]);
                    refetchAssignment();
                },
                onError: (error) => {
                    // TODO: set error state and display to the user
                },
            },
        );
    };

    const onClickMarkAsPassed = async () => {
        passAssignmentMutation.mutate(
            {
                assignmentId,
                studentId,
            },
            {
                onSuccess: () => {
                    refetchAssignment();
                },
                onError: (error) => {
                    // TODO: set error state and display to the user
                },
            },
        );
    };

    const isSending =
        sendReplyMutation.isPending || passAssignmentMutation.isPending;

    const isStudent = session.data?.user?.id === studentId.toString();

    // TODO: display uploadError somewhere in the UI
    return (
        <ReplyPanel
            role={isStudent ? 'student' : 'coach'}
            comment={comment}
            files={files}
            links={links}
            linkEditIndex={linkEditIndex}
            onChangeComment={setComment}
            onFileDownload={onFileDownload}
            onFileDelete={onFileDelete}
            onFilesChange={onFileChange}
            onImageChange={onFileChange}
            onDeleteIcon={onDeleteIcon}
            onUploadComplete={onUploadComplete}
            onCreateLink={onSaveLink}
            onClickEditLink={onClickEditLink}
            onLinkDelete={onLinkDelete}
            onLinkDiscard={onLinkDiscard}
            onClickAddLink={onCreateLink}
            locale={locale}
            onClickSendMessage={onClickSendMessage}
            onClickMarkAsPassed={onClickMarkAsPassed}
            isSending={isSending}
        />
    );
}

function getExampleLink() {
    return {
        linkId: Date.now(), // Unique ID for the link
        title: 'New Link',
        url: 'https://example.com',
    };
}

interface AssignmentModalWrapperProps {
    assignment: viewModels.TAssignmentSuccess;
    locale: TLocale;
}

function AssignmentModalWrapper({
    assignment,
    locale,
}: AssignmentModalWrapperProps) {
    return (
        <AssignmentModalContent
            resources={transformResources(assignment.resources)}
            links={transformLinks(assignment.links)}
            locale={locale}
            title={assignment.title}
            course={{
                title: assignment.course.title,
                imageUrl: assignment.course.imageUrl,
            }}
            onClickCourse={() => {
                // TODO: navigate to course by slug
            }}
            group={undefined}
            onClickGroup={() => {
                // TODO: navigate to group workspace
            }}
            student={
                assignment.progress?.student && {
                    // TODO: translate 'Anonymous User'
                    name: assignment.progress.student.name ?? 'Anonymous User',
                    avatarUrl:
                        assignment.progress.student.avatarUrl ?? undefined,
                    isYou: false,
                }
            }
            onClickUser={() => {
                // TODO: navigate to student profile
            }}
            modulePosition={assignment.module.position}
            lessonPosition={assignment.lesson.position}
            status={AssignmentStatus.NotStarted}
            description={assignment.description}
            onFileDownload={(file) => {
                downloadFile(file.url, file.name);
            }}
        />
    );
}

// Transform resources to the expected format
function transformResources(
    resources: viewModels.TAssignmentSuccess['resources'],
) {
    return resources.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        category: 'generic' as const,
        url: file.downloadUrl,
        status: 'available' as const,
        thumbnailUrl: file.downloadUrl,
    }));
}

// Transform links to the expected format
function transformLinks(links: viewModels.TAssignmentSuccess['links']) {
    return links.map((link) => ({
        title: link.title,
        url: link.url,
        customIcon: link.iconFile
            ? {
                  ...link.iconFile,
                  status: 'available' as const,
                  url: link.iconFile.downloadUrl,
                  thumbnailUrl: link.iconFile.downloadUrl,
              }
            : undefined,
    }));
}

interface RepliesListProps {
    replies: useCaseModels.TAssignmentReply[];
    passedDetails: useCaseModels.TAssignmentPassedData | undefined;
    locale: TLocale;
    currentUserId: string;
}

// Render replies as Message components
function RepliesList({
    replies,
    passedDetails,
    locale,
    currentUserId,
}: RepliesListProps) {
    const messageComponents: React.ReactNode[] = useMemo(() => {
        const components = replies.map((reply, index) => (
            <Message
                key={`reply-${index}`}
                reply={{
                    replyId: index,
                    ...transformReplyData(reply, currentUserId, locale),
                }}
                onFileDownload={(file) => {
                    downloadFile(file.url, file.name);
                }}
                locale={locale}
            />
        ));
        if (passedDetails) {
            components.push(
                <Message
                    key={`reply-passed`}
                    reply={{
                        replyId: replies.length,
                        timestamp: passedDetails.passedAt,
                        type: 'passed',
                        sender: transformReplySender(
                            passedDetails.sender,
                            currentUserId,
                            locale,
                        ),
                    }}
                    onFileDownload={(file) => {
                        downloadFile(file.url, file.name);
                    }}
                    locale={locale}
                />,
            );
        }
        return components;
    }, [replies, locale, passedDetails]);

    return messageComponents;
}

// Transform reply data for Message component
function transformReplyData(
    reply: useCaseModels.TAssignmentReply,
    currentUserId: string,
    locale: TLocale,
) {
    return {
        type: 'resources' as const,
        comment: reply.comment,
        timestamp: reply.sentAt,
        sender: transformReplySender(reply.sender, currentUserId, locale),
        files: reply.files.map((file: any) => ({
            ...file,
            category: 'generic' as const,
            status: 'available' as const,
            url: file.downloadUrl,
        })),
        links: reply.links.map((link: any, linkIndex: number) => ({
            linkId: linkIndex,
            title: link.title,
            url: link.url,
            customIcon: link.iconFile
                ? {
                      ...link.iconFile,
                      status: 'available' as const,
                      url: link.iconFile.downloadUrl,
                      thumbnailUrl: link.iconFile.downloadUrl,
                  }
                : undefined,
        })),
    };
}

function transformReplySender(
    sender: useCaseModels.TAssignmentReply['sender'],
    currentUserId: string,
    locale: TLocale,
) {
    // TODO: Handle translation for anonymous user
    // TODO: Determine if the sender is the current user
    return {
        id: sender.id.toString(),
        name: sender.name ?? 'Anonymous User',
        email: '',
        role: sender.role as 'student' | 'coach',
        image: sender.avatarUrl ?? '',
        isCurrentUser: sender.id.toString() === currentUserId,
    };
}
