import { viewModels } from '@maany_shr/e-class-models';
import {
    SavePackageGroupNoteTemplateUseCaseResponseSchema,
    TSavePackageGroupNoteTemplateUseCaseResponse,
    TSavePackageGroupNoteTemplateErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSavePackageGroupNoteTemplatePresenterUtilities = {};

export const SavePackageGroupNoteTemplateResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSavePackageGroupNoteTemplateUseCaseResponse,
        viewModels.TSavePackageGroupNoteTemplateViewModel,
        TSavePackageGroupNoteTemplatePresenterUtilities
    >;

type TSavePackageGroupNoteTemplateResponseMiddleware = typeof SavePackageGroupNoteTemplateResponseMiddleware;

export default class SavePackageGroupNoteTemplatePresenter extends BasePresenter<
    TSavePackageGroupNoteTemplateUseCaseResponse,
    viewModels.TSavePackageGroupNoteTemplateViewModel,
    TSavePackageGroupNoteTemplatePresenterUtilities,
    TSavePackageGroupNoteTemplateResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSavePackageGroupNoteTemplateViewModel) => void,
        viewUtilities: TSavePackageGroupNoteTemplatePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SavePackageGroupNoteTemplateUseCaseResponseSchema,
                viewModel: viewModels.SavePackageGroupNoteTemplateViewModelSchema
            },
            middleware: SavePackageGroupNoteTemplateResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSavePackageGroupNoteTemplateUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSavePackageGroupNoteTemplateViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSavePackageGroupNoteTemplateErrorResponse,
            TSavePackageGroupNoteTemplateResponseMiddleware
        >,
    ): viewModels.TSavePackageGroupNoteTemplateViewModel {
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
