import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachStudentsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCoachStudentsSuccessSchema = ListCoachStudentsSuccessResponseSchema.shape.data;
export type TListCoachStudentsSuccess = z.infer<typeof ListCoachStudentsSuccessSchema>;

// Define view mode schemas
const ListCoachStudentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCoachStudentsSuccessSchema
);

const ListCoachStudentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCoachStudentsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCoachStudentsViewModelSchemaMap = {
    default: ListCoachStudentsDefaultViewModelSchema,
    kaboom: ListCoachStudentsKaboomViewModelSchema,
    notFound: ListCoachStudentsNotFoundViewModelSchema,
};
export type TListCoachStudentsViewModelSchemaMap = typeof ListCoachStudentsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCoachStudentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCoachStudentsViewModelSchemaMap);
export type TListCoachStudentsViewModel = z.infer<typeof ListCoachStudentsViewModelSchema>;
