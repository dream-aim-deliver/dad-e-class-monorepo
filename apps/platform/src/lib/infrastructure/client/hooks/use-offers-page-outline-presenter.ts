import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import OffersPageOutlinePresenter, {
    TOffersPageOutlinePresenterUtilities,
} from '../../common/presenters/offers-page-outline-presenter';
import { getDefaultPresenterUtilities } from '../utils/get-default-presenter-utilities';

export function useGetOffersPageOutlinePresenter(
    setViewModel: (viewModel: viewModels.TOffersPageOutlineViewModel) => void,
) {
    const presenterUtilities: TOffersPageOutlinePresenterUtilities =
        getDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new OffersPageOutlinePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
