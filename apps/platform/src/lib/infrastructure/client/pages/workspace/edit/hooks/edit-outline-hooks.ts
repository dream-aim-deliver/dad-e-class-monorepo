import {
    AccordionBuilderItem,
    useCourseIntroductionForm,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../../../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCourseOutlinePresenter } from '../../../../hooks/use-course-outline-presenter';
import { useAccordionIconUpload } from './use-accordion-icon-upload';

export function useCourseOutline(slug: string) {
    const [outlineResponse] = trpc.getCourseOutline.useSuspenseQuery({
        courseSlug: slug,
    });
    const [outlineViewModel, setOutlineViewModel] = useState<
        viewModels.TCourseOutlineViewModel | undefined
    >(undefined);
    const { presenter } = useGetCourseOutlinePresenter(setOutlineViewModel);
    presenter.present(outlineResponse, outlineViewModel);

    return outlineViewModel;
}

export function useSaveOutline({
    slug,
    courseVersion,
    setErrorMessage,
}: {
    slug: string;
    courseVersion: number | null;
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) {
    const [accordionBuilderItems, setAccordionBuilderItems] = useState<
        AccordionBuilderItem[]
    >([]);

    const accordionIconUpload = useAccordionIconUpload(slug);
    const saveOutlineMutation = trpc.saveCourseOutline.useMutation();

    const saveCourseOutline = async () => {
        if (!courseVersion) return;
        // TODO: validate

        setErrorMessage(null);
        const result = await saveOutlineMutation.mutateAsync({
            courseSlug: slug,
            courseVersion: courseVersion,
            items: [],
        });
        if (!result.success) {
            setErrorMessage(result.data.message);
            return;
        }
        window.location.reload();

        return result;
    };

    return {
        outlineItems: accordionBuilderItems,
        setOutlineItems: setAccordionBuilderItems,
        accordionIconUpload,
        saveCourseOutline,
        isOutlineSaving: saveOutlineMutation.isPending,
    };
}
