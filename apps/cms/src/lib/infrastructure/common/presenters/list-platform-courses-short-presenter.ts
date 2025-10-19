import { viewModels } from '@maany_shr/e-class-models';
import {
    ListPlatformCoursesShortUseCaseResponseSchema,
    TListPlatformCoursesShortUseCaseResponse,
    TListPlatformCoursesShortErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListPlatformCoursesShortPresenterUtilities = {};

export const ListPlatformCoursesShortResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListPlatformCoursesShortUseCaseResponse,
        viewModels.TListPlatformCoursesShortViewModel,
        TListPlatformCoursesShortPresenterUtilities
    >;

type TListPlatformCoursesShortResponseMiddleware = typeof ListPlatformCoursesShortResponseMiddleware;

export default class ListPlatformCoursesShortPresenter extends BasePresenter<
    TListPlatformCoursesShortUseCaseResponse,
    viewModels.TListPlatformCoursesShortViewModel,
    TListPlatformCoursesShortPresenterUtilities,
    TListPlatformCoursesShortResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListPlatformCoursesShortViewModel) => void,
        viewUtilities: TListPlatformCoursesShortPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListPlatformCoursesShortUseCaseResponseSchema,
                viewModel: viewModels.ListPlatformCoursesShortViewModelSchema
            },
            middleware: ListPlatformCoursesShortResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListPlatformCoursesShortUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListPlatformCoursesShortViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListPlatformCoursesShortErrorResponse,
            TListPlatformCoursesShortResponseMiddleware
        >,
    ): viewModels.TListPlatformCoursesShortViewModel {
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
