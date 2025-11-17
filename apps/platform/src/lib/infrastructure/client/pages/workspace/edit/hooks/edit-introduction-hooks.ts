import { useCourseIntroductionForm } from '@maany_shr/e-class-ui-kit';
import { useGetCourseIntroductionPresenter } from '../../../../hooks/use-course-introduction-presenter';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useIntroductionVideoUpload } from './use-introduction-video-upload';
import { useTranslations } from 'next-intl';
import { trpc } from '../../../../trpc/cms-client';
import { idToNumber } from '../utils/id-to-number';

export function useCourseIntroduction(slug: string) {
    const [introductionResponse] = trpc.getCourseIntroduction.useSuspenseQuery({
        courseSlug: slug,
    });
    const [introductionViewModel, setIntroductionViewModel] = useState<
        viewModels.TCourseIntroductionViewModel | undefined
    >(undefined);
    const { presenter } = useGetCourseIntroductionPresenter(
        setIntroductionViewModel,
    );

    // @ts-ignore
    presenter.present(introductionResponse, introductionViewModel);

    return introductionViewModel;
}

export function useSaveIntroduction({
    slug,
    courseVersion,
    setErrorMessage,
}: {
    slug: string;
    courseVersion: number | null;
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) {
    const courseIntroduction = useCourseIntroductionForm();

    const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
    const introductionVideoUpload = useIntroductionVideoUpload(slug, setUploadProgress);

    const utils = trpc.useUtils();

    const saveIntroductionMutation = trpc.saveCourseIntroduction.useMutation({
        onSuccess: () => {
            // Invalidate related queries to refetch fresh data
            utils.getCourseIntroduction.invalidate({ courseSlug: slug });
            utils.getEnrolledCourseDetails.invalidate({ courseSlug: slug });
        },
    });

    const editIntroductionTranslations = useTranslations('components.editIntroductionHooks');

    const saveCourseIntroduction = async () => {
        if (!courseVersion) return;
        if (!courseIntroduction.introductionText) {
            setErrorMessage(editIntroductionTranslations('courseIntroductionValidationText'));
            return;
        }

        setErrorMessage(null);
        const result = await saveIntroductionMutation.mutateAsync({
            courseSlug: slug,
            courseVersion: courseVersion,
            text: courseIntroduction.serializeIntroductionText(),
            videoId: idToNumber(introductionVideoUpload.video?.id),
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
        courseIntroduction,
        introductionVideoUpload,
        saveCourseIntroduction,
        isIntroductionSaving: saveIntroductionMutation.isPending,
        uploadProgress,
    };
}