import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { CourseImageUploadState } from '../../common/hooks/use-course-image-upload';
import {
    CourseDetailsState,
    CourseForm,
    DefaultError,
    DefaultLoading,
} from '@maany_shr/e-class-ui-kit';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../../trpc/client';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { useGetEnrolledCourseDetailsPresenter } from '../../../hooks/use-enrolled-course-details-presenter';

interface EditCourseGeneralProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: React.Dispatch<React.SetStateAction<number | null>>;
    courseForm: CourseDetailsState;
    uploadImage: CourseImageUploadState;
}

export default function EditCourseGeneral(props: EditCourseGeneralProps) {
    const locale = useLocale() as TLocale;

    const [courseResponse] = trpc.getEnrolledCourseDetails.useSuspenseQuery(
        {
            courseSlug: props.slug,
        },
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: false,
            staleTime: Infinity,
        },
    );
    const [courseViewModel, setCourseViewModel] = useState<
        viewModels.TEnrolledCourseDetailsViewModel | undefined
    >(undefined);
    const { presenter: coursePresenter } =
        useGetEnrolledCourseDetailsPresenter(setCourseViewModel);
    coursePresenter.present(courseResponse, courseViewModel);

    const [isFormLoading, setIsFormLoading] = useState(true);

    useEffect(() => {
        if (!courseViewModel) return;
        props.courseForm.setCourseTitle(courseViewModel.data.title);
        props.courseForm.parseDescription(courseViewModel.data.description);
        props.courseForm.setDuration(courseViewModel.data.duration);
        props.setCourseVersion(courseViewModel.data.courseVersion);
        setIsFormLoading(false);
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
