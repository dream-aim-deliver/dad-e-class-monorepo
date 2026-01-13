import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TPublicCourseDetailsPresenterUtilities = {};

export const GetPublicCourseDetailsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetPublicCourseDetailsUseCaseResponse,
        viewModels.TPublicCourseDetailsViewModel,
        TPublicCourseDetailsPresenterUtilities
    >;

type TGetPublicCourseDetailsResponseMiddleware =
    typeof GetPublicCourseDetailsResponseMiddleware;

export default class PublicCourseDetailsPresenter extends BasePresenter<
    useCaseModels.TGetPublicCourseDetailsUseCaseResponse,
    viewModels.TPublicCourseDetailsViewModel,
    TPublicCourseDetailsPresenterUtilities,
    TGetPublicCourseDetailsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TPublicCourseDetailsViewModel) => void,
        viewUtilities: TPublicCourseDetailsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetPublicCourseDetailsUseCaseResponseSchema,
                viewModel: viewModels.PublicCourseDetailsViewModelSchema
            },
            middleware: GetPublicCourseDetailsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetPublicCourseDetailsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPublicCourseDetailsViewModel {
        return {
            mode: 'default',
            data: response.data
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetPublicCourseDetailsUseCaseErrorResponse,
            TGetPublicCourseDetailsResponseMiddleware
        >,
    ): viewModels.TPublicCourseDetailsViewModel {
        if (response.data?.errorType === 'NotFoundError') {
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
                message: response.data?.message || 'Unknown error',
                operation: response.data?.operation || 'unknown',
                context: response.data?.context || {}
            }
        };
    }
}
