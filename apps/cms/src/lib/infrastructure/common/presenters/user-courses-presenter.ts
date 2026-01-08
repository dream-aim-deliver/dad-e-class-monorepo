import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TListUserCoursesUseCaseResponse,
    TListUserCoursesUseCaseErrorResponse,
    ListUserCoursesUseCaseResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUserCoursesPresenterUtilities = {};

export const ListUserCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListUserCoursesUseCaseResponse,
        viewModels.TListUserCoursesViewModel,
        TUserCoursesPresenterUtilities
    >;

type TListUserCoursesResponseMiddleware =
    typeof ListUserCoursesResponseMiddleware;

export default class UserCoursesPresenter extends BasePresenter<
    TListUserCoursesUseCaseResponse,
    viewModels.TListUserCoursesViewModel,
    TUserCoursesPresenterUtilities,
    TListUserCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListUserCoursesViewModel) => void,
        viewUtilities: TUserCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    ListUserCoursesUseCaseResponseSchema,
                viewModel: viewModels.ListUserCoursesViewModelSchema
            },
            middleware: ListUserCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListUserCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListUserCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListUserCoursesUseCaseErrorResponse,
            TListUserCoursesResponseMiddleware
        >,
    ): viewModels.TListUserCoursesViewModel {
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
