import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TAssessmentProgressesPresenterUtilities = {};

export const ListAssessmentProgressesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListAssessmentProgressesUseCaseResponse,
        viewModels.TAssessmentProgressListViewModel,
        TAssessmentProgressesPresenterUtilities
    >;

type TListAssessmentProgressesResponseMiddleware =
    typeof ListAssessmentProgressesResponseMiddleware;

export default class AssessmentProgressesPresenter extends BasePresenter<
    useCaseModels.TListAssessmentProgressesUseCaseResponse,
    viewModels.TAssessmentProgressListViewModel,
    TAssessmentProgressesPresenterUtilities,
    TListAssessmentProgressesResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TAssessmentProgressListViewModel,
        ) => void,
        viewUtilities: TAssessmentProgressesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ListAssessmentProgressesUseCaseResponseSchema,
                viewModel: viewModels.AssessmentProgressListViewModelSchema
            },
            middleware: ListAssessmentProgressesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListAssessmentProgressesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TAssessmentProgressListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListAssessmentProgressesUseCaseErrorResponse,
            TListAssessmentProgressesResponseMiddleware
        >,
    ): viewModels.TAssessmentProgressListViewModel {
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
