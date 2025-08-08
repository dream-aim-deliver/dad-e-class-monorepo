import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const SearchCoursesRequestSchema = DefaultPaginationSchema.extend({
  titleContains: z.string().optional(),
});

export type TSearchCoursesRequest = z.infer<typeof SearchCoursesRequestSchema>;

export const SearchCoursesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  courses: z.array(z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
    averageRating: z.number(),
    reviewCount: z.number(),
    author: z.object({
      username: z.string(),
      name: z.string(),
      surname: z.string(),
      avatarUrl: z.string().nullable(),
    })
  })),
}));

export type TSearchCoursesSuccessResponse = z.infer<typeof SearchCoursesSuccessResponseSchema>;

const SearchCoursesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSearchCoursesUseCaseErrorResponse = z.infer<typeof SearchCoursesUseCaseErrorResponseSchema>;

export const SearchCoursesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SearchCoursesSuccessResponseSchema,
  SearchCoursesUseCaseErrorResponseSchema,
]);

export type TSearchCoursesUseCaseResponse = z.infer<typeof SearchCoursesUseCaseResponseSchema>;
