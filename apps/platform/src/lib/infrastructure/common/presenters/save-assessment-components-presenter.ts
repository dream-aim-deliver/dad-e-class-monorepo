import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TAssessmentComponentsPresenterUtilities = {};

export const SaveAssessmentComponentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TSaveAssessmentComponentsUseCaseResponse,
        viewModels.TAssessmentComponentViewModel,
        TAssessmentComponentsPresenterUtilities
    >;

type TSaveAssessmentComponentsResponseMiddleware =
    typeof SaveAssessmentComponentsResponseMiddleware;

export default class AssessmentComponentsPresenter extends BasePresenter<
    useCaseModels.TSaveAssessmentComponentsUseCaseResponse,
    viewModels.TAssessmentComponentViewModel,
    TAssessmentComponentsPresenterUtilities,
    TSaveAssessmentComponentsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TAssessmentComponentViewModel,
        ) => void,
        viewUtilities: TAssessmentComponentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.SaveAssessmentComponentsUseCaseResponseSchema,
                viewModel: viewModels.AssessmentComponentViewModelSchema,
            },
            middleware: SaveAssessmentComponentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TSaveAssessmentComponentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TAssessmentComponentViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TSaveAssessmentComponentsUseCaseErrorResponse,
            TSaveAssessmentComponentsResponseMiddleware
        >,
    ): viewModels.TAssessmentComponentViewModel {
        return {
            mode: 'kaboom',
            data: {
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
            },
        };
    }
}
