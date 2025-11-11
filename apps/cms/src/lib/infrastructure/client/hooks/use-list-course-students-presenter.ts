import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCourseStudentsPresenter, { 
    TListCourseStudentsPresenterUtilities 
} from '../../common/presenters/list-course-students-presenter';


export function useListCourseStudentsPresenter(
    setViewModel: (viewModel: viewModels.TListCourseStudentsViewModel) => void,
) {
    const presenterUtilities: TListCourseStudentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCourseStudentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
