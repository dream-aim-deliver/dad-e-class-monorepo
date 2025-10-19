import { viewModels } from '@maany_shr/e-class-models';
import {
    GetPackageWithCoursesUseCaseResponseSchema,
    TGetPackageWithCoursesUseCaseResponse,
    TGetPackageWithCoursesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetPackageWithCoursesPresenterUtilities = {};

export const GetPackageWithCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetPackageWithCoursesUseCaseResponse,
        viewModels.TGetPackageWithCoursesViewModel,
        TGetPackageWithCoursesPresenterUtilities
    >;

type TGetPackageWithCoursesResponseMiddleware = typeof GetPackageWithCoursesResponseMiddleware;

export default class GetPackageWithCoursesPresenter extends BasePresenter<
    TGetPackageWithCoursesUseCaseResponse,
    viewModels.TGetPackageWithCoursesViewModel,
    TGetPackageWithCoursesPresenterUtilities,
    TGetPackageWithCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetPackageWithCoursesViewModel) => void,
        viewUtilities: TGetPackageWithCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetPackageWithCoursesUseCaseResponseSchema,
                viewModel: viewModels.GetPackageWithCoursesViewModelSchema
            },
            middleware: GetPackageWithCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetPackageWithCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetPackageWithCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetPackageWithCoursesErrorResponse,
            TGetPackageWithCoursesResponseMiddleware
        >,
    ): viewModels.TGetPackageWithCoursesViewModel {
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
