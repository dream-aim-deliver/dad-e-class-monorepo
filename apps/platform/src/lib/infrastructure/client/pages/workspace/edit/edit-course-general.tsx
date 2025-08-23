import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { CourseImageUploadState } from '../../common/hooks/use-course-image-upload';
import {
    CourseDetailsState,
    CourseForm,
    CourseGeneralInformationView,
    DefaultError,
    DefaultLoading,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import React, { useEffect, useState } from 'react';
import { useCourseDetails } from './hooks/edit-details-hook';
import { fileMetadata } from '@maany_shr/e-class-models';

export function EditCourseGeneralPreview({ slug }: { slug: string }) {
    const courseViewModel = useCourseDetails(slug);
    const locale = useLocale() as TLocale;

    if (!courseViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (courseViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const course = courseViewModel.data;

    return (
        <div className="flex flex-col space-y-4">
            <SectionHeading text={course.title} />
            <CourseGeneralInformationView
                // These fields aren't utilized and are coming from a common model
                title={''}
                description={''}
                showProgress={false}
                language={{
                    name: '',
                    code: '',
                }}
                pricing={{
                    fullPrice: 0,
                    partialPrice: 0,
                    currency: '',
                }}
                locale={locale}
                longDescription={course.description}
                duration={{
                    video: course.duration.video ?? 0,
                    coaching: course.duration.coaching ?? 0,
                    selfStudy: course.duration.selfStudy ?? 0,
                }}
                rating={course.author.averageRating}
                author={{
                    name: course.author.name + ' ' + course.author.surname,
                    image: course.author.avatarUrl ?? '',
                }}
                imageUrl={course.imageFile?.downloadUrl ?? ''}
                students={course.students.map((student) => ({
                    name: student.name,
                    avatarUrl: student.avatarUrl ?? '',
                }))}
                totalStudentCount={course.studentCount}
                onClickAuthor={() => {
                    // Don't handle author click
                }}
            />
        </div>
    );
}

interface EditCourseGeneralProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: React.Dispatch<React.SetStateAction<number | null>>;
    courseForm: CourseDetailsState;
    uploadImage: CourseImageUploadState;
    setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditCourseGeneral(props: EditCourseGeneralProps) {
    const locale = useLocale() as TLocale;

    const courseViewModel = useCourseDetails(props.slug);
    const [isFormLoading, setIsFormLoading] = useState(true);

    useEffect(() => {
        if (!courseViewModel || courseViewModel.mode !== 'default') return;
        const course = courseViewModel.data;
        props.courseForm.setCourseTitle(course.title);
        props.courseForm.parseDescription(course.description);
        props.courseForm.setDuration(course.duration?.coaching ?? undefined);
        props.setCourseVersion(course.courseVersion);
        if (course.imageFile) {
            props.uploadImage.handleUploadComplete({
                ...course.imageFile,
                status: 'available',
                url: course.imageFile.downloadUrl,
                thumbnailUrl: course.imageFile.downloadUrl,
            });
        }
        setIsFormLoading(false);
        props.setIsEdited(false);
    }, [courseViewModel]);

    if (!courseViewModel || isFormLoading) {
        return <DefaultLoading locale={locale} />;
    }

    if (courseViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <CourseForm
            mode="edit"
            courseVersion={props.courseVersion}
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
