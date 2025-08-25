import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseStructurePresenterUtilities = {};

export const GetCourseStructureResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetCourseStructureUseCaseResponse,
        viewModels.TCourseStructureViewModel,
        TCourseStructurePresenterUtilities
    >;

type TGetCourseStructureResponseMiddleware =
    typeof GetCourseStructureResponseMiddleware;

export default class CourseStructurePresenter extends BasePresenter<
    useCaseModels.TGetCourseStructureUseCaseResponse,
    viewModels.TCourseStructureViewModel,
    TCourseStructurePresenterUtilities,
    TGetCourseStructureResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCourseStructureViewModel) => void,
        viewUtilities: TCourseStructurePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetCourseStructureUseCaseResponseSchema,
                viewModel: viewModels.CourseStructureViewModelSchema
            },
            middleware: GetCourseStructureResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetCourseStructureUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseStructureViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetCourseStructureUseCaseErrorResponse,
            TGetCourseStructureResponseMiddleware
        >,
    ): viewModels.TCourseStructureViewModel {
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
