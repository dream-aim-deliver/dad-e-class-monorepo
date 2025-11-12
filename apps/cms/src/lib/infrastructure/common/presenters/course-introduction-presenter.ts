import { viewModels } from '@maany_shr/e-class-models';
import {
    GetCourseIntroductionUseCaseResponseSchema,
    TGetCourseIntroductionUseCaseResponse,
    TGetCourseIntroductionUseCaseErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseIntroductionPresenterUtilities = {};

export const GetCourseIntroductionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCourseIntroductionUseCaseResponse,
        viewModels.TCourseIntroductionViewModel,
        TCourseIntroductionPresenterUtilities
    >;

type TGetCourseIntroductionResponseMiddleware =
    typeof GetCourseIntroductionResponseMiddleware;

export default class CourseIntroductionPresenter extends BasePresenter<
    TGetCourseIntroductionUseCaseResponse,
    viewModels.TCourseIntroductionViewModel,
    TCourseIntroductionPresenterUtilities,
    TGetCourseIntroductionResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TCourseIntroductionViewModel,
        ) => void,
        viewUtilities: TCourseIntroductionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    GetCourseIntroductionUseCaseResponseSchema,
                viewModel: viewModels.CourseIntroductionViewModelSchema
            },
            middleware: GetCourseIntroductionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCourseIntroductionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseIntroductionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCourseIntroductionUseCaseErrorResponse,
            TGetCourseIntroductionResponseMiddleware
        >,
    ): viewModels.TCourseIntroductionViewModel {
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
