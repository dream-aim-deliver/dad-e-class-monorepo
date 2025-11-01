import { viewModels } from '@maany_shr/e-class-models';
import {
    DuplicateLessonUseCaseResponseSchema,
    TDuplicateLessonUseCaseResponse,
    TDuplicateLessonErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TDuplicateLessonPresenterUtilities = {};

export const DuplicateLessonResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TDuplicateLessonUseCaseResponse,
        viewModels.TDuplicateLessonViewModel,
        TDuplicateLessonPresenterUtilities
    >;

type TDuplicateLessonResponseMiddleware = typeof DuplicateLessonResponseMiddleware;

export default class DuplicateLessonPresenter extends BasePresenter<
    TDuplicateLessonUseCaseResponse,
    viewModels.TDuplicateLessonViewModel,
    TDuplicateLessonPresenterUtilities,
    TDuplicateLessonResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TDuplicateLessonViewModel) => void,
        viewUtilities: TDuplicateLessonPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: DuplicateLessonUseCaseResponseSchema,
                viewModel: viewModels.DuplicateLessonViewModelSchema
            },
            middleware: DuplicateLessonResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TDuplicateLessonUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TDuplicateLessonViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TDuplicateLessonErrorResponse,
            TDuplicateLessonResponseMiddleware
        >,
    ): viewModels.TDuplicateLessonViewModel {
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
