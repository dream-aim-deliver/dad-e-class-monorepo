import { viewModels } from '@maany_shr/e-class-models';
import {
    DeleteCourseUseCaseResponseSchema,
    TDeleteCourseUseCaseResponse,
    TDeleteCourseErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TDeleteCoursePresenterUtilities = {};

export const DeleteCourseResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TDeleteCourseUseCaseResponse,
        viewModels.TDeleteCourseViewModel,
        TDeleteCoursePresenterUtilities
    >;

type TDeleteCourseResponseMiddleware = typeof DeleteCourseResponseMiddleware;

export default class DeleteCoursePresenter extends BasePresenter<
    TDeleteCourseUseCaseResponse,
    viewModels.TDeleteCourseViewModel,
    TDeleteCoursePresenterUtilities,
    TDeleteCourseResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TDeleteCourseViewModel) => void,
        viewUtilities: TDeleteCoursePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: DeleteCourseUseCaseResponseSchema,
                viewModel: viewModels.DeleteCourseViewModelSchema
            },
            middleware: DeleteCourseResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TDeleteCourseUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TDeleteCourseViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TDeleteCourseErrorResponse,
            TDeleteCourseResponseMiddleware
        >,
    ): viewModels.TDeleteCourseViewModel {
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
