import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListTopicsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListTopicsSuccessSchema = ListTopicsSuccessResponseSchema.shape.data;
export type TListTopicsSuccess = z.infer<typeof ListTopicsSuccessSchema>;

// Define view mode schemas
const ListTopicsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListTopicsSuccessSchema
);

const ListTopicsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListTopicsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListTopicsViewModelSchemaMap = {
    default: ListTopicsDefaultViewModelSchema,
    kaboom: ListTopicsKaboomViewModelSchema,
    notFound: ListTopicsNotFoundViewModelSchema,
};
export type TListTopicsViewModelSchemaMap = typeof ListTopicsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListTopicsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListTopicsViewModelSchemaMap);
export type TListTopicsViewModel = z.infer<typeof ListTopicsViewModelSchema>;
