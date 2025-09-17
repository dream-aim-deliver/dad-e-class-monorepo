import EditLesson from '../../../client/pages/workspace/edit/edit-lesson';

interface EditLessonServerComponentProps {
    lessonId: number;
}

export default function EditLessonServerComponent({
    lessonId,
}: EditLessonServerComponentProps) {
    return <EditLesson lessonId={lessonId} />;
}
