import React, { useMemo, useState } from 'react';
import { useGetAssignmentPresenter } from '../../../hooks/use-assignment-presenter';
import { trpc } from '../../../trpc/client';
import {
    fileMetadata,
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
} from '@maany_shr/e-class-ui-kit';
import { useSession } from 'next-auth/react';

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

    const [assignmentResponse] = trpc.getAssignment.useSuspenseQuery({
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

    if (
        assignmentViewModel.mode !== 'default' ||
        !assignmentViewModel.data.progress
    ) {
        return <DefaultError locale={locale} />;
    }

    const assignment = assignmentViewModel.data;

    return (
        <div className="p-4 flex flex-col gap-4">
            <AssignmentModalWrapper
                assignment={assignment}
                locale={locale}
            />
            {assignment.progress && (
                <RepliesList
                    replies={assignment.progress.replies}
                    passedDetails={assignment.progress.passedDetails}
                    locale={locale}
                />
            )}
        </div>
    );
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
}

// Render replies as Message components
function RepliesList({ replies, passedDetails, locale }: RepliesListProps) {
    const messageComponents: React.ReactNode[] = useMemo(() => {
        const components = replies.map((reply, index) => (
            <Message
                key={`reply-${index}`}
                reply={{
                    replyId: index,
                    ...transformReplyData(reply, locale),
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
    locale: TLocale,
) {
    return {
        type: 'resources' as const,
        comment: reply.comment,
        timestamp: reply.sentAt,
        sender: transformReplySender(reply.sender, locale),
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
        isCurrentUser: false,
    };
}
