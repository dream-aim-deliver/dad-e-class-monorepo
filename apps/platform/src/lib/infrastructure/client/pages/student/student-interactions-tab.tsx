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
}

export default function StudentInteractionsTab({
    studentId,
    courseSlug,
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

    return (
        <div className="flex flex-col gap-4">
            <p className="text-3xl text-text-primary font-semibold">
                {t('studentInteractions')}
            </p>
            <div className="flex flex-col gap-4 bg-card-fill border border-card-stroke px-4 py-6 rounded-medium">
                <div className='flex items-center gap-2'>
                    <UserAvatar
                        fullName={courseSlug}
                        size="medium"
                    />
                    <p className='text-text-primary text-2xl font-semibold'>
                        {courseSlug}
                    </p>
                </div>
                <hr className="flex-grow border-t border-divider" /> 
                <CoachStudentInteractionCard
                    modules={interactions?.modules || []}
                    courseSlug={courseSlug}
                    locale={locale}
                    onViewLessonsClick={(moduleId: string, lessonId: string) => {
                        // Handle view lessons click
                        console.log('View lessons for module:', moduleId, 'lesson:', lessonId);
                    }}
                />
            </div>
        </div>
    );
}
