import React from 'react';

export interface AssignmentViewServiceConfig {
    studentId: number;
}

export interface AssignmentViewService {
    getComponent: (assignmentId: string) => React.ReactNode | null;
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
    const getComponent = (assignmentId: string): React.ReactNode | null => {
        return null;
    };

    return {
        getComponent,
    };
};

export const useStudyAssignmentView = (
    config: AssignmentViewServiceConfig,
): AssignmentViewService => {
    const getComponent = (assignmentId: string): React.ReactNode | null => {
        return (
            <div>
                Assignment {assignmentId} for student {config.studentId}
            </div>
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
    const service =
        mode === 'preview'
            ? usePreviewAssignmentView()
            : useStudyAssignmentView(config);

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
