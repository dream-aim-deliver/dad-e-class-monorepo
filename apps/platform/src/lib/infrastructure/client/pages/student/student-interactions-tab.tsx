'use client';

import { useState } from 'react';
import { useLocale, useTranslations , } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultError, DefaultLoading, CoachStudentInteractionCard, UserAvatar } from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListStudentInteractionsPresenter } from '../../hooks/use-list-student-interactions-presenter';

interface StudentInteractionsTabProps {
    studentId: number;
    courseSlug: string;
    courseImageUrl: string;
    courseTitle: string;
}

export default function StudentInteractionsTab({
    studentId,
    courseSlug,
    courseImageUrl,
    courseTitle,
}: StudentInteractionsTabProps) {
    const locale = useLocale() as TLocale;

    const t = useTranslations('pages.student');

    const [viewModel, setViewModel] = useState<
        viewModels.TListStudentInteractionsViewModel | undefined
    >(undefined);

    const [studentInteractionsResponse] =
        trpc.listStudentInteractions.useSuspenseQuery({ studentId, courseSlug });

    const { presenter } = useListStudentInteractionsPresenter(setViewModel);

    //@ts-ignore
    presenter.present(studentInteractionsResponse, viewModel);

    if (!viewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (viewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const interactions = viewModel.data;

    // Type guard to check if interactions has modules property
    const hasModules = (data: any): data is { modules: any[] } => {
        return data && typeof data === 'object' && Array.isArray(data.modules);
    };

    // If interactions doesn't have modules property, show error
    if (!hasModules(interactions)) {
        return (
            <DefaultError locale={locale} description={interactions?.message} />
        );
    }

    // Filter modules to only include those with lessons that have interactions
    const modulesWithInteractions = interactions.modules
        .map(module => ({
            ...module,
            lessons: module.lessons?.filter(lesson =>
                lesson.textInputs && lesson.textInputs.length > 0
            ) || []
        }))
        .filter(module => module.lessons.length > 0);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="md:text-3xl text-xl text-text-primary font-bold">
                {t('studentInteractions')}
            </h2>
            <div className="flex flex-col gap-4 bg-card-fill border border-card-stroke px-4 py-6 rounded-medium">
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
                <hr className="flex-grow border-t border-divider" />
                <CoachStudentInteractionCard
                    modules={modulesWithInteractions}
                    locale={locale}
                    onViewLessonsClick={(moduleId: string, lessonId: string) => {
                        // TODO: handle view lessons click
                        console.log('View lessons for module:', moduleId, 'lesson:', lessonId);
                    }}
                    onDeserializationError={(message: string, error: Error) => {
                        console.error(message, error);
                    }}
                />
            </div>
        </div>
    );
}