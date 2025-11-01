import { viewModels } from '@maany_shr/e-class-models';
import {
    SaveCourseAdminDetailsUseCaseResponseSchema,
    TSaveCourseAdminDetailsUseCaseResponse,
    TSaveCourseAdminDetailsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveCourseAdminDetailsPresenterUtilities = {};

export const SaveCourseAdminDetailsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveCourseAdminDetailsUseCaseResponse,
        viewModels.TSaveCourseAdminDetailsViewModel,
        TSaveCourseAdminDetailsPresenterUtilities
    >;

type TSaveCourseAdminDetailsResponseMiddleware = typeof SaveCourseAdminDetailsResponseMiddleware;

export default class SaveCourseAdminDetailsPresenter extends BasePresenter<
    TSaveCourseAdminDetailsUseCaseResponse,
    viewModels.TSaveCourseAdminDetailsViewModel,
    TSaveCourseAdminDetailsPresenterUtilities,
    TSaveCourseAdminDetailsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveCourseAdminDetailsViewModel) => void,
        viewUtilities: TSaveCourseAdminDetailsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveCourseAdminDetailsUseCaseResponseSchema,
                viewModel: viewModels.SaveCourseAdminDetailsViewModelSchema
            },
            middleware: SaveCourseAdminDetailsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveCourseAdminDetailsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveCourseAdminDetailsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSaveCourseAdminDetailsErrorResponse,
            TSaveCourseAdminDetailsResponseMiddleware
        >,
    ): viewModels.TSaveCourseAdminDetailsViewModel {
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
