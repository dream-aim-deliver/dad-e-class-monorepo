import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCourseGroupsPresenter, {
    TListCourseGroupsPresenterUtilities,
} from '../../common/presenters/list-course-groups-presenter';

export function useListCourseGroupsPresenter(
    setViewModel: (viewModel: viewModels.TListCourseGroupsViewModel) => void,
) {
    const presenterUtilities: TListCourseGroupsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCourseGroupsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
