import { viewModels } from '@maany_shr/e-class-models';
import {
    GetGroupNoteTemplateUseCaseResponseSchema,
    TGetGroupNoteTemplateUseCaseResponse,
    TGetGroupNoteTemplateErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetGroupNoteTemplatePresenterUtilities = {};

export const GetGroupNoteTemplateResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetGroupNoteTemplateUseCaseResponse,
        viewModels.TGetGroupNoteTemplateViewModel,
        TGetGroupNoteTemplatePresenterUtilities
    >;

type TGetGroupNoteTemplateResponseMiddleware = typeof GetGroupNoteTemplateResponseMiddleware;

export default class GetGroupNoteTemplatePresenter extends BasePresenter<
    TGetGroupNoteTemplateUseCaseResponse,
    viewModels.TGetGroupNoteTemplateViewModel,
    TGetGroupNoteTemplatePresenterUtilities,
    TGetGroupNoteTemplateResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetGroupNoteTemplateViewModel) => void,
        viewUtilities: TGetGroupNoteTemplatePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetGroupNoteTemplateUseCaseResponseSchema,
                viewModel: viewModels.GetGroupNoteTemplateViewModelSchema
            },
            middleware: GetGroupNoteTemplateResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetGroupNoteTemplateUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetGroupNoteTemplateViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetGroupNoteTemplateErrorResponse,
            TGetGroupNoteTemplateResponseMiddleware
        >,
    ): viewModels.TGetGroupNoteTemplateViewModel {
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
