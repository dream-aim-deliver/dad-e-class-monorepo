'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { LessonNoteBuilderView, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';
import { trpc } from '../../../trpc/cms-client';

interface LessonNotesPanelProps {
    lessonId: number;
}

export default function LessonNotesPanel({ lessonId }: LessonNotesPanelProps) {
    const locale = useLocale() as TLocale;

    // Query for getting the lesson note
    const { data: noteData, isLoading: isLoadingNote, refetch } = trpc.getLessonNote.useQuery(
        { lessonId },
        {
            staleTime: 0,
            refetchOnMount: true,
        }
    );

    // Mutation for saving the lesson note
    const saveMutation = trpc.saveLessonNote.useMutation({
        onSuccess: () => {
            // Refetch the note data to get updated timestamp
            refetch();
        }
    });

    const handleSaveNote = useCallback((content: string): boolean => {
        try {
            saveMutation.mutate(
                { lessonId, content },
                {
                    onError: (error) => {
                        console.error('Failed to save lesson note:', error);
                    }
                }
            );
            // Return true to indicate save was initiated successfully
            // The actual success/failure will be handled by the mutation callbacks
            return true;
        } catch (error) {
            console.error('Error initiating save:', error);
            return false;
        }
    }, [lessonId, saveMutation]);

    const handleDeserializationError = useCallback((message: string, error: Error) => {
        console.error('Rich text deserialization error:', message, error);
    }, []);

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
        <div className="w-[400px] sticky top-20 h-fit">
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
    );
}