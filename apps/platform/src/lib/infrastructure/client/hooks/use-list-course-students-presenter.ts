import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCourseStudentsPresenter, { 
    TCourseStudentsPresenterUtilities 
} from '../../common/presenters/list-course-students-presenter';


export function useListCourseStudentsPresenter(
    setViewModel: (viewModel: viewModels.TCourseStudentsListViewModel) => void,
) {
    const presenterUtilities: TCourseStudentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCourseStudentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
