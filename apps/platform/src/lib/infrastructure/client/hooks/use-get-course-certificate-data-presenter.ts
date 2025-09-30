import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCourseCertificateDataPresenter, {
    TGetCourseCertificateDataPresenterUtilities,
} from '../../common/presenters/get-course-certificate-data-presenter';

export function useGetCourseCertificateDataPresenter(
    setViewModel: (viewModel: viewModels.TGetCourseCertificateDataViewModel) => void,
) {
    const presenterUtilities: TGetCourseCertificateDataPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCourseCertificateDataPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
