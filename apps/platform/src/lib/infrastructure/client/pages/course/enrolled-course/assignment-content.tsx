import { useState } from "react";
import { useGetAssignmentPresenter } from "../../../hooks/use-assignment-presenter";
import { trpc } from "../../../trpc/client";
import { viewModels } from "@maany_shr/e-class-models";
import { useLocale } from "next-intl";
import { TLocale } from "@maany_shr/e-class-translations";
import { DefaultError, DefaultLoading } from "@maany_shr/e-class-ui-kit";

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

    if (assignmentViewModel.mode !== "default") {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold">Assignment {assignmentId}</h2>
            <p className="mt-2">Details for student ID: {studentId}</p>
        </div>
    );
}
