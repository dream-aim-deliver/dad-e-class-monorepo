import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateCoursePresenterUtilities = {};

export const CreateCourseResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TCreateCourseUseCaseResponse,
        viewModels.TCreateCourseViewModel,
        TCreateCoursePresenterUtilities
    >;

type TCreateCourseResponseMiddleware = typeof CreateCourseResponseMiddleware;

export default class CreateCoursePresenter extends BasePresenter<
    useCaseModels.TCreateCourseUseCaseResponse,
    viewModels.TCreateCourseViewModel,
    TCreateCoursePresenterUtilities,
    TCreateCourseResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateCourseViewModel) => void,
        viewUtilities: TCreateCoursePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.CreateCourseUseCaseResponseSchema,
                viewModel: viewModels.CreateCourseViewModelSchema
            },
            middleware: CreateCourseResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TCreateCourseUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateCourseViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TCreateCourseUseCaseErrorResponse,
            TCreateCourseResponseMiddleware
        >,
    ): viewModels.TCreateCourseViewModel {
        if (response.data.errorType === 'ValidationError') {
            return {
                mode: 'kaboom',
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
