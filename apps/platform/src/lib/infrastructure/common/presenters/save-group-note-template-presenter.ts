import { viewModels } from '@maany_shr/e-class-models';
import {
    SaveGroupNoteTemplateUseCaseResponseSchema,
    TSaveGroupNoteTemplateUseCaseResponse,
    TSaveGroupNoteTemplateErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveGroupNoteTemplatePresenterUtilities = {};

export const SaveGroupNoteTemplateResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveGroupNoteTemplateUseCaseResponse,
        viewModels.TSaveGroupNoteTemplateViewModel,
        TSaveGroupNoteTemplatePresenterUtilities
    >;

type TSaveGroupNoteTemplateResponseMiddleware = typeof SaveGroupNoteTemplateResponseMiddleware;

export default class SaveGroupNoteTemplatePresenter extends BasePresenter<
    TSaveGroupNoteTemplateUseCaseResponse,
    viewModels.TSaveGroupNoteTemplateViewModel,
    TSaveGroupNoteTemplatePresenterUtilities,
    TSaveGroupNoteTemplateResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveGroupNoteTemplateViewModel) => void,
        viewUtilities: TSaveGroupNoteTemplatePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveGroupNoteTemplateUseCaseResponseSchema,
                viewModel: viewModels.SaveGroupNoteTemplateViewModelSchema
            },
            middleware: SaveGroupNoteTemplateResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveGroupNoteTemplateUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveGroupNoteTemplateViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSaveGroupNoteTemplateErrorResponse,
            TSaveGroupNoteTemplateResponseMiddleware
        >,
    ): viewModels.TSaveGroupNoteTemplateViewModel {
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
