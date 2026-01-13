'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { LessonNoteBuilderView, DefaultLoading, ConfirmationModal } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { trpc } from '../../../trpc/cms-client';

interface LessonNotesPanelProps {
    lessonId: number;
    isArchived?: boolean;
}

export default function LessonNotesPanel({ lessonId, isArchived }: LessonNotesPanelProps) {
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
            // Invalidate queries to trigger refetch with updated data
            utils.getLessonNote.invalidate({ lessonId });
            // Also invalidate the Notes tab query so it shows updated notes
            utils.listStudentNotes.invalidate();
        }
    });

    const handleSaveNote = useCallback((content: string): boolean => {
        // Don't save notes for archived courses
        if (isArchived) {
            return false;
        }

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
    }, [lessonId, saveMutation, t, isArchived]);

    const handleDeserializationError = useCallback((message: string, error: Error) => {
        setErrorModal({
            isOpen: true,
            title: t('error.deserializationTitle'),
            message: `${t('error.deserializationFailed')}: ${message || error.message}`,
        });
    }, [t]);

    if (isLoadingNote) {
        return (
            <div className="w-full lg:w-[350px] xl:w-[400px] shrink min-w-0 sticky top-4 h-fit">
                <DefaultLoading locale={locale} variant="minimal" />
            </div>
        );
    }

    const initialContent = noteData?.success === true && noteData.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (noteData.data as any).content || ''  // TODO: investigate why typing tells me `.data` contains a nested `data` property instead of the actual content
        : '';

    // Key by lessonId only - content changes shouldn't remount (would reset success banner state)
    const componentKey = `lesson-note-${lessonId}`;

    return (
        <>
            <div className="w-full lg:w-[350px] xl:w-[400px] shrink min-w-0 sticky top-4 h-fit">
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