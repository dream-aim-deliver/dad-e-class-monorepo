import { fileMetadata } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import { CourseForm, CourseFormState } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { CourseImageUploadState } from '../../common/hooks/use-course-image-upload';

interface EditCourseGeneralProps {
    slug: string;
    courseForm: CourseFormState;
    uploadImage: CourseImageUploadState;
}

export default function EditCourseGeneral(props: EditCourseGeneralProps) {
    const locale = useLocale() as TLocale;

    return (
        <CourseForm
            mode="edit"
            image={props.uploadImage.courseImage}
            courseTitle={props.courseForm.courseTitle}
            setCourseTitle={props.courseForm.setCourseTitle}
            courseSlug={props.courseForm.courseSlug}
            setCourseSlug={props.courseForm.setCourseSlug}
            courseDescription={props.courseForm.courseDescription}
            setCourseDescription={props.courseForm.setCourseDescription}
            duration={props.courseForm.duration}
            setDuration={props.courseForm.setDuration}
            onAddRequirement={props.courseForm.onAddRequirement}
            onRemoveRequirement={props.courseForm.onRemoveRequirement}
            onFileChange={props.uploadImage.handleFileChange}
            onUploadComplete={props.uploadImage.handleUploadComplete}
            onDelete={props.uploadImage.handleDelete}
            onDownload={props.uploadImage.handleDownload}
            locale={locale}
            errorMessage={props.uploadImage.uploadError}
            hasSuccess={false}
        />
    );
}
