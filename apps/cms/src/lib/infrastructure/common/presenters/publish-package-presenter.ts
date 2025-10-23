import { viewModels } from '@maany_shr/e-class-models';
import {
    PublishPackageUseCaseResponseSchema,
    TPublishPackageUseCaseResponse,
    TPublishPackageErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TPublishPackagePresenterUtilities = {};

export const PublishPackageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TPublishPackageUseCaseResponse,
        viewModels.TPublishPackageViewModel,
        TPublishPackagePresenterUtilities
    >;

type TPublishPackageResponseMiddleware = typeof PublishPackageResponseMiddleware;

export default class PublishPackagePresenter extends BasePresenter<
    TPublishPackageUseCaseResponse,
    viewModels.TPublishPackageViewModel,
    TPublishPackagePresenterUtilities,
    TPublishPackageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TPublishPackageViewModel) => void,
        viewUtilities: TPublishPackagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: PublishPackageUseCaseResponseSchema,
                viewModel: viewModels.PublishPackageViewModelSchema
            },
            middleware: PublishPackageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TPublishPackageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPublishPackageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TPublishPackageErrorResponse,
            TPublishPackageResponseMiddleware
        >,
    ): viewModels.TPublishPackageViewModel {
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
