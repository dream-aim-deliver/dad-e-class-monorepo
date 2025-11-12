import { TLocale } from '@maany_shr/e-class-translations';
import { 
    TListCategoriesUseCaseResponse,
    TListTopicsUseCaseResponse 
} from '@dream-aim-deliver/e-class-cms-rest';
import { useLocale } from 'next-intl';
import { CourseImageUploadState } from '../../common/hooks/use-course-image-upload';
import {
    CourseDetailsState,
    CourseForm,
    CourseGeneralInformationView,
    DefaultError,
    DefaultLoading,
    Dropdown,
} from '@maany_shr/e-class-ui-kit';
import React, { useEffect, useState } from 'react';
import { useCourseDetails } from './hooks/edit-details-hooks';
import { trpc } from '../../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListTopicsPresenter } from '../../../hooks/use-topics-presenter';
import { useListCategoriesPresenter } from '../../../hooks/use-categories-presenter';

export function EditCourseGeneralPreview({ slug }: { slug: string }) {
    const courseViewModel = useCourseDetails(slug);
    const locale = useLocale() as TLocale;

    if (!courseViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (courseViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const course = courseViewModel.data;

    return (
        <div className="flex flex-col space-y-4">
            <h2> {course.title} </h2>
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

    const [topicsResponse] = trpc.listTopics.useSuspenseQuery({});
    const [topicsViewModel, setTopicsViewModel] = useState<
        viewModels.TTopicListViewModel | undefined
    >(undefined);
    const { presenter: topicsPresenter } =
        useListTopicsPresenter(setTopicsViewModel);
    topicsPresenter.present(topicsResponse?.data as TListTopicsUseCaseResponse, topicsViewModel);

    const [categoriesResponse] = trpc.listCategories.useSuspenseQuery({});
    const [categoriesViewModel, setCategoriesViewModel] = useState<
        viewModels.TCategoryListViewModel | undefined
    >(undefined);
    const { presenter: categoriesPresenter } = useListCategoriesPresenter(
        setCategoriesViewModel,
    );
    // Extract the actual response data from the TRPC wrapper and type it correctly
    categoriesPresenter.present(categoriesResponse?.data as TListCategoriesUseCaseResponse, categoriesViewModel);

    const [isFormLoading, setIsFormLoading] = useState(true);

    useEffect(() => {
        if (!courseViewModel || courseViewModel.mode !== 'default') return;
        const course = courseViewModel.data;
        props.courseForm.setCourseTitle(course.title);
        props.courseForm.parseDescription(course.description);
        props.courseForm.setDuration(course.duration?.selfStudy ?? undefined);
        props.courseForm.setCategoryId(course.categoryId ?? undefined);
        props.courseForm.setTopicIds(course.topicIds ?? []);
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

    if (
        !courseViewModel ||
        isFormLoading ||
        !topicsViewModel ||
        !categoriesViewModel
    ) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (
        courseViewModel.mode !== 'default' ||
        topicsViewModel.mode !== 'default' ||
        categoriesViewModel.mode !== 'default'
    ) {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-4 border-1 border-card-stroke">
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
            <Dropdown
                type="multiple-choice-and-search"
                defaultValue={props.courseForm.topicIds?.map((id) =>
                    id.toString(),
                )}
                text={{
                    multiText: 'Topics',
                }}
                onSelectionChange={(selectedValues) => {
                    if (!selectedValues || typeof selectedValues === 'string') {
                        props.courseForm.setTopicIds([]);
                        return;
                    }
                    const values = selectedValues.map((id) => parseInt(id, 10));
                    props.courseForm.setTopicIds(values);
                }}
                options={topicsViewModel?.data.topics.map((topic) => ({
                    value: topic.id.toString(),
                    label: topic.name,
                }))}
                absolutePosition={false}
            />
            <Dropdown
                type="simple"
                defaultValue={props.courseForm.categoryId?.toString()}
                text={{
                    simpleText: 'Select category',
                }}
                options={categoriesViewModel?.data.categories.map(
                    (category) => ({
                        value: category.id.toString(),
                        label: category.name,
                    }),
                )}
                onSelectionChange={(selectedValue) => {
                    if (!selectedValue || Array.isArray(selectedValue)) {
                        props.courseForm.setCategoryId(undefined);
                        return;
                    }
                    const value = selectedValue
                        ? parseInt(selectedValue, 10)
                        : undefined;
                    props.courseForm.setCategoryId(value);
                }}
                absolutePosition={false}
            />
        </div>
    );
}
