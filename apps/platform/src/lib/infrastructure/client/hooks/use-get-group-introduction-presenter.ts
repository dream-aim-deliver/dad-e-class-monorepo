import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetGroupIntroductionPresenter, {
    TGetGroupIntroductionPresenterUtilities,
} from '../../common/presenters/get-group-introduction-presenter';

export function useGetGroupIntroductionPresenter(
    setViewModel: (viewModel: viewModels.TGetGroupIntroductionViewModel) => void,
) {
    const presenterUtilities: TGetGroupIntroductionPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetGroupIntroductionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
