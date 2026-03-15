'use client';

import { Suspense, useState } from 'react';
import { useLocale, useTranslations , } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultError, DefaultLoading, CoachStudentInteractionCard, UserAvatar, EmptyState, Dialog, DialogContent } from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListStudentInteractionsPresenter } from '../../hooks/use-list-student-interactions-presenter';
import FeedbackContent from '../course/enrolled-course/feedback-content';

interface StudentInteractionsTabProps {
    studentUsername: string;
    courseSlug: string;
    courseImageUrl: string;
    courseTitle: string;
    expandedLessonId?: string;
}

export default function StudentInteractionsTab({
    studentUsername,
    courseSlug,
    courseImageUrl,
    courseTitle,
    expandedLessonId,
}: StudentInteractionsTabProps) {
    const locale = useLocale() as TLocale;

    const t = useTranslations('pages.student');

    const utils = trpc.useUtils();
    const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);

    const [viewModel, setViewModel] = useState<
        viewModels.TListStudentInteractionsViewModel | undefined
    >(undefined);

    const [studentInteractionsResponse] =
        trpc.listStudentInteractions.useSuspenseQuery({ studentUsername, courseSlug });

    const { presenter } = useListStudentInteractionsPresenter(setViewModel);

    //@ts-ignore
    presenter.present(studentInteractionsResponse, viewModel);

    if (!viewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (viewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    const interactions = viewModel.data;

    // Type guard to check if interactions has modules property
    const hasModules = (data: any): data is { modules: any[] } => {
        return data && typeof data === 'object' && Array.isArray(data.modules);
    };

    // If interactions doesn't have modules property, show error
    if (!hasModules(interactions)) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={interactions?.message || t('error.description')}
            />
        );
    }

    // Filter modules to only include those with lessons that have interactions
    const modulesWithInteractions = interactions.modules
        .map(module => ({
            ...module,
            lessons: module.lessons?.filter(lesson =>
                lesson.interactions && lesson.interactions.length > 0
            ) || []
        }))
        .filter(module => module.lessons.length > 0);

    // Show empty state if no interactions found
    if (modulesWithInteractions.length === 0) {
        return (
            <EmptyState
                locale={locale}
                message={t('noInteractionsFound')}
            />
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <h2 className="md:text-3xl text-xl text-text-primary font-bold">
                    {t('studentInteractions')}
                </h2>
                <hr className="flex-grow border-t border-divider" />
                <div className="flex flex-col gap-4 px-4 py-6 rounded-medium">
                    <div className='flex items-center gap-2'>
                        <UserAvatar
                            fullName={courseTitle}
                            size="medium"
                            imageUrl={courseImageUrl}
                            className='rounded-medium'
                        />
                        <h3 className='text-text-primary md:text-2xl text-lg font-bold'>
                            {courseTitle}
                        </h3>
                    </div>
                    <CoachStudentInteractionCard
                        modules={modulesWithInteractions}
                        locale={locale}
                        expandedLessonId={expandedLessonId}
                        onViewLessonsClick={(_moduleId: string, lessonId: string) => {
                            window.open(`/${locale}/courses/${courseSlug}?role=coach&tab=preview&lesson=${lessonId}`, '_blank');
                        }}
                        onFeedbackClick={(feedbackId: string) => {
                            setSelectedFeedbackId(feedbackId);
                        }}
                        onDeserializationError={(message: string, error: Error) => {
                            console.error(message, error);
                        }}
                    />
                </div>
            </div>
            {selectedFeedbackId && (
                <Dialog
                    open={!!selectedFeedbackId}
                    defaultOpen={false}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedFeedbackId(null);
                            // Safety net: refetch feedback data when dialog closes
                            utils.getFeedback.invalidate();
                            utils.listStudentInteractions.invalidate();
                        }
                    }}
                >
                    <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
                        <Suspense fallback={<DefaultLoading locale={locale} />}>
                            <FeedbackContent
                                feedbackId={selectedFeedbackId}
                                studentUsername={studentUsername}
                            />
                        </Suspense>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}