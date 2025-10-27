import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListPlatformCoachesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListPlatformCoachesSuccessSchema = ListPlatformCoachesSuccessResponseSchema.shape.data;
export type TListPlatformCoachesSuccess = z.infer<typeof ListPlatformCoachesSuccessSchema>;

// Define view mode schemas
const ListPlatformCoachesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListPlatformCoachesSuccessSchema
);

const ListPlatformCoachesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListPlatformCoachesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListPlatformCoachesViewModelSchemaMap = {
    default: ListPlatformCoachesDefaultViewModelSchema,
    kaboom: ListPlatformCoachesKaboomViewModelSchema,
    notFound: ListPlatformCoachesNotFoundViewModelSchema,
};
export type TListPlatformCoachesViewModelSchemaMap = typeof ListPlatformCoachesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListPlatformCoachesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListPlatformCoachesViewModelSchemaMap);
export type TListPlatformCoachesViewModel = z.infer<typeof ListPlatformCoachesViewModelSchema>;
