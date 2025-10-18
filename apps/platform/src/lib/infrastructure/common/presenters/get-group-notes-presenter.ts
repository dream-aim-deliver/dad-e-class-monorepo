import { viewModels } from '@maany_shr/e-class-models';
import {
    GetGroupNotesUseCaseResponseSchema,
    TGetGroupNotesUseCaseResponse,
    TGetGroupNotesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetGroupNotesPresenterUtilities = {};

export const GetGroupNotesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetGroupNotesUseCaseResponse,
        viewModels.TGetGroupNotesViewModel,
        TGetGroupNotesPresenterUtilities
    >;

type TGetGroupNotesResponseMiddleware = typeof GetGroupNotesResponseMiddleware;

export default class GetGroupNotesPresenter extends BasePresenter<
    TGetGroupNotesUseCaseResponse,
    viewModels.TGetGroupNotesViewModel,
    TGetGroupNotesPresenterUtilities,
    TGetGroupNotesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetGroupNotesViewModel) => void,
        viewUtilities: TGetGroupNotesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetGroupNotesUseCaseResponseSchema,
                viewModel: viewModels.GetGroupNotesViewModelSchema
            },
            middleware: GetGroupNotesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetGroupNotesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetGroupNotesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetGroupNotesErrorResponse,
            TGetGroupNotesResponseMiddleware
        >,
    ): viewModels.TGetGroupNotesViewModel {
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
