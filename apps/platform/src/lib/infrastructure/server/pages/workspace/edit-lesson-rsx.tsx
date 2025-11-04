import EditLesson from '../../../client/pages/workspace/edit/edit-lesson';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';

interface EditLessonServerComponentProps {
    lessonId: number;
}

export default async function EditLessonServerComponent({
    lessonId,
}: EditLessonServerComponentProps) {
    // Prefetch lesson components data to improve initial load performance
    await prefetch(trpc.listLessonComponents.queryOptions({
        lessonId: lessonId,
    }));

    return (
        <HydrateClient>
            <Suspense fallback={<DefaultLoadingWrapper />}>
                <EditLesson lessonId={lessonId} />
            </Suspense>
        </HydrateClient>
    );
}