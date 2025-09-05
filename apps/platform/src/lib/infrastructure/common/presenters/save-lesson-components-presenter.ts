import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TLessonComponentsPresenterUtilities = {};

export const SaveLessonComponentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TSaveLessonComponentsUseCaseResponse,
        viewModels.TSaveLessonComponentsViewModel,
        TLessonComponentsPresenterUtilities
    >;

type TSaveLessonComponentsResponseMiddleware =
    typeof SaveLessonComponentsResponseMiddleware;

export default class LessonComponentsPresenter extends BasePresenter<
    useCaseModels.TSaveLessonComponentsUseCaseResponse,
    viewModels.TSaveLessonComponentsViewModel,
    TLessonComponentsPresenterUtilities,
    TSaveLessonComponentsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TSaveLessonComponentsViewModel,
        ) => void,
        viewUtilities: TLessonComponentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.SaveLessonComponentsUseCaseResponseSchema,
                viewModel: viewModels.SaveLessonComponentsViewModelSchema
            },
            middleware: SaveLessonComponentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TSaveLessonComponentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveLessonComponentsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TSaveLessonComponentsUseCaseErrorResponse,
            TSaveLessonComponentsResponseMiddleware
        >,
    ): viewModels.TSaveLessonComponentsViewModel {
        if (response.data.errorType === 'ConflictError') {
            return {
                mode: 'conflict',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                    courseVersion: response.data.courseVersion
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
