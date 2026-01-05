'use client';

import { Dialog, DialogContent, DialogBody, DefaultLoading, DefaultError } from '@maany_shr/e-class-ui-kit';
import { BuyCourseCoachingSessions } from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useState, useEffect } from 'react';
import { useListCourseCoachingSessionPurchaseStatusPresenter } from '../../../hooks/use-list-course-coaching-session-purchase-status-presenter';
import { useListCoachingOfferingsPresenter } from '../../../hooks/use-coaching-offerings-presenter';

interface BuyCourseCoachingSessionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseSlug: string;
    locale: TLocale;
    onPurchase: (lessonComponentIds: string[]) => void;
}

export default function BuyCourseCoachingSessionsModal({
    isOpen,
    onClose,
    courseSlug,
    locale,
    onPurchase,
}: BuyCourseCoachingSessionsModalProps) {
    const [coachingSessionsResponse] =
        trpc.listCourseCoachingSessionPurchaseStatus.useSuspenseQuery({
            courseSlug,
        });

    const [coachingSessionsViewModel, setCoachingSessionsViewModel] = useState<
        viewModels.TListCourseCoachingSessionPurchaseStatusViewModel | undefined
    >(undefined);
    const { presenter } = useListCourseCoachingSessionPurchaseStatusPresenter(
        setCoachingSessionsViewModel,
    );

    const [coachingOfferingsResponse] =
        trpc.listCoachingOfferings.useSuspenseQuery({});

    const [coachingOfferingsViewModel, setCoachingOfferingsViewModel] = useState<
        viewModels.TCoachingOfferingListViewModel | undefined
    >(undefined);
    const { presenter: coachingOfferingsPresenter } = useListCoachingOfferingsPresenter(
        setCoachingOfferingsViewModel,
    );

    useEffect(() => {
        if (coachingSessionsResponse && presenter) {
            // @ts-ignore - Type mismatch between TRPC response wrapper and presenter input
            presenter.present(coachingSessionsResponse, coachingSessionsViewModel);
        }
    }, [coachingSessionsResponse, presenter, coachingSessionsViewModel]);

    useEffect(() => {
        if (coachingOfferingsResponse && coachingOfferingsPresenter) {
            // @ts-ignore - Type mismatch between TRPC response wrapper and presenter input
            coachingOfferingsPresenter.present(coachingOfferingsResponse, coachingOfferingsViewModel);
        }
    }, [coachingOfferingsResponse, coachingOfferingsPresenter, coachingOfferingsViewModel]);

    if (!isOpen) {
        return null;
    }

    if (!coachingSessionsViewModel || !coachingOfferingsViewModel) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
                <DialogContent
                    showCloseButton={true}
                    closeOnOverlayClick={true}
                    closeOnEscape={true}
                    className="max-w-2xl max-h-[60vh] overflow-y-auto"
                >
                    <DialogBody className="p-6">
                        <DefaultLoading locale={locale} variant="minimal" />
                    </DialogBody>
                </DialogContent>
            </Dialog>
        );
    }

    // If there is an error, show error state
    if (coachingSessionsViewModel.mode !== 'default' || coachingOfferingsViewModel.mode !== 'default') {
        const errorViewModel = coachingSessionsViewModel.mode !== 'default' 
            ? coachingSessionsViewModel 
            : coachingOfferingsViewModel;
        
        const errorMessage = errorViewModel.mode === 'kaboom' 
            ? errorViewModel.data.message 
            : 'Failed to load data';
        
        return (
            <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
                <DialogContent
                    showCloseButton={true}
                    closeOnOverlayClick={true}
                    closeOnEscape={true}
                    className="max-w-2xl max-h-[60vh] overflow-y-auto"
                >
                    <DialogBody className="p-6">
                        <DefaultError
                            locale={locale}
                            title="Error"
                            description={errorMessage}
                            onRetry={() => {
                                // Retry logic can be added here if needed
                            }}
                        />
                    </DialogBody>
                </DialogContent>
            </Dialog>
        );
    }

    const coachingSessions = coachingSessionsViewModel.data.coachingSessions || [];
    const coachingOfferings = coachingOfferingsViewModel.data.offerings || [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
            <DialogContent
                showCloseButton={true}
                closeOnOverlayClick={true}
                closeOnEscape={true}
                className="max-w-2xl max-h-[60vh] flex flex-col"
            >
                <DialogBody className="p-6 overflow-y-auto flex-1">
                    <BuyCourseCoachingSessions
                        coachingSessions={coachingSessions}
                        coachingOfferings={coachingOfferings}
                        onPurchase={onPurchase}
                        onClose={onClose}
                        locale={locale}
                    />
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

