import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetEnrolledCourseDetailsPresenter } from '../../../../hooks/use-enrolled-course-details-presenter';
import { useCourseForm } from '@maany_shr/e-class-ui-kit';
import { useCourseImageUpload } from '../../../common/hooks/use-course-image-upload';
import { useTranslations } from 'next-intl';
import { trpc } from '../../../../trpc/cms-client';
import { idToNumber } from '../utils/id-to-number';

export function useCourseDetails(slug: string) {
    const [courseResponse] = trpc.getEnrolledCourseDetails.useSuspenseQuery(
        {
            courseSlug: slug,
        },
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: true,
            retry: false,
        },
    );
    const [courseViewModel, setCourseViewModel] = useState<
        viewModels.TEnrolledCourseDetailsViewModel | undefined
    >(undefined);
    const { presenter: coursePresenter } =
        useGetEnrolledCourseDetailsPresenter(setCourseViewModel);
    // @ts-ignore
    coursePresenter.present(courseResponse, courseViewModel);

    return courseViewModel;
}

export function useSaveDetails({
    slug,
    courseVersion,
    setErrorMessage,
}: {
    slug: string;
    courseVersion: number | null;
    setErrorMessage: (message: string | null) => void;
}) {
    const courseDetails = useCourseForm();

    const courseImageUpload = useCourseImageUpload(null, undefined, slug);

    const utils = trpc.useUtils();

    const saveDetailsMutation = trpc.saveCourseDetails.useMutation({
        onSuccess: () => {
            // Invalidate related queries to refetch fresh data
            utils.getEnrolledCourseDetails.invalidate({ courseSlug: slug });
            utils.getPublicCourseDetails.invalidate({ courseSlug: slug });
            utils.listUserCourses.invalidate();
            utils.listPlatformCoursesShort.invalidate();
            utils.listRequiredCourses.invalidate();
        },
    });

    const editDetailsTranslations = useTranslations('components.editDetailsHooks');

    const validateCourseDetails = () => {
        if (!courseDetails.courseTitle) {
            setErrorMessage(editDetailsTranslations('courseTitleValidationText'));
            return false;
        }
        if (!courseDetails.serializeDescription()) {
            setErrorMessage(editDetailsTranslations('courseDescriptionValidationText'));
            return false;
        }
        if (!courseDetails.duration || Number.isNaN(courseDetails.duration) || courseDetails.duration <= 0) {
            setErrorMessage(editDetailsTranslations('courseDurationValidationText'));
            return false;
        }
        if (!courseImageUpload.courseImage) {
            // TODO: translate
            setErrorMessage('Course image is required');
            return false;
        }
        return true;
    };

    const saveCourseDetails = async () => {
        if (!courseVersion) return;
        if (!validateCourseDetails()) return;

        setErrorMessage(null);

        const result = await saveDetailsMutation.mutateAsync({
            courseSlug: slug,
            courseVersion: courseVersion,
            title: courseDetails.courseTitle,
            description: courseDetails.serializeDescription(),
            selfStudyDuration: courseDetails.duration,
            imageId: idToNumber(courseImageUpload.courseImage?.id),
            categoryId: courseDetails.categoryId,
            topicIds: courseDetails.topicIds,
            requirementIds: courseDetails.requirements?.map((r) => r.id),
        });
        if (!result.success) {
            // TODO: Fix typing
            if ('message' in result.data) {
                setErrorMessage(result.data.message as string);
            }
            return;
        }
        return result;
    };

    return {
        courseDetails,
        courseImageUpload,
        saveCourseDetails,
        isDetailsSaving: saveDetailsMutation.isPending,
    };
}