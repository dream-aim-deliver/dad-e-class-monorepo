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

    const introductionVideoUpload = useIntroductionVideoUpload();

    return {
        courseIntroduction,
        introductionVideoUpload,
    };
}
