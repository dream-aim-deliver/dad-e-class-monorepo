import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BasePartialSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
    CommonErrorSchemaMap
} from '@dream-aim-deliver/dad-cats';

export const ListCategoriesRequestSchema = z.object({});
export type TListCategoriesRequest = z.infer<typeof ListCategoriesRequestSchema>;

const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
});

const ListCategoriesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    categories: z.array(CategorySchema)
}));
export type TListCategoriesSuccessResponse = z.infer<typeof ListCategoriesSuccessResponseSchema>;

const ListCategoriesErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCategoriesErrorResponse = z.infer<typeof ListCategoriesErrorResponseSchema>;

const ListCategoriesUseCasePartialResponseSchema = BasePartialSchemaFactory(
    CategorySchema,
    CommonErrorSchemaMap
)
export type TListCategoriesUseCasePartialResponse = z.infer<typeof ListCategoriesUseCasePartialResponseSchema>;

const ListCategoriesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCategoriesSuccessResponseSchema,
    ListCategoriesErrorResponseSchema,
    ListCategoriesUseCasePartialResponseSchema
]);
export type TListCategoriesUseCaseResponse = z.infer<typeof ListCategoriesUseCaseResponseSchema>;

