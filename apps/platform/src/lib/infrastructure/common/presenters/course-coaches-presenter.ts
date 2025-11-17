import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    ListCoachesUseCaseResponseSchema,
    TListCoachesUseCaseResponse,
    TListCoachesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseCoachesPresenterUtilities = {};

export const ListCourseCoachesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachesUseCaseResponse,
        viewModels.TCoachListViewModel,
        TCourseCoachesPresenterUtilities
    >;

type TListCourseCoachesResponseMiddleware = typeof ListCourseCoachesResponseMiddleware;

export default class CourseCoachesPresenter extends BasePresenter<
    TListCoachesUseCaseResponse,
    viewModels.TCoachListViewModel,
    TCourseCoachesPresenterUtilities,
    TListCourseCoachesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCoachListViewModel) => void,
        viewUtilities: TCourseCoachesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachesUseCaseResponseSchema,
                viewModel: viewModels.CoachListViewModelSchema
            },
            middleware: ListCourseCoachesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCoachesErrorResponse,
            TListCourseCoachesResponseMiddleware
        >,
    ): viewModels.TCoachListViewModel {
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
