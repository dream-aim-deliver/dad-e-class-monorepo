import React, { useMemo, useState } from 'react';
import { useGetAssignmentPresenter } from '../../../hooks/use-assignment-presenter';
import { trpc } from '../../../trpc/cms-client';
import {
    fileMetadata,
    shared,
    viewModels,
} from '@maany_shr/e-class-models';
import { useLocale, useTranslations } from 'next-intl';
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
    studentUsername?: string;
    isArchived?: boolean;
}

export default function AssignmentContent({
    assignmentId,
    studentUsername,
    isArchived,
}: AssignmentContentProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.enrolledCourse');
    const session = useSession();

    const [assignmentResponse, { refetch: refetchAssignment }] =
        trpc.getAssignment.useSuspenseQuery({
            assignmentId,
            studentUsername,
        });
    const [assignmentViewModel, setAssignmentViewModel] = useState<
        viewModels.TAssignmentViewModel | undefined
    >(undefined);
    const { presenter } = useGetAssignmentPresenter(setAssignmentViewModel);

    // @ts-ignore
    presenter.present(assignmentResponse, assignmentViewModel);

    if (!assignmentViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (assignmentViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
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
                studentUsername={studentUsername}
                assignmentId={assignmentId}
                assignment={assignment}
                refetchAssignment={refetchAssignment}
                isArchived={isArchived}
            />
        </div>
    );
}

interface AssignmentInteractionProps {
    studentUsername?: string;
    assignmentId: string;
    assignment: viewModels.TAssignmentSuccess;
    refetchAssignment: () => void;
    isArchived?: boolean;
}

function AssignmentInteraction({
    studentUsername,
    assignmentId,
    assignment,
    refetchAssignment,
    isArchived,
}: AssignmentInteractionProps) {
    const locale = useLocale() as TLocale;
    const session = useSession();

    const utils = trpc.useUtils();

    const sendReplyMutation = trpc.sendAssignmentReply.useMutation();
    const passAssignmentMutation = trpc.passAssignment.useMutation();

    const [comment, setComment] = useState<string>('');
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);
    const [links, setLinks] = useState<shared.TLinkWithId[]>([]);

    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);
    const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

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
        if (!studentUsername) {
            console.error('Cannot send assignment reply: studentUsername is undefined');
            return;
        }

        sendReplyMutation.mutate(
            {
                assignmentId,
                studentUsername,
                comment: comment,
                fileIds: files.map((f) => Number(f.id)),
                links: links.map((l) => ({
                    title: l.title,
                    url: l.url,
                    iconFileId: l.customIcon?.id ? Number(l.customIcon.id) : undefined,
                })),
            },
            {
                onSuccess: async () => {
                    // Reset the form state
                    setComment('');
                    setFiles([]);
                    setLinks([]);
                    // Show success banner
                    setShowSuccessBanner(true);
                    // Auto-dismiss success banner after 5 seconds
                    setTimeout(() => {
                        setShowSuccessBanner(false);
                    }, 5000);
                    // Invalidate all affected queries to refetch fresh data
                    await Promise.all([
                        utils.getAssignment.invalidate({ assignmentId, studentUsername }),
                        utils.listStudentAssignments.invalidate(),
                        utils.listLessonComponents.invalidate({ lessonId: assignment.lesson.id, withProgress: true }),
                    ]);
                },
                onError: (error) => {
                    // TODO: set error state and display to the user
                },
            },
        );
    };

    const onClickMarkAsPassed = async () => {
        if (!studentUsername) {
            console.error('Cannot mark assignment as passed: studentUsername is undefined');
            return;
        }

        passAssignmentMutation.mutate(
            {
                assignmentId,
                studentUsername,
            },
            {
                onSuccess: async () => {
                    // Invalidate all affected queries to refetch fresh data
                    await Promise.all([
                        utils.getAssignment.invalidate({ assignmentId, studentUsername }),
                        utils.listStudentAssignments.invalidate(),
                        utils.listLessonComponents.invalidate({ lessonId: assignment.lesson.id, withProgress: true }),
                    ]);
                },
                onError: (error) => {
                    // TODO: set error state and display to the user
                },
            },
        );
    };

    const isSending =
        sendReplyMutation.isPending || passAssignmentMutation.isPending;

    const isAssignmentOwner = session.data?.user?.name === studentUsername;
    const isCoach = session.data?.user?.roles?.includes('coach');

    // Don't show reply panel if:
    // - Assignment is already passed or course is archived
    // - User is neither the assignment owner nor a coach (e.g., another student viewing)
    if (assignment.progress?.passedDetails || isArchived) {
        return null;
    }

    if (!isAssignmentOwner && !isCoach) {
        return null;
    }

    // TODO: display uploadError somewhere in the UI
    return (
        <ReplyPanel
            role={isAssignmentOwner ? 'student' : 'coach'}
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
            showSuccessBanner={showSuccessBanner}
            onCloseSuccessBanner={() => setShowSuccessBanner(false)}
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
    const handleClickCourse = () => {
        const courseUrl = `/${locale}/courses/${assignment.course.slug}`;
        window.open(courseUrl, '_blank', 'noopener,noreferrer');
    };

    const handleClickUser = () => {
        if (assignment.progress?.student?.username) {
            const userUrl = `/${locale}/student/${assignment.progress.student.username}`;
            window.open(userUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <AssignmentModalContent
            resources={transformResources(assignment.resources)}
            links={transformLinks(assignment.links)}
            locale={locale}
            title={assignment.title}
            course={{
                title: assignment.course.title,
                imageUrl: assignment.course.imageUrl ? assignment.course.imageUrl : undefined,
            }}
            onClickCourse={handleClickCourse}
            group={undefined}
            onClickGroup={() => {
                // Group functionality not yet implemented
            }}
            student={
                assignment.progress?.student && {
                    name: assignment.progress.student.name ?? '',
                    username: assignment.progress.student.username,
                    avatarUrl:
                        assignment.progress.student.avatarUrl ?? undefined,
                    isYou: false,
                }
            }
            onClickUser={handleClickUser}
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

type TAssignmentProgress = NonNullable<viewModels.TAssignmentSuccess['progress']>;

interface RepliesListProps {
    replies: TAssignmentProgress['replies'];
    passedDetails: TAssignmentProgress['passedDetails'];
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
                reply={transformReplyData(reply, currentUserId, locale)}
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
                        replyType: 'passed' as const,
                        passedAt: passedDetails.passedAt,
                        sender: passedDetails.sender,
                    }}
                    onFileDownload={(file) => {
                        downloadFile(file.url, file.name);
                    }}
                    locale={locale}
                />,
            );
        }
        return components;
    }, [replies, locale, passedDetails, currentUserId]);

    return messageComponents;
}

// Transform reply data for Message component
// Adds url field (alias for downloadUrl) and status for TFileMetadata compatibility
function transformReplyData(
    reply: TAssignmentProgress['replies'][number],
    _currentUserId: string,
    _locale: TLocale,
) {
    return {
        ...reply,
        files: reply.files.map((file) => {
            const baseFile = {
                ...file,
                url: file.downloadUrl, // Add url field for TFileMetadata compatibility
                status: 'available' as const,
            };

            // Add videoId for video files to match TFileMetadataVideo
            if (file.category === 'video') {
                return { ...baseFile, videoId: null };
            }

            return baseFile;
        }),
        links: reply.links.map((link) => ({
            ...link,
            iconFile: link.iconFile ?? null,
        })),
    };
}
