import { viewModels } from '@maany_shr/e-class-models';
import {
    AddCourseCoachUseCaseResponseSchema,
    TAddCourseCoachUseCaseResponse,
    TAddCourseCoachErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TAddCourseCoachPresenterUtilities = {};

export const AddCourseCoachResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TAddCourseCoachUseCaseResponse,
        viewModels.TAddCourseCoachViewModel,
        TAddCourseCoachPresenterUtilities
    >;

type TAddCourseCoachResponseMiddleware = typeof AddCourseCoachResponseMiddleware;

export default class AddCourseCoachPresenter extends BasePresenter<
    TAddCourseCoachUseCaseResponse,
    viewModels.TAddCourseCoachViewModel,
    TAddCourseCoachPresenterUtilities,
    TAddCourseCoachResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TAddCourseCoachViewModel) => void,
        viewUtilities: TAddCourseCoachPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: AddCourseCoachUseCaseResponseSchema,
                viewModel: viewModels.AddCourseCoachViewModelSchema
            },
            middleware: AddCourseCoachResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TAddCourseCoachUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TAddCourseCoachViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TAddCourseCoachErrorResponse,
            TAddCourseCoachResponseMiddleware
        >,
    ): viewModels.TAddCourseCoachViewModel {
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
