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
        viewModels.TCoursePackagesViewModel,
        TCoursePackagesPresenterUtilities
    >;

type TGetCoursePackagesResponseMiddleware =
    typeof GetCoursePackagesResponseMiddleware;

export default class CoursePackagesPresenter extends BasePresenter<
    useCaseModels.TGetCoursePackagesUseCaseResponse,
    viewModels.TCoursePackagesViewModel,
    TCoursePackagesPresenterUtilities,
    TGetCoursePackagesResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TCoursePackagesViewModel,
        ) => void,
        viewUtilities: TCoursePackagesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetCoursePackagesUseCaseResponseSchema,
                viewModel: viewModels.CoursePackagesViewModelSchema
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
    ): viewModels.TCoursePackagesViewModel {
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
    ): viewModels.TCoursePackagesViewModel {
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
