import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseMaterialsPresenterUtilities = {};

export const ListCourseMaterialsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCourseMaterialsUseCaseResponse,
        viewModels.TCourseMaterialsListViewModel,
        TCourseMaterialsPresenterUtilities
    >;

type TListCourseMaterialsResponseMiddleware =
    typeof ListCourseMaterialsResponseMiddleware;

export default class CourseMaterialsPresenter extends BasePresenter<
    useCaseModels.TListCourseMaterialsUseCaseResponse,
    viewModels.TCourseMaterialsListViewModel,
    TCourseMaterialsPresenterUtilities,
    TListCourseMaterialsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TCourseMaterialsListViewModel,
        ) => void,
        viewUtilities: TCourseMaterialsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ListCourseMaterialsUseCaseResponseSchema,
                viewModel: viewModels.CourseMaterialsListViewModelSchema
            },
            middleware: ListCourseMaterialsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCourseMaterialsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseMaterialsListViewModel {
        // Return view model with default mode for success
        return {
            data: response.data,
            mode: 'default'
        };
    }

    presentError(
        response: Extract<
            useCaseModels.TListCourseMaterialsUseCaseResponse,
            { success: false }
        >,
    ): viewModels.TCourseMaterialsListViewModel {
        // Return view model with kaboom mode for errors
        return {
            data: response.data,
            mode: 'kaboom'
        };
    }
}
