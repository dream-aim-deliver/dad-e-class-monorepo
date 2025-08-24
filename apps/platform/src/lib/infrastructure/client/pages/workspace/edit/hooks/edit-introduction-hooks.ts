import { useCourseIntroductionForm } from '@maany_shr/e-class-ui-kit';
import { useGetCourseIntroductionPresenter } from '../../../../hooks/use-course-introduction-presenter';
import { trpc } from '../../../../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useIntroductionVideoUpload } from './use-introduction-video-upload';

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
    presenter.present(introductionResponse, introductionViewModel);

    return introductionViewModel;
}

// TODO: Tranlate error message
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

    const introductionVideoUpload = useIntroductionVideoUpload(slug);

    const saveIntroductionMutation = trpc.saveCourseIntroduction.useMutation();

    const saveCourseIntroduction = async () => {
        if (!courseVersion) return;
        if (!courseIntroduction.introductionText) {
            setErrorMessage('Course introduction text is required');
            return;
        }

        setErrorMessage(null);
        const result = await saveIntroductionMutation.mutateAsync({
            courseSlug: slug,
            courseVersion: courseVersion,
            text: courseIntroduction.serializeIntroductionText(),
            videoId: introductionVideoUpload.video?.id ?? null,
        });
        if (!result.success) {
            setErrorMessage(result.data.message);
            return;
        }
        return result;
    };

    return {
        courseIntroduction,
        introductionVideoUpload,
        saveCourseIntroduction,
        isIntroductionSaving: saveIntroductionMutation.isPending,
    };
}