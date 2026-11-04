import { viewModels } from '@maany_shr/e-class-models';
import {
    GetPackageGroupNoteTemplateUseCaseResponseSchema,
    TGetPackageGroupNoteTemplateUseCaseResponse,
    TGetPackageGroupNoteTemplateErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetPackageGroupNoteTemplatePresenterUtilities = {};

export const GetPackageGroupNoteTemplateResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetPackageGroupNoteTemplateUseCaseResponse,
        viewModels.TGetPackageGroupNoteTemplateViewModel,
        TGetPackageGroupNoteTemplatePresenterUtilities
    >;

type TGetPackageGroupNoteTemplateResponseMiddleware = typeof GetPackageGroupNoteTemplateResponseMiddleware;

export default class GetPackageGroupNoteTemplatePresenter extends BasePresenter<
    TGetPackageGroupNoteTemplateUseCaseResponse,
    viewModels.TGetPackageGroupNoteTemplateViewModel,
    TGetPackageGroupNoteTemplatePresenterUtilities,
    TGetPackageGroupNoteTemplateResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetPackageGroupNoteTemplateViewModel) => void,
        viewUtilities: TGetPackageGroupNoteTemplatePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetPackageGroupNoteTemplateUseCaseResponseSchema,
                viewModel: viewModels.GetPackageGroupNoteTemplateViewModelSchema
            },
            middleware: GetPackageGroupNoteTemplateResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetPackageGroupNoteTemplateUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetPackageGroupNoteTemplateViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetPackageGroupNoteTemplateErrorResponse,
            TGetPackageGroupNoteTemplateResponseMiddleware
        >,
    ): viewModels.TGetPackageGroupNoteTemplateViewModel {
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
