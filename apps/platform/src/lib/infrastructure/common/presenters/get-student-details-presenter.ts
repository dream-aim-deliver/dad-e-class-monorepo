import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetStudentDetailsUseCaseResponse,
    TGetStudentDetailsErrorResponse,
    GetStudentDetailsUseCaseResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetStudentDetailsPresenterUtilities = {};

export const GetStudentDetailsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetStudentDetailsUseCaseResponse,
        viewModels.TGetStudentDetailsViewModel,
        TGetStudentDetailsPresenterUtilities
    >;

type TGetStudentDetailsResponseMiddleware = typeof GetStudentDetailsResponseMiddleware;

export default class GetStudentDetailsPresenter extends BasePresenter<
    TGetStudentDetailsUseCaseResponse,
    viewModels.TGetStudentDetailsViewModel,
    TGetStudentDetailsPresenterUtilities,
    TGetStudentDetailsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetStudentDetailsViewModel) => void,
        viewUtilities: TGetStudentDetailsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetStudentDetailsUseCaseResponseSchema,
                viewModel: viewModels.GetStudentDetailsViewModelSchema
            },
            middleware: GetStudentDetailsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetStudentDetailsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetStudentDetailsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetStudentDetailsErrorResponse,
            TGetStudentDetailsResponseMiddleware
        >,
    ): viewModels.TGetStudentDetailsViewModel {
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
