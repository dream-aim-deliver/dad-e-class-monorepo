"use client";

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale } from "next-intl";
import { useState } from "react";
import { trpc } from "../../trpc/client";
import { viewModels } from "@maany_shr/e-class-models";
import { useListStudentCoachingSessionsPresenter } from "../../hooks/use-list-student-coaching-sessions-presenter";

export default function StudentCoachingSessions() {
    const locale = useLocale() as TLocale;

    const [studentCoachingSessionsResponse] = trpc.listStudentCoachingSessions.useSuspenseQuery({});
    
    const [studentCoachingSessionsViewModel, setStudentCoachingSessionsViewModel] = useState<
        viewModels.TStudentCoachingSessionsListViewModel | undefined
    >(undefined);

    const { presenter } = useListStudentCoachingSessionsPresenter(
        setStudentCoachingSessionsViewModel,
    );

    presenter.present(studentCoachingSessionsResponse, studentCoachingSessionsViewModel);

    return <div>Student Coaching Sessions</div>;
}