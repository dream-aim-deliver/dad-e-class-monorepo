import {
    Button,
    DefaultLoading,
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@maany_shr/e-class-ui-kit';
import React, { Suspense } from 'react';
import AssignmentContent from '../enrolled-course/assignment-content';
import { useLocale } from 'next-intl';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
export interface AssignmentViewServiceConfig {
    studentUsername?: string;
    isArchived?: boolean;
    courseSlug?: string;
}

export interface AssignmentViewService {
    getComponent: (assignmentId: string, options?: { hasCoachInteracted?: boolean }) => React.ReactNode | null;
}

export type AssignmentViewMode = 'preview' | 'study';

const AssignmentViewContext = React.createContext<
    AssignmentViewService | undefined
>(undefined);

interface AssignmentViewProviderProps {
    children: React.ReactNode;
    mode: AssignmentViewMode;
    config: AssignmentViewServiceConfig;
}

export const usePreviewAssignmentView = (): AssignmentViewService => {
    const getComponent = (_assignmentId: string, _options?: { hasCoachInteracted?: boolean }): React.ReactNode | null => {
        return null;
    };

    return {
        getComponent,
    };
};

export const useStudyAssignmentView = (
    config: AssignmentViewServiceConfig,
): AssignmentViewService => {
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);

    const getComponent = (assignmentId: string, options?: { hasCoachInteracted?: boolean }): React.ReactNode | null => {
        if (options?.hasCoachInteracted && config.courseSlug) {
            return (
                <Button
                    text={dictionary.components.assignment.assignmentCard.viewText}
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                        window.location.assign(`/${locale}/courses/${config.courseSlug}?tab=assignments&role=student`);
                    }}
                />
            );
        }

        return (
            <Dialog
                open={undefined}
                onOpenChange={() => {
                    // This function is called when the dialog is opened or closed
                }}
                defaultOpen={false}
            >
                <DialogTrigger asChild className="w-full">
                    <Button text={dictionary.components.assignment.assignmentCard.viewText} variant="secondary" />
                </DialogTrigger>
                <DialogContent
                    showCloseButton
                    closeOnOverlayClick
                    closeOnEscape
                >
                    <Suspense fallback={<DefaultLoading locale={locale} />}>
                        <AssignmentContent
                            assignmentId={assignmentId}
                            studentUsername={config.studentUsername}
                            isArchived={config.isArchived}
                        />
                    </Suspense>
                </DialogContent>
            </Dialog>
        );
    };

    return {
        getComponent,
    };
};

export const AssignmentViewProvider: React.FC<AssignmentViewProviderProps> = ({
    children,
    mode,
    config,
}) => {
    const previewService = usePreviewAssignmentView();
    const studyService = useStudyAssignmentView(config);

    const service = mode === 'preview' ? previewService : studyService;

    return (
        <AssignmentViewContext.Provider value={service}>
            {children}
        </AssignmentViewContext.Provider>
    );
};

export const useAssignmentView = (): AssignmentViewService => {
    const context = React.useContext(AssignmentViewContext);
    if (!context) {
        throw new Error(
            'useAssignmentView must be used within an AssignmentViewProvider',
        );
    }
    return context;
};
