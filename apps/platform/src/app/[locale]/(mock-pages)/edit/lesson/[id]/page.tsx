import EditLessonServerComponent from 'apps/platform/src/lib/infrastructure/server/pages/workspace/edit-lesson-rsx';

export default async function Page({
    params: paramsPromise,
}: {
    params: Promise<{ id: string }>;
}) {
    const params = await paramsPromise;

    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
        // TODO: Translate error message
        throw Error('Invalid lesson ID');
    }

    return <EditLessonServerComponent lessonId={id} />;
}
