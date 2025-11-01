import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoursePackagesPresenterUtilities = {};

export const GetCoursePackagesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetCoursePackagesUseCaseResponse,
        viewModels.TGetCoursePackagesViewModel,
        TCoursePackagesPresenterUtilities
    >;

type TGetCoursePackagesResponseMiddleware = typeof GetCoursePackagesResponseMiddleware;

export default class CoursePackagesPresenter extends BasePresenter<
    useCaseModels.TGetCoursePackagesUseCaseResponse,
    viewModels.TGetCoursePackagesViewModel,
    TCoursePackagesPresenterUtilities,
    TGetCoursePackagesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCoursePackagesViewModel) => void,
        viewUtilities: TCoursePackagesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetCoursePackagesUseCaseResponseSchema,
                viewModel: viewModels.GetCoursePackagesViewModelSchema
            },
            middleware: GetCoursePackagesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetCoursePackagesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetCoursePackagesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetCoursePackagesUseCaseErrorResponse,
            TGetCoursePackagesResponseMiddleware
        >,
    ): viewModels.TGetCoursePackagesViewModel {
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
