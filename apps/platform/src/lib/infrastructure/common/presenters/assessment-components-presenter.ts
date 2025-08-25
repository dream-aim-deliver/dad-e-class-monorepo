import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TAssessmentComponentsPresenterUtilities = {};

export const ListAssessmentComponentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListAssessmentComponentsUseCaseResponse,
        viewModels.TAssessmentComponentListViewModel,
        TAssessmentComponentsPresenterUtilities
    >;

type TListAssessmentComponentsResponseMiddleware =
    typeof ListAssessmentComponentsResponseMiddleware;

export default class AssessmentComponentsPresenter extends BasePresenter<
    useCaseModels.TListAssessmentComponentsUseCaseResponse,
    viewModels.TAssessmentComponentListViewModel,
    TAssessmentComponentsPresenterUtilities,
    TListAssessmentComponentsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TAssessmentComponentListViewModel,
        ) => void,
        viewUtilities: TAssessmentComponentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ListAssessmentComponentsUseCaseResponseSchema,
                viewModel: viewModels.AssessmentComponentListViewModelSchema
            },
            middleware: ListAssessmentComponentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListAssessmentComponentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TAssessmentComponentListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListAssessmentComponentsUseCaseErrorResponse,
            TListAssessmentComponentsResponseMiddleware
        >,
    ): viewModels.TAssessmentComponentListViewModel {
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
