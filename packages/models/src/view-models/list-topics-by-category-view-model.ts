import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListTopicsByCategorySuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListTopicsByCategorySuccessSchema = ListTopicsByCategorySuccessResponseSchema.shape.data;
export type TListTopicsByCategorySuccess = z.infer<typeof ListTopicsByCategorySuccessSchema>;

// Define view mode schemas
const ListTopicsByCategoryDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListTopicsByCategorySuccessSchema
);

const ListTopicsByCategoryKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListTopicsByCategoryNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListTopicsByCategoryViewModelSchemaMap = {
    default: ListTopicsByCategoryDefaultViewModelSchema,
    kaboom: ListTopicsByCategoryKaboomViewModelSchema,
    notFound: ListTopicsByCategoryNotFoundViewModelSchema,
};
export type TListTopicsByCategoryViewModelSchemaMap = typeof ListTopicsByCategoryViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListTopicsByCategoryViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListTopicsByCategoryViewModelSchemaMap);
export type TListTopicsByCategoryViewModel = z.infer<typeof ListTopicsByCategoryViewModelSchema>;
