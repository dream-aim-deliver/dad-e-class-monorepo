import { viewModels } from '@maany_shr/e-class-models';
import {
    TSaveLessonComponentsUseCaseResponse,
    SaveLessonComponentsUseCaseResponseSchema,
    TSaveLessonComponentsUseCaseErrorResponse
} from "@dream-aim-deliver/e-class-cms-rest";
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TLessonComponentsPresenterUtilities = {};

export const SaveLessonComponentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveLessonComponentsUseCaseResponse,
        viewModels.TSaveLessonComponentsViewModel,
        TLessonComponentsPresenterUtilities
    >;

type TSaveLessonComponentsResponseMiddleware =
    typeof SaveLessonComponentsResponseMiddleware;

export default class LessonComponentsPresenter extends BasePresenter<
    TSaveLessonComponentsUseCaseResponse,
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
                    SaveLessonComponentsUseCaseResponseSchema,
                viewModel: viewModels.SaveLessonComponentsViewModelSchema
            },
            middleware: SaveLessonComponentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveLessonComponentsUseCaseResponse,
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
            TSaveLessonComponentsUseCaseErrorResponse,
            TSaveLessonComponentsResponseMiddleware
        >,
    ): viewModels.TSaveLessonComponentsViewModel {
        // TODO: Get rid of ignores after fixing typing
        if (response.data.errorType === 'ConflictError') {
            return {
                mode: 'conflict',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                    // @ts-ignore
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
