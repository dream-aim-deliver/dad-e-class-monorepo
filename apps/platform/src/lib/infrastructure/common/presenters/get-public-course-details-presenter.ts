import { viewModels } from '@maany_shr/e-class-models';
import {
    GetPublicCourseDetailsUseCaseResponseSchema,
    TGetPublicCourseDetailsUseCaseResponse,
    TGetPublicCourseDetailsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetPublicCourseDetailsPresenterUtilities = {};

export const GetPublicCourseDetailsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetPublicCourseDetailsUseCaseResponse,
        viewModels.TGetPublicCourseDetailsViewModel,
        TGetPublicCourseDetailsPresenterUtilities
    >;

type TGetPublicCourseDetailsResponseMiddleware = typeof GetPublicCourseDetailsResponseMiddleware;

export default class GetPublicCourseDetailsPresenter extends BasePresenter<
    TGetPublicCourseDetailsUseCaseResponse,
    viewModels.TGetPublicCourseDetailsViewModel,
    TGetPublicCourseDetailsPresenterUtilities,
    TGetPublicCourseDetailsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetPublicCourseDetailsViewModel) => void,
        viewUtilities: TGetPublicCourseDetailsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetPublicCourseDetailsUseCaseResponseSchema,
                viewModel: viewModels.GetPublicCourseDetailsViewModelSchema
            },
            middleware: GetPublicCourseDetailsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetPublicCourseDetailsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetPublicCourseDetailsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetPublicCourseDetailsErrorResponse,
            TGetPublicCourseDetailsResponseMiddleware
        >,
    ): viewModels.TGetPublicCourseDetailsViewModel {
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
