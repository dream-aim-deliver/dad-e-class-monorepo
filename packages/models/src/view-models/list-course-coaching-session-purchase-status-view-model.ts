import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCourseCoachingSessionPurchaseStatusSuccessResponseSchema } from '../usecase-models/list-course-coaching-session-purchase-status-usecase-models';

export const ListCourseCoachingSessionPurchaseStatusSuccessSchema = ListCourseCoachingSessionPurchaseStatusSuccessResponseSchema.shape.data;

export type TListCourseCoachingSessionPurchaseStatusSuccess = z.infer<typeof ListCourseCoachingSessionPurchaseStatusSuccessSchema>;

const ListCourseCoachingSessionPurchaseStatusDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", ListCourseCoachingSessionPurchaseStatusSuccessSchema);
const ListCourseCoachingSessionPurchaseStatusKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const ListCourseCoachingSessionPurchaseStatusViewModelSchemaMap = {
    default: ListCourseCoachingSessionPurchaseStatusDefaultViewModelSchema,
    kaboom: ListCourseCoachingSessionPurchaseStatusKaboomViewModelSchema,
};
export type TListCourseCoachingSessionPurchaseStatusViewModelSchemaMap = typeof ListCourseCoachingSessionPurchaseStatusViewModelSchemaMap;
export const ListCourseCoachingSessionPurchaseStatusViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCourseCoachingSessionPurchaseStatusViewModelSchemaMap);
export type TListCourseCoachingSessionPurchaseStatusViewModel = z.infer<typeof ListCourseCoachingSessionPurchaseStatusViewModelSchema>;

