import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseStructurePresenterUtilities = {};

export const SaveCourseStructureResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TSaveCourseStructureUseCaseResponse,
        viewModels.TSaveCourseStructureViewModel,
        TCourseStructurePresenterUtilities
    >;

type TSaveCourseStructureResponseMiddleware =
    typeof SaveCourseStructureResponseMiddleware;

export default class SaveCourseStructurePresenter extends BasePresenter<
    useCaseModels.TSaveCourseStructureUseCaseResponse,
    viewModels.TSaveCourseStructureViewModel,
    TCourseStructurePresenterUtilities,
    TSaveCourseStructureResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TSaveCourseStructureViewModel,
        ) => void,
        viewUtilities: TCourseStructurePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.SaveCourseStructureUseCaseResponseSchema,
                viewModel: viewModels.SaveCourseStructureViewModelSchema
            },
            middleware: SaveCourseStructureResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TSaveCourseStructureUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveCourseStructureViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TSaveCourseStructureUseCaseErrorResponse,
            TSaveCourseStructureResponseMiddleware
        >,
    ): viewModels.TSaveCourseStructureViewModel {
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
        if (response.data.errorType === 'ValidationError') {
            return {
                mode: 'invalid',
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
