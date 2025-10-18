import { viewModels } from '@maany_shr/e-class-models';
import {
    GetGroupNextCoachingSessionUseCaseResponseSchema,
    TGetGroupNextCoachingSessionUseCaseResponse,
    TGetGroupNextCoachingSessionErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetGroupNextCoachingSessionPresenterUtilities = {};

export const GetGroupNextCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetGroupNextCoachingSessionUseCaseResponse,
        viewModels.TGetGroupNextCoachingSessionViewModel,
        TGetGroupNextCoachingSessionPresenterUtilities
    >;

type TGetGroupNextCoachingSessionResponseMiddleware = typeof GetGroupNextCoachingSessionResponseMiddleware;

export default class GetGroupNextCoachingSessionPresenter extends BasePresenter<
    TGetGroupNextCoachingSessionUseCaseResponse,
    viewModels.TGetGroupNextCoachingSessionViewModel,
    TGetGroupNextCoachingSessionPresenterUtilities,
    TGetGroupNextCoachingSessionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetGroupNextCoachingSessionViewModel) => void,
        viewUtilities: TGetGroupNextCoachingSessionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetGroupNextCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.GetGroupNextCoachingSessionViewModelSchema
            },
            middleware: GetGroupNextCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetGroupNextCoachingSessionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetGroupNextCoachingSessionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetGroupNextCoachingSessionErrorResponse,
            TGetGroupNextCoachingSessionResponseMiddleware
        >,
    ): viewModels.TGetGroupNextCoachingSessionViewModel {
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
