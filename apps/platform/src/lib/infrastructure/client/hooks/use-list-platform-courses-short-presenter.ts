import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListPlatformCoursesShortPresenter, {
    TListPlatformCoursesShortPresenterUtilities,
} from '../../common/presenters/list-platform-courses-short-presenter';

export function useListPlatformCoursesShortPresenter(
    setViewModel: (viewModel: viewModels.TListPlatformCoursesShortViewModel) => void,
) {
    const presenterUtilities: TListPlatformCoursesShortPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListPlatformCoursesShortPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
