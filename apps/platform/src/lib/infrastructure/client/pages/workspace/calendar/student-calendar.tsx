'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { trpc } from '../../../trpc/client';
import React, { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListStudentCoachingSessionsPresenter } from '../../../hooks/use-list-student-coaching-sessions-presenter';

export default function StudentCalendar() {
    const locale = useLocale() as TLocale;
    const [listStudentCoachingSessionsResponse] = trpc.listStudentCoachingSessions.useSuspenseQuery({});
    const [studentCoachingSessionsViewModel, setStudentCoachingSessionsViewModel] =
        useState<viewModels.TStudentCoachingSessionsListViewModel | undefined>(undefined);
    const { presenter } = useListStudentCoachingSessionsPresenter(
        setStudentCoachingSessionsViewModel,
    );
    presenter.present(listStudentCoachingSessionsResponse, studentCoachingSessionsViewModel);

    // TODO: Implement mapping sessions to calendar

    return <div>
        Student
    </div>;
}