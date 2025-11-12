import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateGroupCoachingSessionUseCaseResponseSchema,
    TCreateGroupCoachingSessionUseCaseResponse,
    TCreateGroupCoachingSessionErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateGroupCoachingSessionPresenterUtilities = {};

export const CreateGroupCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateGroupCoachingSessionUseCaseResponse,
        viewModels.TCreateGroupCoachingSessionViewModel,
        TCreateGroupCoachingSessionPresenterUtilities
    >;

type TCreateGroupCoachingSessionResponseMiddleware = typeof CreateGroupCoachingSessionResponseMiddleware;

export default class CreateGroupCoachingSessionPresenter extends BasePresenter<
    TCreateGroupCoachingSessionUseCaseResponse,
    viewModels.TCreateGroupCoachingSessionViewModel,
    TCreateGroupCoachingSessionPresenterUtilities,
    TCreateGroupCoachingSessionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateGroupCoachingSessionViewModel) => void,
        viewUtilities: TCreateGroupCoachingSessionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateGroupCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.CreateGroupCoachingSessionViewModelSchema
            },
            middleware: CreateGroupCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateGroupCoachingSessionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateGroupCoachingSessionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateGroupCoachingSessionErrorResponse,
            TCreateGroupCoachingSessionResponseMiddleware
        >,
    ): viewModels.TCreateGroupCoachingSessionViewModel {
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
