import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCategoriesUseCaseResponseSchema,
    TListCategoriesUseCaseResponse,
    TListCategoriesErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCategoriesPresenterUtilities = {};

export const ListCategoriesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCategoriesUseCaseResponse,
        viewModels.TCategoryListViewModel,
        TCategoriesPresenterUtilities
    >;

type TListCategoriesResponseMiddleware = typeof ListCategoriesResponseMiddleware;

export default class CategoriesPresenter extends BasePresenter<
    TListCategoriesUseCaseResponse,
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
                responseModel: ListCategoriesUseCaseResponseSchema,
                viewModel: viewModels.CategoryListViewModelSchema
            },
            middleware: ListCategoriesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCategoriesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCategoryListViewModel {
        return {
            mode: 'default',
            data: {
                categories: response.data.categories.map((category) => ({
                    id: typeof category.id === 'string' ? parseInt(category.id, 10) : category.id,
                    name: category.name,
                }))
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TListCategoriesErrorResponse,
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
