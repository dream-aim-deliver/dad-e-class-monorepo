import { viewModels } from '@maany_shr/e-class-models';
import {
    RemoveCourseCoachUseCaseResponseSchema,
    TRemoveCourseCoachUseCaseResponse,
    TRemoveCourseCoachErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TRemoveCourseCoachPresenterUtilities = {};

export const RemoveCourseCoachResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TRemoveCourseCoachUseCaseResponse,
        viewModels.TRemoveCourseCoachViewModel,
        TRemoveCourseCoachPresenterUtilities
    >;

type TRemoveCourseCoachResponseMiddleware = typeof RemoveCourseCoachResponseMiddleware;

export default class RemoveCourseCoachPresenter extends BasePresenter<
    TRemoveCourseCoachUseCaseResponse,
    viewModels.TRemoveCourseCoachViewModel,
    TRemoveCourseCoachPresenterUtilities,
    TRemoveCourseCoachResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TRemoveCourseCoachViewModel) => void,
        viewUtilities: TRemoveCourseCoachPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: RemoveCourseCoachUseCaseResponseSchema,
                viewModel: viewModels.RemoveCourseCoachViewModelSchema
            },
            middleware: RemoveCourseCoachResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TRemoveCourseCoachUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TRemoveCourseCoachViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TRemoveCourseCoachErrorResponse,
            TRemoveCourseCoachResponseMiddleware
        >,
    ): viewModels.TRemoveCourseCoachViewModel {
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
