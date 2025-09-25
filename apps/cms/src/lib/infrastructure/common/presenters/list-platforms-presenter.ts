import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

export type TListPlatformsPresenterUtilities = object;

export const ListPlatformsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListPlatformsUseCaseResponse,
        viewModels.TPlatformListViewModel,
        TListPlatformsPresenterUtilities
    >;

type TListPlatformsResponseMiddleware = typeof ListPlatformsResponseMiddleware;

export default class ListPlatformsPresenter extends BasePresenter<
    useCaseModels.TListPlatformsUseCaseResponse,
    viewModels.TPlatformListViewModel,
    TListPlatformsPresenterUtilities,
    TListPlatformsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TPlatformListViewModel) => void,
        viewUtilities: TListPlatformsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.ListPlatformsUseCaseResponseSchema,
                viewModel: viewModels.PlatformListViewModelSchema
            },
            middleware: ListPlatformsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListPlatformsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPlatformListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListPlatformsUseCaseErrorResponse,
            TListPlatformsResponseMiddleware
        >,
    ): viewModels.TPlatformListViewModel {
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