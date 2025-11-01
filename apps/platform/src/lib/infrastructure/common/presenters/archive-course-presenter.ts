import { viewModels } from '@maany_shr/e-class-models';
import {
    ArchiveCourseUseCaseResponseSchema,
    TArchiveCourseUseCaseResponse,
    TArchiveCourseErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TArchiveCoursePresenterUtilities = {};

export const ArchiveCourseResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TArchiveCourseUseCaseResponse,
        viewModels.TArchiveCourseViewModel,
        TArchiveCoursePresenterUtilities
    >;

type TArchiveCourseResponseMiddleware = typeof ArchiveCourseResponseMiddleware;

export default class ArchiveCoursePresenter extends BasePresenter<
    TArchiveCourseUseCaseResponse,
    viewModels.TArchiveCourseViewModel,
    TArchiveCoursePresenterUtilities,
    TArchiveCourseResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TArchiveCourseViewModel) => void,
        viewUtilities: TArchiveCoursePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ArchiveCourseUseCaseResponseSchema,
                viewModel: viewModels.ArchiveCourseViewModelSchema
            },
            middleware: ArchiveCourseResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TArchiveCourseUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TArchiveCourseViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TArchiveCourseErrorResponse,
            TArchiveCourseResponseMiddleware
        >,
    ): viewModels.TArchiveCourseViewModel {
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
