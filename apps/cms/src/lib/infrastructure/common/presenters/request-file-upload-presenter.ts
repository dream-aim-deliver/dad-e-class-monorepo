import { viewModels } from '@maany_shr/e-class-models';
import {
    RequestFileUploadUseCaseResponseSchema,
    TRequestFileUploadUseCaseResponse,
    TRequestFileUploadErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TRequestFileUploadPresenterUtilities = {};

export const RequestFileUploadResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TRequestFileUploadUseCaseResponse,
        viewModels.TRequestFileUploadViewModel,
        TRequestFileUploadPresenterUtilities
    >;

type TRequestFileUploadResponseMiddleware = typeof RequestFileUploadResponseMiddleware;

export default class RequestFileUploadPresenter extends BasePresenter<
    TRequestFileUploadUseCaseResponse,
    viewModels.TRequestFileUploadViewModel,
    TRequestFileUploadPresenterUtilities,
    TRequestFileUploadResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TRequestFileUploadViewModel) => void,
        viewUtilities: TRequestFileUploadPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: RequestFileUploadUseCaseResponseSchema,
                viewModel: viewModels.RequestFileUploadViewModelSchema
            },
            middleware: RequestFileUploadResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TRequestFileUploadUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TRequestFileUploadViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TRequestFileUploadErrorResponse,
            TRequestFileUploadResponseMiddleware
        >,
    ): viewModels.TRequestFileUploadViewModel {
        if (response.data.errorType === 'ValidationError') {
            return {
                mode: 'invalid',
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
