import { viewModels } from '@maany_shr/e-class-models';
import {
    SaveCoachingPageUseCaseResponseSchema,
    TSaveCoachingPageUseCaseResponse,
    TSaveCoachingPageErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveCoachingPagePresenterUtilities = {};

export const SaveCoachingPageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveCoachingPageUseCaseResponse,
        viewModels.TSaveCoachingPageViewModel,
        TSaveCoachingPagePresenterUtilities
    >;

type TSaveCoachingPageResponseMiddleware = typeof SaveCoachingPageResponseMiddleware;

export default class SaveCoachingPagePresenter extends BasePresenter<
    TSaveCoachingPageUseCaseResponse,
    viewModels.TSaveCoachingPageViewModel,
    TSaveCoachingPagePresenterUtilities,
    TSaveCoachingPageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveCoachingPageViewModel) => void,
        viewUtilities: TSaveCoachingPagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveCoachingPageUseCaseResponseSchema,
                viewModel: viewModels.SaveCoachingPageViewModelSchema
            },
            middleware: SaveCoachingPageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveCoachingPageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveCoachingPageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSaveCoachingPageErrorResponse,
            TSaveCoachingPageResponseMiddleware
        >,
    ): viewModels.TSaveCoachingPageViewModel {
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
