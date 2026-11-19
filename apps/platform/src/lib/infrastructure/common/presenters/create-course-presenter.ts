import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateCourseUseCaseResponseSchema,
    TCreateCourseUseCaseResponse,
    TCreateCourseErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateCoursePresenterUtilities = {};

export const CreateCourseResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateCourseUseCaseResponse,
        viewModels.TCreateCourseViewModel,
        TCreateCoursePresenterUtilities
    >;

type TCreateCourseResponseMiddleware = typeof CreateCourseResponseMiddleware;

export default class CreateCoursePresenter extends BasePresenter<
    TCreateCourseUseCaseResponse,
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
                responseModel: CreateCourseUseCaseResponseSchema,
                viewModel: viewModels.CreateCourseViewModelSchema
            },
            middleware: CreateCourseResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        response: Extract<
            TCreateCourseUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateCourseViewModel {
        // The create-course view model carries no data (the page only checks the mode),
        // and zod 4 types its empty data shape as Record<string, never>.
        return {
            mode: 'default',
            data: {},
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateCourseErrorResponse,
            TCreateCourseResponseMiddleware
        >,
    ): viewModels.TCreateCourseViewModel {
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
