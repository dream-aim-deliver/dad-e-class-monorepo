import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TStudentProgressPresenterUtilities = {};

export const GetStudentProgressResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetStudentProgressUseCaseResponse,
        viewModels.TStudentProgressViewModel,
        TStudentProgressPresenterUtilities
    >;

type TGetStudentProgressResponseMiddleware =
    typeof GetStudentProgressResponseMiddleware;

export default class StudentProgressPresenter extends BasePresenter<
    useCaseModels.TGetStudentProgressUseCaseResponse,
    viewModels.TStudentProgressViewModel,
    TStudentProgressPresenterUtilities,
    TGetStudentProgressResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TStudentProgressViewModel) => void,
        viewUtilities: TStudentProgressPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetStudentProgressUseCaseResponseSchema,
                viewModel: viewModels.StudentProgressViewModelSchema
            },
            middleware: GetStudentProgressResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetStudentProgressUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TStudentProgressViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetStudentProgressUseCaseErrorResponse,
            TGetStudentProgressResponseMiddleware
        >,
    ): viewModels.TStudentProgressViewModel {
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
