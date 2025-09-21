import { useState } from 'react';
import { useGetAssignmentPresenter } from '../../../hooks/use-assignment-presenter';
import { trpc } from '../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    AssignmentModalContent,
    AssignmentStatus,
    DefaultError,
    DefaultLoading,
    downloadFile,
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
                resources={assignment.resources.map((file) => ({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    category: 'generic', // TODO: find a way to pass category
                    url: file.downloadUrl,
                    status: 'available',
                    thumbnailUrl: file.downloadUrl,
                }))}
                links={assignment.links.map((link) => ({
                    title: link.title,
                    url: link.url,
                    customIcon: link.iconFile
                        ? {
                              ...link.iconFile,
                              status: 'available',
                              url: link.iconFile?.downloadUrl,
                              thumbnailUrl: link.iconFile?.downloadUrl,
                          }
                        : undefined,
                }))}
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
                        name:
                            assignment.progress.student.name ??
                            'Anonymous User',
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
        </div>
    );
}
