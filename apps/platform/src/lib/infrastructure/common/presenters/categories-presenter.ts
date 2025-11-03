import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCategoriesPresenterUtilities = {};

export const ListCategoriesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCategoriesUseCaseResponse,
        viewModels.TCategoryListViewModel,
        TCategoriesPresenterUtilities
    >;

type TListCategoriesResponseMiddleware = typeof ListCategoriesResponseMiddleware;

export default class CategoriesPresenter extends BasePresenter<
    useCaseModels.TListCategoriesUseCaseResponse,
    viewModels.TCategoryListViewModel,
    TCategoriesPresenterUtilities,
    TListCategoriesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCategoryListViewModel) => void,
        viewUtilities: TCategoriesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.ListCategoriesUseCaseResponseSchema,
                viewModel: viewModels.CategoryListViewModelSchema
            },
            middleware: ListCategoriesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCategoriesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCategoryListViewModel {
        return {
            mode: 'default',
            data: {
                categories: response.data.categories.map((category) => ({
                    id: category.id,
                    name: category.name,
                }))
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListCategoriesErrorResponse,
            TListCategoriesResponseMiddleware
        >,
    ): viewModels.TCategoryListViewModel {
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
