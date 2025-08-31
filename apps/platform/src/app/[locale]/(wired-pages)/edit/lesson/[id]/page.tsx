import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import EditLessonServerComponent from '../../../../../../lib/infrastructure/server/pages/workspace/edit-lesson-rsx';

export default async function Page({
    params: paramsPromise,
}: {
    params: Promise<{ id: string , locale: TLocale }>;
}) {
    const params = await paramsPromise;
    const dictionary = getDictionary(params.locale);

    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
        throw Error(dictionary.pages.edit.lesson.invalidLessonId);
    }

    return <EditLessonServerComponent lessonId={id} />;
}
