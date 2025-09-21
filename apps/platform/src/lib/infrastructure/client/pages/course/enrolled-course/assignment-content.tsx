import { useState } from 'react';
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

interface AssignmentContentProps {
    assignmentId: string;
    studentId: number;
}

export default function AssignmentContent({
    assignmentId,
    studentId,
}: AssignmentContentProps) {
    const locale = useLocale() as TLocale;

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

    if (assignmentViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const assignment = assignmentViewModel.data;

    return (
        <div className="p-4 flex flex-col gap-4">
            <AssignmentModalContent
                {...getAssignmentModalProps(assignment, locale)}
                onFileDownload={(file) => {
                    downloadFile(file.url, file.name);
                }}
            />
            {renderReplies(assignment.progress?.replies, locale)}
        </div>
    );
}

function getAssignmentModalProps(
    assignment: viewModels.TAssignmentSuccess,
    locale: TLocale,
) {
    return {
        resources: transformResources(assignment.resources),
        links: transformLinks(assignment.links),
        locale,
        title: assignment.title,
        course: {
            title: assignment.course.title,
            imageUrl: assignment.course.imageUrl,
        },
        onClickCourse: () => {
            // TODO: navigate to course by slug
        },
        group: undefined,
        onClickGroup: () => {
            // TODO: navigate to group workspace
        },
        student: assignment.progress?.student && {
            // TODO: translate 'Anonymous User'
            name: assignment.progress.student.name ?? 'Anonymous User',
            avatarUrl: assignment.progress.student.avatarUrl ?? undefined,
            isYou: false,
        },
        onClickUser: () => {
            // TODO: navigate to student profile
        },
        modulePosition: assignment.module.position,
        lessonPosition: assignment.lesson.position,
        status: AssignmentStatus.NotStarted,
        description: assignment.description,
    };
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

// Render replies as Message components
function renderReplies(
    replies: useCaseModels.TAssignmentReply[] | undefined,
    locale: TLocale,
) {
    if (!replies) return null;

    return replies.map((reply, index) => (
        <Message
            key={`reply-${index}`}
            reply={transformReplyData(reply, index)}
            onFileDownload={(file) => {
                downloadFile(file.url, file.name);
            }}
            locale={locale}
        />
    ));
}

// Transform reply data for Message component
function transformReplyData(
    reply: useCaseModels.TAssignmentReply,
    index: number,
) {
    return {
        replyId: index,
        type: 'resources' as const,
        comment: reply.comment,
        timestamp: reply.sentAt,
        sender: {
            id: reply.sender.id.toString(),
            // TODO: Handle translation for anonymous user
            name: reply.sender.name ?? 'Anonymous User',
            email: '',
            role: reply.sender.role as 'student' | 'coach',
            image: reply.sender.avatarUrl ?? '',
            isCurrentUser: false,
        },
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
