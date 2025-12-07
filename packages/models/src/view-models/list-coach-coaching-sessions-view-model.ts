import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachCoachingSessionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const ListCoachCoachingSessionsSuccessSchema = ListCoachCoachingSessionsSuccessResponseSchema.shape.data;

export type TListCoachCoachingSessionsSuccess = z.infer<typeof ListCoachCoachingSessionsSuccessSchema>;

const ListCoachCoachingSessionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", ListCoachCoachingSessionsSuccessSchema);
const ListCoachCoachingSessionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const ListCoachCoachingSessionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const ListCoachCoachingSessionsViewModelSchemaMap = {
    default: ListCoachCoachingSessionsDefaultViewModelSchema,
    kaboom: ListCoachCoachingSessionsKaboomViewModelSchema,
    notFound: ListCoachCoachingSessionsNotFoundViewModelSchema,
};
export type TListCoachCoachingSessionsViewModelSchemaMap = typeof ListCoachCoachingSessionsViewModelSchemaMap;
export const ListCoachCoachingSessionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCoachCoachingSessionsViewModelSchemaMap);
export type TListCoachCoachingSessionsViewModel = z.infer<typeof ListCoachCoachingSessionsViewModelSchema>;
