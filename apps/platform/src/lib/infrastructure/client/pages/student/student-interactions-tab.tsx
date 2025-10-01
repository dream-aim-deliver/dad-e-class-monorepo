'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
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
        <div className="space-y-4">
                    <h2>Students Interactions</h2>
        </div>
    );
}
