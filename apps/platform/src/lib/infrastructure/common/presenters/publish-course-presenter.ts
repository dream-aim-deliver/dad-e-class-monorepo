import { viewModels } from '@maany_shr/e-class-models';
import {
    PublishCourseUseCaseResponseSchema,
    TPublishCourseUseCaseResponse,
    TPublishCourseErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TPublishCoursePresenterUtilities = {};

export const PublishCourseResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TPublishCourseUseCaseResponse,
        viewModels.TPublishCourseViewModel,
        TPublishCoursePresenterUtilities
    >;

type TPublishCourseResponseMiddleware = typeof PublishCourseResponseMiddleware;

export default class PublishCoursePresenter extends BasePresenter<
    TPublishCourseUseCaseResponse,
    viewModels.TPublishCourseViewModel,
    TPublishCoursePresenterUtilities,
    TPublishCourseResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TPublishCourseViewModel) => void,
        viewUtilities: TPublishCoursePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: PublishCourseUseCaseResponseSchema,
                viewModel: viewModels.PublishCourseViewModelSchema
            },
            middleware: PublishCourseResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TPublishCourseUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPublishCourseViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TPublishCourseErrorResponse,
            TPublishCourseResponseMiddleware
        >,
    ): viewModels.TPublishCourseViewModel {
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
