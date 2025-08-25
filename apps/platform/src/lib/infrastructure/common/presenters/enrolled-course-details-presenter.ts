import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TEnrolledCourseDetailsPresenterUtilities = {};

export const GetEnrolledCourseDetailsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetEnrolledCourseDetailsUseCaseResponse,
        viewModels.TEnrolledCourseDetailsViewModel,
        TEnrolledCourseDetailsPresenterUtilities
    >;

type TGetEnrolledCourseDetailsResponseMiddleware =
    typeof GetEnrolledCourseDetailsResponseMiddleware;

export default class EnrolledCourseDetailsPresenter extends BasePresenter<
    useCaseModels.TGetEnrolledCourseDetailsUseCaseResponse,
    viewModels.TEnrolledCourseDetailsViewModel,
    TEnrolledCourseDetailsPresenterUtilities,
    TGetEnrolledCourseDetailsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TEnrolledCourseDetailsViewModel,
        ) => void,
        viewUtilities: TEnrolledCourseDetailsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetEnrolledCourseDetailsUseCaseResponseSchema,
                viewModel: viewModels.EnrolledCourseDetailsViewModelSchema
            },
            middleware: GetEnrolledCourseDetailsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetEnrolledCourseDetailsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TEnrolledCourseDetailsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetEnrolledCourseDetailsUseCaseErrorResponse,
            TGetEnrolledCourseDetailsResponseMiddleware
        >,
    ): viewModels.TEnrolledCourseDetailsViewModel {
        if (response.data.errorType === 'NotFound') {
            return {
                mode: 'not-found',
                data: {

                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context

                }
            };
        }
        if (response.data.errorType === 'ForbiddenError') {
            return {
                mode: 'forbidden',
                data: {

                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context

                }
            };
        }
        if (response.data.errorType === 'AuthenticationError') {
            return {
                mode: 'unauthenticated',
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
