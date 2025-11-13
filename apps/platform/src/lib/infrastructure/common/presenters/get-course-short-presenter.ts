import { viewModels } from '@maany_shr/e-class-models';
import {
    GetCourseShortUseCaseResponseSchema,
    TGetCourseShortUseCaseResponse,
    TGetCourseShortErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetCourseShortPresenterUtilities = {};

export const GetCourseShortResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCourseShortUseCaseResponse,
        viewModels.TGetCourseShortViewModel,
        TGetCourseShortPresenterUtilities
    >;

type TGetCourseShortResponseMiddleware = typeof GetCourseShortResponseMiddleware;

export default class GetCourseShortPresenter extends BasePresenter<
    TGetCourseShortUseCaseResponse,
    viewModels.TGetCourseShortViewModel,
    TGetCourseShortPresenterUtilities,
    TGetCourseShortResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCourseShortViewModel) => void,
        viewUtilities: TGetCourseShortPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetCourseShortUseCaseResponseSchema,
                viewModel: viewModels.GetCourseShortViewModelSchema
            },
            middleware: GetCourseShortResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCourseShortUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetCourseShortViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCourseShortErrorResponse,
            TGetCourseShortResponseMiddleware
        >,
    ): viewModels.TGetCourseShortViewModel {
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
