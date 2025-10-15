import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TStudentCoachingSessionPresenterUtilities = {};

export const GetStudentCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetStudentCoachingSessionUseCaseResponse,
        viewModels.TStudentCoachingSessionViewModel,
        TStudentCoachingSessionPresenterUtilities
    >;

type TGetStudentCoachingSessionResponseMiddleware =
    typeof GetStudentCoachingSessionResponseMiddleware;

export default class StudentCoachingSessionPresenter extends BasePresenter<
    useCaseModels.TGetStudentCoachingSessionUseCaseResponse,
    viewModels.TStudentCoachingSessionViewModel,
    TStudentCoachingSessionPresenterUtilities,
    TGetStudentCoachingSessionResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TStudentCoachingSessionViewModel,
        ) => void,
        viewUtilities: TStudentCoachingSessionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetStudentCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.StudentCoachingSessionViewModelSchema,
            },
            middleware: GetStudentCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetStudentCoachingSessionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TStudentCoachingSessionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetStudentCoachingSessionUseCaseErrorResponse,
            TGetStudentCoachingSessionResponseMiddleware
        >,
    ): viewModels.TStudentCoachingSessionViewModel {
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
