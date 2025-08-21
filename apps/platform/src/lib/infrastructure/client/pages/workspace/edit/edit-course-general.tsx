import { fileMetadata } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import { CourseForm, CourseFormState } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';

interface EditCourseGeneralProps {
    courseForm: CourseFormState;
    image: fileMetadata.TFileMetadataImage | null;
    setImage: (image: fileMetadata.TFileMetadataImage | null) => void;
}

export default function EditCourseGeneral(props: EditCourseGeneralProps) {
    const locale = useLocale() as TLocale;

    return (
        <CourseForm
            mode="edit"
            image={props.image}
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
            onFileChange={() => {
                throw new Error('File change not implemented');
            }}
            onUploadComplete={() => {
                throw new Error('Upload complete not implemented');
            }}
            onDelete={() => {
                throw new Error('Delete not implemented');
            }}
            onDownload={() => {
                throw new Error('Download not implemented');
            }}
            locale={locale}
            errorMessage={undefined}
            hasSuccess={false}
        />
    );
}
