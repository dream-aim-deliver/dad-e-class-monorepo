import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import RequestFileUploadPresenter, {
	TRequestFileUploadPresenterUtilities,
} from '../../common/presenters/request-file-upload-presenter';

export function useRequestFileUploadPresenter(
	setViewModel: (viewModel: viewModels.TRequestFileUploadViewModel) => void,
) {
	const presenterUtilities: TRequestFileUploadPresenterUtilities = {};
	const presenter = useMemo(
		() => new RequestFileUploadPresenter(setViewModel, presenterUtilities),
		[setViewModel],
	);
	return { presenter };
}
