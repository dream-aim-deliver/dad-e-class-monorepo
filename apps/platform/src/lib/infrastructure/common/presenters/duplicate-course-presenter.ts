import { viewModels } from '@maany_shr/e-class-models';
import {
    DuplicateCourseUseCaseResponseSchema,
    TDuplicateCourseUseCaseResponse,
    TDuplicateCourseErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TDuplicateCoursePresenterUtilities = {};

export const DuplicateCourseResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TDuplicateCourseUseCaseResponse,
        viewModels.TDuplicateCourseViewModel,
        TDuplicateCoursePresenterUtilities
    >;

type TDuplicateCourseResponseMiddleware = typeof DuplicateCourseResponseMiddleware;

export default class DuplicateCoursePresenter extends BasePresenter<
    TDuplicateCourseUseCaseResponse,
    viewModels.TDuplicateCourseViewModel,
    TDuplicateCoursePresenterUtilities,
    TDuplicateCourseResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TDuplicateCourseViewModel) => void,
        viewUtilities: TDuplicateCoursePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: DuplicateCourseUseCaseResponseSchema,
                viewModel: viewModels.DuplicateCourseViewModelSchema
            },
            middleware: DuplicateCourseResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TDuplicateCourseUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TDuplicateCourseViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TDuplicateCourseErrorResponse,
            TDuplicateCourseResponseMiddleware
        >,
    ): viewModels.TDuplicateCourseViewModel {
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
