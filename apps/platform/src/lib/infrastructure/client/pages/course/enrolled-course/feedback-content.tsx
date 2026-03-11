import React, { useMemo, useState } from 'react';
import { useGetFeedbackPresenter } from '../../../hooks/use-feedback-presenter';
import { trpc } from '../../../trpc/cms-client';
import {
    fileMetadata,
    shared,
    viewModels,
} from '@maany_shr/e-class-models';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    DefaultError,
    DefaultLoading,
    downloadFile,
    FeedbackModalContent,
    FeedbackReplyPanel,
    Message,
} from '@maany_shr/e-class-ui-kit';
import { useSession } from 'next-auth/react';
import { useRealProgressUpload } from '../utils/file-upload';


interface FeedbackContentProps {
    feedbackId: string;
    studentUsername?: string;
    isArchived?: boolean;
}

export default function FeedbackContent({
    feedbackId,
    studentUsername,
    isArchived,
}: FeedbackContentProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.enrolledCourse');
    const session = useSession();

    const [feedbackResponse] =
        trpc.getFeedback.useSuspenseQuery({
            feedbackId,
            studentUsername,
        });
    const [feedbackViewModel, setFeedbackViewModel] = useState<
        viewModels.TFeedbackViewModel | undefined
    >(undefined);
    const { presenter } = useGetFeedbackPresenter(setFeedbackViewModel);

    // @ts-ignore
    presenter.present(feedbackResponse, feedbackViewModel);

    if (!feedbackViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (feedbackViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    const feedback = feedbackViewModel.data;

    return (
        <div className="p-4 flex flex-col gap-4">
            <FeedbackModalWrapper feedback={feedback} locale={locale} />
            {feedback.progress && (
                <RepliesList
                    replies={feedback.progress.replies}
                    locale={locale}
                    currentUserId={session.data?.user?.id || ''}
                />
            )}
            <FeedbackInteraction
                studentUsername={studentUsername}
                feedbackId={feedbackId}
                feedback={feedback}
                isArchived={isArchived}
            />
        </div>
    );
}

interface FeedbackInteractionProps {
    studentUsername?: string;
    feedbackId: string;
    feedback: viewModels.TFeedbackSuccess;
    isArchived?: boolean;
}

function FeedbackInteraction({
    studentUsername,
    feedbackId,
    feedback,
    isArchived,
}: FeedbackInteractionProps) {
    const locale = useLocale() as TLocale;
    const session = useSession();

    const utils = trpc.useUtils();

    const sendReplyMutation = trpc.sendFeedbackReply.useMutation({
        onSuccess: async (_data, variables) => {
            // Cache-scoped: always fires even if component unmounts (dialog closed)
            await Promise.all([
                utils.getFeedback.invalidate({ feedbackId: variables.feedbackId, studentUsername: variables.studentUsername }),
                utils.listStudentInteractions.invalidate(),
                utils.listLessonComponents.invalidate(),
            ]);
        },
    });

    const [comment, setComment] = useState<string>('');
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);
    const [links, setLinks] = useState<shared.TLinkWithId[]>([]);

    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);
    const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);
    const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false);

    const { uploadFile, uploadError } = useRealProgressUpload({
        lessonId: feedback.lesson.id,
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
        const result = await uploadFile(file, feedbackId, abortSignal);
        if (!result) {
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
            console.error('Cannot send feedback reply: studentUsername is undefined');
            return;
        }

        setShowErrorBanner(false);
        sendReplyMutation.mutate(
            {
                feedbackId,
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
                onSuccess: () => {
                    // Component-scoped: only fires if still mounted (UI state updates)
                    setComment('');
                    setFiles([]);
                    setLinks([]);
                    setShowSuccessBanner(true);
                    setTimeout(() => {
                        setShowSuccessBanner(false);
                    }, 5000);
                },
                onError: () => {
                    setShowErrorBanner(true);
                },
            },
        );
    };

    const isSending = sendReplyMutation.isPending;

    const isFeedbackOwner = session.data?.user?.name === studentUsername;
    const isCoach = session.data?.user?.roles?.includes('coach');

    // Don't show reply panel if course is archived or user is neither owner nor coach
    if (isArchived) {
        return null;
    }

    if (!isFeedbackOwner && !isCoach) {
        return null;
    }

    return (
        <FeedbackReplyPanel
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
            isSending={isSending}
            showSuccessBanner={showSuccessBanner}
            onCloseSuccessBanner={() => setShowSuccessBanner(false)}
            showErrorBanner={showErrorBanner || !!uploadError}
            onCloseErrorBanner={() => setShowErrorBanner(false)}
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

interface FeedbackModalWrapperProps {
    feedback: viewModels.TFeedbackSuccess;
    locale: TLocale;
}

function FeedbackModalWrapper({
    feedback,
    locale,
}: FeedbackModalWrapperProps) {
    const handleClickCourse = () => {
        const courseUrl = `/${locale}/courses/${feedback.course.slug}`;
        window.open(courseUrl, '_blank', 'noopener,noreferrer');
    };

    const handleClickUser = () => {
        if (feedback.progress?.student?.username) {
            const userUrl = `/${locale}/student/${feedback.progress.student.username}`;
            window.open(userUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <FeedbackModalContent
            resources={transformResources(feedback.resources)}
            links={transformLinks(feedback.links)}
            locale={locale}
            title={feedback.title}
            course={{
                title: feedback.course.title,
                imageUrl: feedback.course.imageUrl ? feedback.course.imageUrl : undefined,
            }}
            onClickCourse={handleClickCourse}
            student={
                feedback.progress?.student && {
                    name: feedback.progress.student.name ?? '',
                    username: feedback.progress.student.username,
                    avatarUrl:
                        feedback.progress.student.avatarUrl ?? undefined,
                }
            }
            onClickUser={handleClickUser}
            modulePosition={feedback.module.position}
            lessonPosition={feedback.lesson.position}
            description={feedback.description}
            onFileDownload={(file) => {
                downloadFile(file.url, file.name);
            }}
        />
    );
}

// Transform resources to the expected format
function transformResources(
    resources: viewModels.TFeedbackSuccess['resources'],
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
function transformLinks(links: viewModels.TFeedbackSuccess['links']) {
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

type TFeedbackProgress = NonNullable<viewModels.TFeedbackSuccess['progress']>;

interface RepliesListProps {
    replies: TFeedbackProgress['replies'];
    locale: TLocale;
    currentUserId: string;
}

// Render replies as Message components
function RepliesList({
    replies,
    locale,
    currentUserId,
}: RepliesListProps) {
    const messageComponents: React.ReactNode[] = useMemo(() => {
        return replies.map((reply, index) => (
            <Message
                key={`reply-${index}`}
                reply={transformReplyData(reply, currentUserId, locale)}
                onFileDownload={(file) => {
                    downloadFile(file.url, file.name);
                }}
                locale={locale}
            />
        ));
    }, [replies, locale, currentUserId]);

    return messageComponents;
}

// Transform reply data for Message component
// Adds url field (alias for downloadUrl) and status for TFileMetadata compatibility
function transformReplyData(
    reply: TFeedbackProgress['replies'][number],
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
