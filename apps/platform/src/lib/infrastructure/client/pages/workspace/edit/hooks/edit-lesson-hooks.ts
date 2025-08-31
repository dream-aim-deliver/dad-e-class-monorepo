import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../../../../trpc/cms-client';
import { useState } from 'react';
import { useListLessonComponentsPresenter } from '../../../../hooks/use-lesson-components-presenter';

export function useLessonComponents(id: number) {
    const [lessonComponentsResponse] =
        trpc.listLessonComponents.useSuspenseQuery(
            { lessonId: id },
            {
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                refetchOnMount: true,
                retry: false,
            },
        );

    const [lessonComponentsViewModel, setLessonComponentsViewModel] = useState<
        viewModels.TLessonComponentListViewModel | undefined
    >(undefined);

    const { presenter } = useListLessonComponentsPresenter(
        setLessonComponentsViewModel,
    );

    // @ts-ignore
    presenter.present(lessonComponentsResponse, lessonComponentsViewModel);

    return lessonComponentsViewModel;
}