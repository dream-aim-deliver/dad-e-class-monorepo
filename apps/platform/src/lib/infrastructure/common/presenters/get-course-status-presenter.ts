import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetCourseStatusUseCaseResponse,
    GetCourseStatusUseCaseResponseSchema,
    TGetCourseStatusErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetCourseStatusPresenterUtilities = {};

export const GetCourseStatusResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCourseStatusUseCaseResponse,
        viewModels.TGetCourseStatusViewModel,
        TGetCourseStatusPresenterUtilities
    >;

type TGetCourseStatusResponseMiddleware = typeof GetCourseStatusResponseMiddleware;

export default class GetCourseStatusPresenter extends BasePresenter<
    TGetCourseStatusUseCaseResponse,
    viewModels.TGetCourseStatusViewModel,
    TGetCourseStatusPresenterUtilities,
    TGetCourseStatusResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCourseStatusViewModel) => void,
        viewUtilities: TGetCourseStatusPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetCourseStatusUseCaseResponseSchema,
                viewModel: viewModels.GetCourseStatusViewModelSchema
            },
            middleware: GetCourseStatusResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCourseStatusUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetCourseStatusViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCourseStatusErrorResponse,
            TGetCourseStatusResponseMiddleware
        >,
    ): viewModels.TGetCourseStatusViewModel {
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
