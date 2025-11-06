import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetEnrolledCourseDetailsResponse,
    GetEnrolledCourseDetailsResponseSchema,
    TGetEnrolledCourseDetailsErrorResponse
} from "@dream-aim-deliver/e-class-cms-rest";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TEnrolledCourseDetailsPresenterUtilities = {};

export const GetEnrolledCourseDetailsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetEnrolledCourseDetailsResponse,
        viewModels.TEnrolledCourseDetailsViewModel,
        TEnrolledCourseDetailsPresenterUtilities
    >;

type TGetEnrolledCourseDetailsResponseMiddleware =
    typeof GetEnrolledCourseDetailsResponseMiddleware;

export default class EnrolledCourseDetailsPresenter extends BasePresenter<
    TGetEnrolledCourseDetailsResponse,
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
                    GetEnrolledCourseDetailsResponseSchema,
                viewModel: viewModels.EnrolledCourseDetailsViewModelSchema
            },
            middleware: GetEnrolledCourseDetailsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetEnrolledCourseDetailsResponse,
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
            TGetEnrolledCourseDetailsErrorResponse,
            TGetEnrolledCourseDetailsResponseMiddleware
        >,
    ): viewModels.TEnrolledCourseDetailsViewModel {
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
