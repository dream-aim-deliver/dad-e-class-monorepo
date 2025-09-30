import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetCourseCertificateDataUseCaseResponse,
    GetCourseCertificateDataUseCaseResponseSchema,
    TGetCourseCertificateDataErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetCourseCertificateDataPresenterUtilities = {};

export const GetCourseCertificateDataResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCourseCertificateDataUseCaseResponse,
        viewModels.TGetCourseCertificateDataViewModel,
        TGetCourseCertificateDataPresenterUtilities
    >;

type TGetCourseCertificateDataResponseMiddleware = typeof GetCourseCertificateDataResponseMiddleware;

export default class GetCourseCertificateDataPresenter extends BasePresenter<
    TGetCourseCertificateDataUseCaseResponse,
    viewModels.TGetCourseCertificateDataViewModel,
    TGetCourseCertificateDataPresenterUtilities,
    TGetCourseCertificateDataResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCourseCertificateDataViewModel) => void,
        viewUtilities: TGetCourseCertificateDataPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetCourseCertificateDataUseCaseResponseSchema,
                viewModel: viewModels.GetCourseCertificateDataViewModelSchema
            },
            middleware: GetCourseCertificateDataResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCourseCertificateDataUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetCourseCertificateDataViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCourseCertificateDataErrorResponse,
            TGetCourseCertificateDataResponseMiddleware
        >,
    ): viewModels.TGetCourseCertificateDataViewModel {
        if (response.data.errorType === 'NotFoundError') {
            return {
                mode: 'not-found',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context
                }
            };
        }
        return {
            mode: 'kaboom',
            data: {
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context
            }
        };
    }
}
