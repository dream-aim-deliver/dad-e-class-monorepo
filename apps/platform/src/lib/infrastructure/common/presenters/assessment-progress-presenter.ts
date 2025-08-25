import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TAssessmentProgressPresenterUtilities = {};

export const SubmitAssessmentProgressResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TSubmitAssessmentProgressUseCaseResponse,
        viewModels.TAssessmentProgressViewModel,
        TAssessmentProgressPresenterUtilities
    >;

type TSubmitAssessmentProgressResponseMiddleware =
    typeof SubmitAssessmentProgressResponseMiddleware;

export default class AssessmentProgressPresenter extends BasePresenter<
    useCaseModels.TSubmitAssessmentProgressUseCaseResponse,
    viewModels.TAssessmentProgressViewModel,
    TAssessmentProgressPresenterUtilities,
    TSubmitAssessmentProgressResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TAssessmentProgressViewModel,
        ) => void,
        viewUtilities: TAssessmentProgressPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.SubmitAssessmentProgressUseCaseResponseSchema,
                viewModel: viewModels.AssessmentProgressViewModelSchema
            },
            middleware: SubmitAssessmentProgressResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TSubmitAssessmentProgressUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TAssessmentProgressViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TSubmitAssessmentProgressUseCaseErrorResponse,
            TSubmitAssessmentProgressResponseMiddleware
        >,
    ): viewModels.TAssessmentProgressViewModel {
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
