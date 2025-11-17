import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';
import {
    TGetStudentCoachingSessionUseCaseErrorResponse,
    TGetStudentCoachingSessionUseCaseResponse,
    GetStudentCoachingSessionUseCaseResponseSchema,
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TStudentCoachingSessionPresenterUtilities = {};

export const GetStudentCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetStudentCoachingSessionUseCaseResponse,
        viewModels.TStudentCoachingSessionViewModel,
        TStudentCoachingSessionPresenterUtilities
    >;

type TGetStudentCoachingSessionResponseMiddleware =
    typeof GetStudentCoachingSessionResponseMiddleware;

export default class StudentCoachingSessionPresenter extends BasePresenter<
    TGetStudentCoachingSessionUseCaseResponse,
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
                responseModel: GetStudentCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.StudentCoachingSessionViewModelSchema,
            },
            middleware: GetStudentCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            TGetStudentCoachingSessionUseCaseResponse,
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
            TGetStudentCoachingSessionUseCaseErrorResponse,
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
