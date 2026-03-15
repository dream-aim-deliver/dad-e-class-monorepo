import {
    Button,
    DefaultLoading,
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@maany_shr/e-class-ui-kit';
import React, { Suspense } from 'react';
import FeedbackContent from '../enrolled-course/feedback-content';
import { useLocale } from 'next-intl';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { trpc } from '../../../trpc/cms-client';

export interface FeedbackViewServiceConfig {
    studentUsername?: string;
    isArchived?: boolean;
}

export interface FeedbackViewService {
    getComponent: (feedbackId: string) => React.ReactNode | null;
}

export type FeedbackViewMode = 'preview' | 'study';

const FeedbackViewContext = React.createContext<
    FeedbackViewService | undefined
>(undefined);

interface FeedbackViewProviderProps {
    children: React.ReactNode;
    mode: FeedbackViewMode;
    config: FeedbackViewServiceConfig;
}

export const usePreviewFeedbackView = (): FeedbackViewService => {
    const getComponent = (_feedbackId: string): React.ReactNode | null => {
        return null;
    };

    return {
        getComponent,
    };
};

export const useStudyFeedbackView = (
    config: FeedbackViewServiceConfig,
): FeedbackViewService => {
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);
    const utils = trpc.useUtils();

    const getComponent = (feedbackId: string): React.ReactNode | null => {
        return (
            <Dialog
                open={undefined}
                onOpenChange={(open) => {
                    if (!open) {
                        // Safety net: refetch feedback data when dialog closes
                        utils.getFeedback.invalidate();
                        utils.listLessonComponents.invalidate();
                    }
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
                        <FeedbackContent
                            feedbackId={feedbackId}
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

export const FeedbackViewProvider: React.FC<FeedbackViewProviderProps> = ({
    children,
    mode,
    config,
}) => {
    const previewService = usePreviewFeedbackView();
    const studyService = useStudyFeedbackView(config);

    const service = mode === 'preview' ? previewService : studyService;

    return (
        <FeedbackViewContext.Provider value={service}>
            {children}
        </FeedbackViewContext.Provider>
    );
};

export const useFeedbackView = (): FeedbackViewService => {
    const context = React.useContext(FeedbackViewContext);
    if (!context) {
        throw new Error(
            'useFeedbackView must be used within a FeedbackViewProvider',
        );
    }
    return context;
};
