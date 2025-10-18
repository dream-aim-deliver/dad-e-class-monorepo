import { viewModels } from '@maany_shr/e-class-models';
import {
    SaveGroupNotesUseCaseResponseSchema,
    TSaveGroupNotesUseCaseResponse,
    TSaveGroupNotesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveGroupNotesPresenterUtilities = {};

export const SaveGroupNotesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveGroupNotesUseCaseResponse,
        viewModels.TSaveGroupNotesViewModel,
        TSaveGroupNotesPresenterUtilities
    >;

type TSaveGroupNotesResponseMiddleware = typeof SaveGroupNotesResponseMiddleware;

export default class SaveGroupNotesPresenter extends BasePresenter<
    TSaveGroupNotesUseCaseResponse,
    viewModels.TSaveGroupNotesViewModel,
    TSaveGroupNotesPresenterUtilities,
    TSaveGroupNotesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveGroupNotesViewModel) => void,
        viewUtilities: TSaveGroupNotesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveGroupNotesUseCaseResponseSchema,
                viewModel: viewModels.SaveGroupNotesViewModelSchema
            },
            middleware: SaveGroupNotesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveGroupNotesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveGroupNotesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSaveGroupNotesErrorResponse,
            TSaveGroupNotesResponseMiddleware
        >,
    ): viewModels.TSaveGroupNotesViewModel {
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
