import { AccordionBuilderItem } from '@maany_shr/e-class-ui-kit';
import { useState } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useGetCourseOutlinePresenter } from '../../../../hooks/use-course-outline-presenter';
import { useAccordionIconUpload } from './use-accordion-icon-upload';
import { useTranslations } from 'next-intl';
import { trpc } from '../../../../trpc/cms-client';

export function useCourseOutline(slug: string) {
    const [outlineResponse] = trpc.getCourseOutline.useSuspenseQuery({
        courseSlug: slug,
    });
    const [outlineViewModel, setOutlineViewModel] = useState<
        viewModels.TCourseOutlineViewModel | undefined
    >(undefined);
    const { presenter } = useGetCourseOutlinePresenter(setOutlineViewModel);
    // @ts-ignore
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

    const [accordionUploadProgress, setAccordionUploadProgress] = useState<number | undefined>(undefined);
    const accordionIconUpload = useAccordionIconUpload(slug, setAccordionUploadProgress);
    const saveOutlineMutation = trpc.saveCourseIntroductionOutline.useMutation();

    const editOutlineTranslations = useTranslations('components.editOutlineHooks');

    const saveCourseOutline = async () => {
        if (!courseVersion) return;
        if (accordionBuilderItems.length < 1) {
            setErrorMessage(editOutlineTranslations('outlineCountValidationText'));
            return;
        }
        const requestItems: useCaseModels.TSaveCourseOutlineRequest['items'] =
            [];
        for (let i = 0; i < accordionBuilderItems.length; i++) {
            const item = accordionBuilderItems[i];
            if (!item.title || !item.content) {
                setErrorMessage(
                    editOutlineTranslations('TitleAndContentValidationText'),
                );
                return;
            }
            let iconId = null;
            if (item.icon) {
                iconId = String(item.icon.id);
            }
            requestItems.push({
                title: item.title,
                description: item.content,
                position: i + 1,
                iconId: iconId,
            });
        }
        setErrorMessage(null);
        const result = await saveOutlineMutation.mutateAsync({
            courseSlug: slug,
            courseVersion: courseVersion,
            items: requestItems,
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
        outlineItems: accordionBuilderItems,
        setOutlineItems: setAccordionBuilderItems,
        accordionIconUpload,
        accordionUploadProgress,
        saveCourseOutline,
        isOutlineSaving: saveOutlineMutation.isPending,
    };
}