'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { LessonNoteBuilderView, DefaultLoading, ConfirmationModal } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { trpc } from '../../../trpc/cms-client';

interface LessonNotesPanelProps {
    lessonId: number;
}

export default function LessonNotesPanel({ lessonId }: LessonNotesPanelProps) {
    // TRPC utils for query invalidation
    const utils = trpc.useUtils();

    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.lessonNotes');

    // Error modal state
    const [errorModal, setErrorModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
    });

    // Query for getting the lesson note
    const { data: noteData, isLoading: isLoadingNote } = trpc.getLessonNote.useQuery(
        { lessonId },
        {
            staleTime: 0,
            refetchOnMount: true,
        }
    );

    // Mutation for saving the lesson note
    const saveMutation = trpc.saveLessonNote.useMutation({
        onSuccess: () => {
            // Invalidate query to trigger refetch with updated timestamp
            utils.getLessonNote.invalidate({ lessonId });
        }
    });

    const handleSaveNote = useCallback((content: string): boolean => {
        try {
            saveMutation.mutate(
                { lessonId, content },
                {
                    onError: (error) => {
                        setErrorModal({
                            isOpen: true,
                            title: t('error.saveFailedTitle'),
                            message: `${t('error.saveFailed')}: ${error.message || t('error.saveFailedGeneric')}`,
                        });
                    }
                }
            );
            // Return true to indicate save was initiated successfully
            // The actual success/failure will be handled by the mutation callbacks
            return true;
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                title: t('error.saveFailedTitle'),
                message: `${t('error.saveFailed')}: ${error.message || t('error.saveFailedGeneric')}`,
            });
            return false;
        }
    }, [lessonId, saveMutation, t]);

    const handleDeserializationError = useCallback((message: string, error: Error) => {
        setErrorModal({
            isOpen: true,
            title: t('error.deserializationTitle'),
            message: `${t('error.deserializationFailed')}: ${message || error.message}`,
        });
    }, [t]);

    if (isLoadingNote) {
        return (
            <div className="w-[400px] sticky top-4 h-fit">
                <DefaultLoading locale={locale} variant="minimal" />
            </div>
        );
    }

    const initialContent = noteData?.success === true && noteData.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (noteData.data as any).content || ''  // TODO: investigate why typing tells me `.data` contains a nested `data` property instead of the actual content
        : '';

    // Create a key that changes when content changes to force component re-render
    const componentKey = `lesson-note-${lessonId}-${initialContent.slice(0, 50)}`;

    return (
        <>
            <div className="w-[400px] sticky top-4 h-fit">
                <LessonNoteBuilderView
                    key={componentKey}
                    id={lessonId}
                    initialValue={initialContent}
                    onChange={handleSaveNote}
                    placeholder="Take notes for this lesson..."
                    locale={locale}
                    onDeserializationError={handleDeserializationError}
                />
            </div>

            {/* Error Modal */}
            <ConfirmationModal
                type="accept"
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                onConfirm={() => setErrorModal({ ...errorModal, isOpen: false })}
                title={errorModal.title}
                message={errorModal.message}
                confirmText="OK"
                locale={locale}
            />
        </>
    );
}