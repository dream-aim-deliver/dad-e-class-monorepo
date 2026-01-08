import { viewModels } from '@maany_shr/e-class-models';
import { TPrepareCheckoutUseCaseResponse, TPrepareCheckoutErrorResponse } from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';
import { PrepareCheckoutUseCaseResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TPrepareCheckoutPresenterUtilities = {};

export const PrepareCheckoutResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TPrepareCheckoutUseCaseResponse,
        viewModels.TPrepareCheckoutViewModel,
        TPrepareCheckoutPresenterUtilities
    >;

type TPrepareCheckoutResponseMiddleware =
    typeof PrepareCheckoutResponseMiddleware;

export default class PrepareCheckoutPresenter extends BasePresenter<
    TPrepareCheckoutUseCaseResponse,
    viewModels.TPrepareCheckoutViewModel,
    TPrepareCheckoutPresenterUtilities,
    TPrepareCheckoutResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TPrepareCheckoutViewModel) => void,
        viewUtilities: TPrepareCheckoutPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    PrepareCheckoutUseCaseResponseSchema,
                viewModel: viewModels.PrepareCheckoutViewModelSchema,
            },
            middleware: PrepareCheckoutResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            TPrepareCheckoutUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPrepareCheckoutViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TPrepareCheckoutErrorResponse,
            TPrepareCheckoutResponseMiddleware
        >,
    ): viewModels.TPrepareCheckoutViewModel {
        console.log('[PrepareCheckoutPresenter] presentError called with:', response);
        // Map error types to appropriate view modes
        const errorType = response.data.errorType;
        const message = response.data.message;
        console.log('[PrepareCheckoutPresenter] errorType:', errorType, 'message:', message);
        const errorData = {
            message: response.data.message,
            operation: response.data.operation,
            context: response.data.context,
        };

        // Coupon-related errors (check both errorType and message)
        if (errorType === 'coupon_not_found' || message === 'coupon_not_found') {
            return { mode: 'coupon-not-found', data: errorData };
        }

        if (errorType === 'coupon_expired' || message === 'coupon_expired') {
            return { mode: 'coupon-expired', data: errorData };
        }

        if (errorType === 'coupon_limit_reached' || errorType === 'coupon_user_limit_reached' ||
            message === 'coupon_limit_reached' || message === 'coupon_user_limit_reached') {
            return { mode: 'coupon-limit-reached', data: errorData };
        }

        if (errorType === 'invalid_coupon_type' || message === 'invalid_coupon_type') {
            return { mode: 'invalid-coupon-type', data: errorData };
        }

        // Ownership/enrollment errors (check both errorType and message)
        if (errorType === 'user_already_enrolled' || message === 'user_already_enrolled' ||
            message === 'selected_courses_already_owned') {
            const viewModel = { mode: 'already-owned' as const, data: errorData };
            console.log('[PrepareCheckoutPresenter] Returning already-owned viewModel:', viewModel);
            return viewModel;
        }

        // Not found errors (check both errorType and message)
        if (errorType === 'course_not_found' || message === 'course_not_found' ||
            errorType === 'package_not_found' || message === 'package_not_found' ||
            errorType === 'coaching_offering_not_found' || message === 'coaching_offering_not_found' ||
            errorType === 'lesson_component_not_found' || message === 'lesson_component_not_found') {
            return { mode: 'not-found', data: errorData };
        }

        // Not enrolled error (for coaching session purchase)
        if (errorType === 'not_enrolled_in_course' || message === 'not_enrolled_in_course') {
            return { mode: 'not-enrolled', data: errorData };
        }

        // Already purchased coaching
        if (errorType === 'component_coaching_already_purchased' || message === 'component_coaching_already_purchased') {
            return { mode: 'already-purchased', data: errorData };
        }

        // Default to kaboom for unknown errors
        const viewModel = { mode: 'kaboom' as const, data: errorData };
        console.log('[PrepareCheckoutPresenter] Returning kaboom viewModel:', viewModel);
        return viewModel;
    }
}
